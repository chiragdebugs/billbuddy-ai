interface SplitSummaryProps {
  participants: string[];
  amount: number;
}

export default function SplitSummary({
  participants,
  amount,
}: SplitSummaryProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Split Summary
      </h2>

      <div className="space-y-3">
        {participants.map((person) => (
          <div
            key={person}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <span className="font-medium text-slate-700">
              {person}
            </span>

            <span className="font-bold text-slate-900">
              ₹{amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t pt-4">
        <p className="text-sm text-slate-500">
          Each person pays
        </p>

        <p className="text-2xl font-bold text-emerald-600">
          ₹{amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}