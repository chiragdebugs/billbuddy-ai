import { useEffect, useState } from "react";

import DashboardHeader from "../components/DashboardHeader";
import QuickActions from "../components/QuickActions";
import RecentBills from "../components/RecentBills";
import StatsCard from "../components/StatsCard";

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
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(
    null
  );

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data =
          await dashboardService.getDashboardStats();

        setStats(data);

      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );
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


  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">

      <div className="mx-auto max-w-7xl space-y-8">

        <DashboardHeader />


        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <StatsCard
            title="Total Expenses"
            value={`₹${stats?.totalExpenses || 0}`}
            subtitle="All bills created"
          />


          <StatsCard
            title="Total Bills"
            value={`${stats?.totalBills || 0}`}
            subtitle="Created bills"
          />


          <StatsCard
            title="Pending Payments"
            value={`${stats?.pendingPayments || 0}`}
            subtitle="Need settlement"
          />


          <StatsCard
            title="Paid Payments"
            value={`${stats?.paidPayments || 0}`}
            subtitle="Completed"
          />

        </section>


        <QuickActions />


        <RecentBills />

      </div>

    </main>
  );
}