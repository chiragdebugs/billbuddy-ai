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
      <Card className="overflow-hidden bg-card shadow-soft hover:shadow-card transition-all border border-black/5 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold tracking-tight">{value}</div>
          {(subtitle || trend) && (
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "font-medium rounded-full px-2 py-0.5 text-xs",
                    trend.isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"
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