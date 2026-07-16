import { supabase } from "@/lib/supabase";
import { notificationService } from "@/features/notifications/services/notification.service";

interface CreateBillData {
  title: string;
  amount: number;
  description: string;
  participants: { name: string; amount_owed: number }[];
  group_id?: string;
  category?: string;
}

interface UpdateBillData {
  title: string;
  amount: number;
  description: string;
  category?: string;
}

export interface ProcessPaymentData {
  bill_id: string;
  participant_id: string;
  payer: string;
  receiver: string;
  amount: number;
  payment_gateway: string;
  transaction_id: string;
}

export interface ReminderData {
  participant_id: string;
  bill_id: string;
  message: string;
  channel?: string;
}

export const billService = {
  createBill: async ({
    title,
    amount,
    description,
    participants,
    group_id,
    category = "General",
  }: CreateBillData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: bill, error: billError } = await supabase
      .from("bills")
      .insert({
        title,
        amount,
        description,
        created_by: user.id,
        group_id: group_id || null,
        category,
      })
      .select()
      .single();

    if (billError) throw billError;


    const participantsData = participants.map((p) => ({
      bill_id: bill.id,
      name: p.name,
      amount_owed: p.amount_owed,
      status: "Pending",
    }));


    const { error: participantError } = await supabase
      .from("participants")
      .insert(participantsData);

    if (participantError) throw participantError;

    // Push notification to the creator
    await notificationService.createNotification({
      user_id: user.id,
      type: "bill_created",
      title: "Bill Created",
      message: `You created a new bill: ${title} for ₹${amount}`,
      link: `/bills/${bill.id}`
    }).catch(console.error);

    return bill;
  },


  getBills: async () => {
    const { data, error } = await supabase
      .from("bills")
      .select(`
        *,
        participants (*)
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return data;
  },


  updateBill: async (
    id: string,
    {
      title,
      amount,
      description,
      category,
    }: UpdateBillData
  ) => {
    const { data, error } = await supabase
      .from("bills")
      .update({
        title,
        amount,
        description,
        category: category || "General",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },


  markParticipantPaid: async (id: string, amountPaid: number) => {
    // Fetch current participant to check balances
    const { data: p } = await supabase
      .from("participants")
      .select("amount_owed, amount_paid")
      .eq("id", id)
      .single();
      
    if (!p) throw new Error("Participant not found");
    
    const newAmountPaid = Number(p.amount_paid || 0) + Number(amountPaid);
    const status = newAmountPaid >= Number(p.amount_owed) ? "Paid" : "Partially Paid";

    const { data, error } = await supabase
      .from("participants")
      .update({
        status,
        amount_paid: newAmountPaid,
        ...(status === "Paid" ? { paid_at: new Date().toISOString() } : {}),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  processPayment: async (paymentData: ProcessPaymentData) => {
    // 1. Insert into payments table
    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        bill_id: paymentData.bill_id,
        participant_id: paymentData.participant_id,
        payer: paymentData.payer,
        receiver: paymentData.receiver,
        amount: paymentData.amount,
        payment_gateway: paymentData.payment_gateway,
        transaction_id: paymentData.transaction_id,
        payment_status: "Success",
      });

    if (paymentError) throw paymentError;

    // 2. Mark participant as partially or fully paid
    const { data: p } = await supabase
      .from("participants")
      .select("amount_owed, amount_paid")
      .eq("id", paymentData.participant_id)
      .single();
      
    const newAmountPaid = Number(p?.amount_paid || 0) + Number(paymentData.amount);
    const status = newAmountPaid >= Number(p?.amount_owed) ? "Paid" : "Partially Paid";

    const { data, error: participantError } = await supabase
      .from("participants")
      .update({
        status,
        amount_paid: newAmountPaid,
        ...(status === "Paid" ? { paid_at: new Date().toISOString() } : {}),
      })
      .eq("id", paymentData.participant_id)
      .select()
      .single();

    if (participantError) throw participantError;

    // Notify the receiver (creator) that they got paid
    await notificationService.createNotification({
      user_id: paymentData.receiver,
      type: "payment_received",
      title: "Payment Received! 🎉",
      message: `${paymentData.payer} paid you ₹${paymentData.amount} via ${paymentData.payment_gateway}`,
      link: `/bills/${paymentData.bill_id}`
    }).catch(console.error);

    return data;
  },

  checkReminderEligibility: async (participantId: string) => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { data, error } = await supabase
      .from("reminders")
      .select("id, sent_at")
      .eq("participant_id", participantId)
      .gte("sent_at", twentyFourHoursAgo.toISOString())
      .limit(1);

    if (error) throw error;
    
    return data.length === 0;
  },

  sendReminder: async (reminderData: ReminderData) => {
    const isEligible = await billService.checkReminderEligibility(reminderData.participant_id);
    
    if (!isEligible) {
      throw new Error("A reminder was already sent in the last 24 hours.");
    }

    const { data, error } = await supabase
      .from("reminders")
      .insert({
        participant_id: reminderData.participant_id,
        bill_id: reminderData.bill_id,
        message: reminderData.message,
        channel: reminderData.channel || "In App",
      })
      .select()
      .single();

    if (error) throw error;

    // Notify the creator that they sent a reminder (for demo purposes since participants don't have user_ids yet)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await notificationService.createNotification({
        user_id: user.id,
        type: "reminder_sent",
        title: "Reminder Sent",
        message: `You sent a reminder to ${reminderData.participant_id} for bill ${reminderData.bill_id}`,
        link: `/bills/${reminderData.bill_id}`
      }).catch(console.error);
    }

    return data;
  },

  deleteBill: async (id: string) => {
    const { data, error } = await supabase
      .from("bills")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;

    return data;
  },
};