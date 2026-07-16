import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SplitSummaryProps {
  participants: string[];
  amount: number;
}

export default function SplitSummary({
  participants,
  amount,
}: SplitSummaryProps) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Calculator size={18} />
          Split Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {participants.map((person) => (
            <div
              key={person}
              className="flex items-center justify-between rounded-md border border-primary/10 bg-background/50 p-3 shadow-sm backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-foreground">
                {person}
              </span>
              <span className="text-sm font-bold tracking-tight text-primary">
                ₹{amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-primary/10 pt-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Each person pays
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-primary">
            ₹{amount.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}