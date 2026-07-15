import { Link } from "react-router-dom";

interface BillCardProps {
  id: string;
  title: string;
  amount: string;
  participants: number;
  status: string;
}

export default function BillCard({
  id,
  title,
  amount,
  participants,
  status,
}: BillCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
          {status}
        </span>
      </div>

      <p className="mt-6 text-4xl font-bold">
        {amount}
      </p>

      <p className="mt-3 text-slate-500">
        👥 {participants} participants
      </p>

      <Link
        to={`/bills/${id}`}
        className="mt-6 block rounded-xl border py-3 text-center font-medium hover:bg-slate-50"
      >
        View Details
      </Link>
    </div>
  );
}