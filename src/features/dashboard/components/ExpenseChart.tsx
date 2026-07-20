import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BILL_CATEGORIES } from "@/features/bills/constants/categories";

interface ExpenseChartProps {
  data: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-sm">
        <p className="mb-1 text-sm font-medium">{payload[0].name}</p>
        <p className="text-sm font-semibold text-foreground">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ data }: ExpenseChartProps) {
  // If no data, show a placeholder
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full xl:col-span-1 bg-card shadow-soft border border-black/5">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
          No expenses yet. Create a bill to see your spending trends.
        </CardContent>
      </Card>
    );
  }

  // Get matching colors from our constants
  // Note: Since Tailwind colors are classes, we need actual hex codes for Recharts.
  // We'll define a simple hex mapping based on the category names for Recharts to render the SVG.
  const categoryColors: Record<string, string> = {
    General: "#9ca3af", // gray-400
    Food: "#f97316", // orange-500
    Transport: "#3b82f6", // blue-500
    Housing: "#6366f1", // indigo-500
    Utilities: "#eab308", // yellow-500
    Shopping: "#ec4899", // pink-500
    Entertainment: "#a855f7", // purple-500
    Travel: "#0ea5e9", // sky-500
    Health: "#ef4444", // red-500
    Education: "#10b981", // emerald-500
  };

  const chartData = data.map(item => ({
    ...item,
    fill: categoryColors[item.name] || categoryColors.General
  }));

  return (
    <Card className="col-span-full xl:col-span-1 flex flex-col bg-card shadow-soft border border-black/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all duration-300 hover:opacity-80 outline-none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={false} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-2 text-sm pb-6">
          {chartData.map((entry) => {
            const categoryInfo = BILL_CATEGORIES.find(c => c.id === entry.name);
            return (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="h-2.5 w-2.5 rounded-full" 
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="truncate text-muted-foreground text-xs font-medium">
                  {categoryInfo?.label || entry.name}
                </span>
                <span className="ml-auto text-xs font-semibold text-foreground">
                  {Math.round((entry.value / chartData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
