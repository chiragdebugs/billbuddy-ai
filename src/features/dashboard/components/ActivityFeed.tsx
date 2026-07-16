import { useEffect, useState } from "react";
import { CheckCircle2, Clock, PlusCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "../services/dashboard.service";
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: string;
  type: string;
  title: string;
  amount: number;
  timestamp: string;
  metadata: any;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await dashboardService.getActivityFeed();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activity feed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "bill_created":
        return <PlusCircle size={20} className="text-primary" />;
      case "payment_received":
        return <CheckCircle2 size={20} className="text-success" />;
      default:
        return <Clock size={20} className="text-muted-foreground" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 pb-6">
        {activities.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No recent activity.
          </div>
        ) : (
          <div className="relative border-l border-muted ml-5 space-y-6">
            {activities.map((activity, index) => (
              <motion.div 
                key={activity.id} 
                className="relative flex gap-4 pl-6"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Timeline Dot */}
                <span className="absolute -left-5 flex h-10 w-10 items-center justify-center rounded-full border-4 border-card bg-muted/30 shadow-sm">
                  {getIcon(activity.type)}
                </span>
                
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
                
                <div className="font-semibold text-sm">
                  {activity.type === "payment_received" ? "+" : ""}
                  ₹{activity.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
