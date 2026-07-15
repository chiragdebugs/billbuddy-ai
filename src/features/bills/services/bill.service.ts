import { supabase } from "@/lib/supabase";

interface CreateBillData {
  title: string;
  amount: number;
  description: string;
  participants: string[];
}

interface UpdateBillData {
  title: string;
  amount: number;
  description: string;
}

export const billService = {
  createBill: async ({
    title,
    amount,
    description,
    participants,
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
      })
      .select()
      .single();

    if (billError) throw billError;


    const splitAmount = amount / participants.length;


    const participantsData = participants.map((name) => ({
      bill_id: bill.id,
      name,
      amount_owed: splitAmount,
      status: "Pending",
    }));


    const { error: participantError } = await supabase
      .from("participants")
      .insert(participantsData);

    if (participantError) throw participantError;

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
    }: UpdateBillData
  ) => {
    const { data, error } = await supabase
      .from("bills")
      .update({
        title,
        amount,
        description,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },


  markParticipantPaid: async (id: string) => {
    const { data, error } = await supabase
      .from("participants")
      .update({
        status: "Paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

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