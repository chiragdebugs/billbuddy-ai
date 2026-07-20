import { Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AIInsights() {
  return (
    <Card className="bg-primary/5 border border-primary/20 shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles size={18} />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Based on your recent activity, your dining expenses are <span className="font-medium text-foreground">15% higher</span> than last month. 
          Consider reviewing your pending payments to optimize your cash flow.
        </p>
      </CardContent>
    </Card>
  );
}
