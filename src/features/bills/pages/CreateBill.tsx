import { Link } from "react-router-dom";

import BillForm from "../components/BillForm";

export default function CreateBill() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Link
            to="/bills"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            ← Back to Bills
          </Link>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Create New Bill
          </h1>

          <p className="mt-2 text-slate-500">
            Add an expense and split it with your friends.
          </p>
        </div>

        <BillForm />
      </div>
    </main>
  );
}