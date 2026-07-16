import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatsCardProps) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="overflow-hidden bg-card hover:shadow-card transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="text-muted-foreground/50">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {(subtitle || trend) && (
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "font-medium",
                    trend.isPositive ? "text-emerald-500" : "text-destructive"
                  )}
                >
                  {trend.value}
                </span>
              )}
              {subtitle && <span>{subtitle}</span>}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}