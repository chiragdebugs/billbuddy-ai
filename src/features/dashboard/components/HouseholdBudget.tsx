import { Users, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HouseholdBudget() {
  // Mock data for Household Budget
  const budget = 50000;
  const spent = 32500;
  const percentage = (spent / budget) * 100;

  return (
    <Card className="bg-primary/5 border border-primary/20 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          Household Monthly Budget
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-3xl font-bold tracking-tight">₹{spent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">spent of ₹{budget.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-primary">{percentage}%</p>
          </div>
        </div>
        
        <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden mb-4">
          <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md bg-background/50 p-2 border">
            <p className="text-muted-foreground mb-1">Groceries</p>
            <p className="font-semibold">₹12,400</p>
          </div>
          <div className="rounded-md bg-background/50 p-2 border">
            <p className="text-muted-foreground mb-1">Utilities</p>
            <p className="font-semibold">₹8,100</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
