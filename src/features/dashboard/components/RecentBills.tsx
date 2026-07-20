import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Receipt, Users } from "lucide-react";

import { billService } from "@/features/bills/services/bill.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";

interface Bill {
  id: string;
  title: string;
  amount: number;
  created_at: string;
  participants: {
    id: string;
    name: string;
  }[];
}

export default function RecentBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBills = async () => {
      try {
        const data = await billService.getBills();
        setBills((data as Bill[]).slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch recent bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBills();
  }, []);

  if (loading) {
    return (
      <Card className="bg-card shadow-soft border border-black/5">
        <CardHeader>
          <CardTitle>Recent Bills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-soft border border-black/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Bills</CardTitle>
        <Link to="/bills" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          View all <ArrowRight className="ml-2" size={16} />
        </Link>
      </CardHeader>
      <CardContent>
        {bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3">
              <Receipt className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">No bills created yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Create a bill to start tracking expenses.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {bills.map((bill) => (
              <Link
                key={bill.id}
                to={`/bills/${bill.id}`}
                className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Receipt size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {bill.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Users size={12} />
                      {bill.participants.length} participants
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    ₹{bill.amount}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(bill.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}