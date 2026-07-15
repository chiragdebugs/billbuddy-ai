import { supabase } from "@/lib/supabase";

export const dashboardService = {

  getDashboardStats: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }


    const { data: bills, error: billsError } =
      await supabase
        .from("bills")
        .select(`
          id,
          amount,
          created_at
        `)
        .eq("created_by", user.id);


    if (billsError) {
      throw billsError;
    }


    const { data: participants, error: participantsError } =
      await supabase
        .from("participants")
        .select(`
          id,
          amount_owed,
          status,
          bills!inner(created_by)
        `)
        .eq("bills.created_by", user.id);


    if (participantsError) {
      throw participantsError;
    }


    const totalExpenses = bills.reduce(
      (sum, bill) =>
        sum + Number(bill.amount),
      0
    );


    const pendingPayments = participants.filter(
      (item) => item.status === "Pending"
    ).length;


    const paidPayments = participants.filter(
      (item) => item.status === "Paid"
    ).length;


    return {
      totalExpenses,
      totalBills: bills.length,
      pendingPayments,
      paidPayments,
      recentBills: bills.slice(0, 5),
    };
  },

};