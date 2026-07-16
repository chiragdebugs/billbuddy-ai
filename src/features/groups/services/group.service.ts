import { supabase } from "@/lib/supabase";
import { simplifyDebts, Transaction } from "@/lib/settlement-engine";

export interface GroupMember {
  id: string;
  group_id: string;
  name: string;
  joined_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  group_members?: GroupMember[];
}

export interface CreateGroupData {
  name: string;
  description?: string;
  members: string[];
}

export const groupService = {
  createGroup: async ({ name, description, members }: CreateGroupData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // 1. Insert Group
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert({
        name,
        description,
        created_by: user.id,
      })
      .select()
      .single();

    if (groupError) throw groupError;

    // 2. Insert Members (including the creator if they added themselves, otherwise we should probably always ensure the creator is a member)
    const membersData = members.map((memberName) => ({
      group_id: group.id,
      name: memberName,
    }));

    if (membersData.length > 0) {
      const { error: membersError } = await supabase
        .from("group_members")
        .insert(membersData);

      if (membersError) throw membersError;
    }

    return group;
  },

  getGroups: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("groups")
      .select(`
        *,
        group_members (*)
      `)
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Group[];
  },

  getGroupDetails: async (id: string) => {
    // Get Group + Members
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .select(`
        *,
        group_members (*)
      `)
      .eq("id", id)
      .single();

    if (groupError) throw groupError;

    // Get Bills for this group
    const { data: bills, error: billsError } = await supabase
      .from("bills")
      .select(`
        *,
        participants (*)
      `)
      .eq("group_id", id)
      .order("created_at", { ascending: false });

    if (billsError) throw billsError;

    return { group: group as Group, bills };
  },

  deleteGroup: async (id: string) => {
    const { data, error } = await supabase
      .from("groups")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  },

  getGroupSettlements: async (groupId: string) => {
    const { bills } = await groupService.getGroupDetails(groupId);
    
    const transactions: Transaction[] = [];

    for (const bill of bills) {
      // In a fully multi-user app, we'd fetch the creator's name. For now, "You" is the creditor.
      const creditor = "You";
      
      for (const p of bill.participants || []) {
        if (p.status !== "Paid") {
          const amountOwed = Number(p.amount_owed) - Number(p.amount_paid || 0);
          if (amountOwed > 0) {
            transactions.push({
              from: p.name,
              to: creditor,
              amount: amountOwed,
            });
          }
        }
      }
    }

    return simplifyDebts(transactions);
  },
};
