import { supabase } from "@/lib/supabase";

export interface Subscription {
  id: string;
  user_id?: string;
  name: string;
  amount: number;
  cycle: "Monthly" | "Yearly" | "Weekly";
  next_billing_date: string; // ISO Date String
  category: string;
  created_at?: string;
}

export const subscriptionService = {
  getSubscriptions: async (): Promise<Subscription[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("next_billing_date", { ascending: true });

    if (error) {
      console.error("Failed to load subscriptions", error);
      return [];
    }

    return data as Subscription[];
  },

  addSubscription: async (sub: Omit<Subscription, "id" | "user_id" | "created_at">): Promise<Subscription> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        name: sub.name,
        amount: sub.amount,
        cycle: sub.cycle,
        next_billing_date: sub.next_billing_date,
        category: sub.category
      })
      .select()
      .single();

    if (error) throw error;
    return data as Subscription;
  },

  updateSubscription: async (id: string, updates: Partial<Omit<Subscription, "id" | "user_id" | "created_at">>): Promise<Subscription> => {
    const { data, error } = await supabase
      .from("subscriptions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Subscription;
  },

  deleteSubscription: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
