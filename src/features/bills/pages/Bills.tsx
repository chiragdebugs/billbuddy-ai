import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BillCard from "../components/BillCard";
import { billService } from "../services/bill.service";

interface Bill {
  id: string;
  title: string;
  amount: number;
  participants: {
    id: string;
    name: string;
  }[];
}

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await billService.getBills();
        setBills(data as Bill[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading bills...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Bills
            </h1>

            <p className="mt-2 text-slate-500">
              Manage and split your expenses.
            </p>
          </div>

          <Link
            to="/create-bill"
            className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
          >
            + Create Bill
          </Link>
        </div>


        {bills.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
            No bills found. Create your first bill 🚀
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bills.map((bill) => (
              <BillCard
                key={bill.id}
                id={bill.id}
                title={bill.title}
                amount={`₹${bill.amount}`}
                participants={bill.participants.length}
                status="Pending"
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}