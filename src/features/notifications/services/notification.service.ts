import { supabase } from "@/lib/supabase";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface CreateNotificationData {
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}

export const notificationService = {
  createNotification: async (data: CreateNotificationData) => {
    const { error } = await supabase
      .from("notifications")
      .insert({
        ...data,
      });

    if (error) {
      console.error("Failed to insert notification:", error);
      throw error;
    }
  },

  getNotifications: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50); // Get latest 50 notifications

    if (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }

    return data as Notification[];
  },

  markAsRead: async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },
};
