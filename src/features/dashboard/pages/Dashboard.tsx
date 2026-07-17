import { useEffect, useState } from "react";
import { IndianRupee, ReceiptText, Clock, CheckCircle2 } from "lucide-react";

import DashboardHeader from "../components/DashboardHeader";
import QuickActions from "../components/QuickActions";
import RecentBills from "../components/RecentBills";
import StatsCard from "../components/StatsCard";
import CurrencyConverter from "../components/CurrencyConverter";
import HouseholdBudget from "../components/HouseholdBudget";
import { useAppMode } from "@/context/ModeProvider";
import AIInsights from "../components/AIInsights";
import ExpenseChart from "../components/ExpenseChart";
import ActivityFeed from "../components/ActivityFeed";

import { dashboardService } from "../services/dashboard.service";

interface DashboardStats {
  totalExpenses: number;
  totalBills: number;
  pendingPayments: number;
  paidPayments: number;
  recentBills: {
    id: string;
    amount: number;
    created_at: string;
  }[];
  expensesByCategory?: { name: string; value: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(
    null
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { mode } = useAppMode();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data =
          await dashboardService.getDashboardStats();

        setStats(data);

      } catch (err: any) {
        console.error(
          "Dashboard error:",
          err
        );
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive p-4 text-center">
        Error loading dashboard: {error}
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <DashboardHeader />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Expenses"
          value={`₹${stats?.totalExpenses || 0}`}
          subtitle="All bills created"
          icon={<IndianRupee size={16} />}
          trend={{ value: "+12.5%", isPositive: true }}
        />

        <StatsCard
          title="Total Bills"
          value={`${stats?.totalBills || 0}`}
          subtitle="Created bills"
          icon={<ReceiptText size={16} />}
          trend={{ value: "+2", isPositive: true }}
        />

        <StatsCard
          title="Pending Payments"
          value={`${stats?.pendingPayments || 0}`}
          subtitle="Need settlement"
          icon={<Clock size={16} />}
        />

        <StatsCard
          title="Paid Payments"
          value={`${stats?.paidPayments || 0}`}
          subtitle="Completed"
          icon={<CheckCircle2 size={16} />}
        />
      </section>

      <AIInsights />

      <div className="grid gap-8 lg:grid-cols-3">
        {mode === "Travel" && (
          <div className="lg:col-span-3">
            <CurrencyConverter />
          </div>
        )}
        
        {mode === "Family" && (
          <div className="lg:col-span-3">
            <HouseholdBudget />
          </div>
        )}

        <div className="lg:col-span-2 flex flex-col gap-8">
          <ExpenseChart data={stats?.expensesByCategory || []} />
          <RecentBills />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
          <QuickActions />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}