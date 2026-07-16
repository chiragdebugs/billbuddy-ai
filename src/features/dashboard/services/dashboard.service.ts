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
          created_at,
          category
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

    // Aggregate expenses by category
    const categoryDataMap: Record<string, number> = {};
    bills.forEach((bill) => {
      const cat = bill.category || "General";
      categoryDataMap[cat] = (categoryDataMap[cat] || 0) + Number(bill.amount);
    });

    const expensesByCategory = Object.entries(categoryDataMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort descending

    return {
      totalExpenses,
      totalBills: bills.length,
      pendingPayments,
      paidPayments,
      recentBills: bills.slice(0, 5),
      expensesByCategory,
    };
  },

  getActivityFeed: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch recent bills created
    const { data: bills, error: billsError } = await supabase
      .from("bills")
      .select("id, title, amount, created_at, category")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (billsError) throw billsError;

    // Fetch recent payments received
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select(`
        id,
        amount,
        created_at,
        users!payments_user_id_fkey(full_name),
        bills!inner(id, title, created_by)
      `)
      .eq("bills.created_by", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (paymentsError) throw paymentsError;

    // Transform and merge
    const activities = [
      ...(bills || []).map((b: any) => ({
        id: `bill-${b.id}`,
        type: "bill_created",
        title: `You created a bill: ${b.title}`,
        amount: b.amount,
        timestamp: b.created_at,
        metadata: { category: b.category }
      })),
      ...(payments || []).map((p: any) => ({
        id: `payment-${p.id}`,
        type: "payment_received",
        title: `${p.users?.full_name || "Someone"} paid for ${p.bills?.title}`,
        amount: p.amount,
        timestamp: p.created_at,
        metadata: {}
      }))
    ];

    // Sort descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return activities.slice(0, 10);
  },

};