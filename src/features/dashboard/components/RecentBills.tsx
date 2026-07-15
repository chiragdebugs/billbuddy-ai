import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { billService } from "@/features/bills/services/bill.service";

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
        console.error(
          "Failed to fetch recent bills:",
          error
        );
      } finally {
        setLoading(false);
      }
    };


    fetchRecentBills();
  }, []);


  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        Loading recent bills...
      </div>
    );
  }


  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          Recent Bills
        </h2>

        <Link
          to="/bills"
          className="text-sm font-medium text-emerald-600 hover:underline"
        >
          View All
        </Link>

      </div>


      {bills.length === 0 ? (

        <p className="text-slate-500">
          No bills created yet.
        </p>

      ) : (

        <div className="space-y-4">

          {bills.map((bill) => (

            <Link
              key={bill.id}
              to={`/bills/${bill.id}`}
              className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-slate-50"
            >

              <div>

                <h3 className="font-semibold text-slate-900">
                  {bill.title}
                </h3>

                <p className="text-sm text-slate-500">
                  👥 {bill.participants.length} participants
                </p>

              </div>


              <div className="text-right">

                <p className="font-bold text-slate-900">
                  ₹{bill.amount}
                </p>

                <p className="text-xs text-slate-500">
                  {new Date(
                    bill.created_at
                  ).toLocaleDateString()}
                </p>

              </div>


            </Link>

          ))}

        </div>

      )}

    </div>
  );
}