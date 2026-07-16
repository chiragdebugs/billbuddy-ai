import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, CircleAlert, FileText, IndianRupee } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { notificationService, Notification } from "../services/notification.service";
import { Button } from "@/components/ui/button";

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (!user) return;

    // Listen to realtime inserts on the notifications table for this user
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "bill_created": return <FileText size={16} className="text-blue-500" />;
      case "payment_received": return <IndianRupee size={16} className="text-emerald-500" />;
      case "reminder_sent": return <CircleAlert size={16} className="text-amber-500" />;
      default: return <Bell size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 rounded-xl border bg-background p-4 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                  <Check size={14} /> Mark all read
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${notif.is_read ? 'bg-transparent hover:bg-muted/50' : 'bg-primary/5 hover:bg-primary/10'}`}
                    onClick={() => {
                      if (!notif.is_read) handleMarkAsRead(notif.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="mt-0.5 rounded-full bg-background p-1.5 shadow-sm border">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      {notif.link ? (
                        <Link to={notif.link} className="font-medium text-sm text-foreground hover:underline">
                          {notif.title}
                        </Link>
                      ) : (
                        <p className="font-medium text-sm text-foreground">{notif.title}</p>
                      )}
                      <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                        {formatRelativeTime(notif.created_at)}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
