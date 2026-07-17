import { supabase } from "@/lib/supabase";

export interface PaymentBehavior {
  participantName: string;
  totalBills: number;
  paidBills: number;
  averageDaysToPay: number | null;
  reliabilityScore: number; // 0 to 100
  recommendation: "Hold Off" | "Gentle Nudge" | "Remind Now";
  message: string;
}

export const analyticsService = {
  getParticipantPaymentBehavior: async (participantName: string, currentBillAgeDays: number): Promise<PaymentBehavior> => {
    // 1. Fetch all past records for this participant (case-insensitive if possible, or exact match)
    const { data: participants, error } = await supabase
      .from("participants")
      .select(`
        id,
        status,
        created_at,
        paid_at,
        amount_owed,
        amount_paid
      `)
      .eq("name", participantName);

    if (error) {
      console.error("Failed to fetch participant behavior:", error);
      throw error;
    }

    if (!participants || participants.length === 0) {
      return {
        participantName,
        totalBills: 0,
        paidBills: 0,
        averageDaysToPay: null,
        reliabilityScore: 50,
        recommendation: "Gentle Nudge",
        message: "No past payment history found for this person.",
      };
    }

    // 2. Analyze payment history
    let totalDaysToPay = 0;
    let paidCount = 0;
    let totalOwed = 0;
    let totalPaid = 0;

    participants.forEach((p) => {
      totalOwed += Number(p.amount_owed) || 0;
      totalPaid += Number(p.amount_paid) || 0;

      if (p.status === "Paid" && p.paid_at && p.created_at) {
        const createdDate = new Date(p.created_at);
        const paidDate = new Date(p.paid_at);
        
        // Calculate diff in days
        const diffTime = Math.abs(paidDate.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        totalDaysToPay += diffDays;
        paidCount++;
      }
    });

    const averageDaysToPay = paidCount > 0 ? Math.round(totalDaysToPay / paidCount) : null;
    
    // Simple reliability score based on percentage of amount paid vs owed across all bills
    let reliabilityScore = totalOwed > 0 ? Math.round((totalPaid / totalOwed) * 100) : 50;
    if (reliabilityScore > 100) reliabilityScore = 100;

    // 3. Generate AI Recommendation
    let recommendation: PaymentBehavior["recommendation"];
    let message: string;

    if (averageDaysToPay !== null) {
      if (currentBillAgeDays < averageDaysToPay - 1) {
        recommendation = "Hold Off";
        message = `${participantName} usually pays in ${averageDaysToPay} days. It has only been ${currentBillAgeDays} days. Give them some time!`;
      } else if (currentBillAgeDays >= averageDaysToPay + 2) {
        recommendation = "Remind Now";
        message = `${participantName} is usually faster than this (avg: ${averageDaysToPay} days). It has been ${currentBillAgeDays} days. A reminder is recommended.`;
      } else {
        recommendation = "Gentle Nudge";
        message = `${participantName} usually pays around this time (${averageDaysToPay} days). A gentle nudge might be helpful.`;
      }
    } else {
      if (currentBillAgeDays > 7) {
        recommendation = "Remind Now";
        message = `This bill is over a week old and ${participantName} hasn't paid previous bills fully. Remind them now.`;
      } else {
        recommendation = "Hold Off";
        message = `This bill is relatively new (${currentBillAgeDays} days) and there is no past completion data.`;
      }
    }

    return {
      participantName,
      totalBills: participants.length,
      paidBills: paidCount,
      averageDaysToPay,
      reliabilityScore,
      recommendation,
      message,
    };
  }
};
