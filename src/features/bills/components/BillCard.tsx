import { Link } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BillCardProps {
  id: string;
  title: string;
  amount: string;
  participants: number;
  status: string;
  category?: string;
}

import { getCategoryDetails } from "../constants/categories";

export default function BillCard({
  id,
  title,
  amount,
  participants,
  status,
  category,
}: BillCardProps) {
  const categoryInfo = getCategoryDetails(category);
  const CategoryIcon = categoryInfo.icon;
  return (
    <Card className="group flex flex-col transition-all duration-300 hover:shadow-card hover:-translate-y-1 overflow-hidden bg-card border border-black/5 shadow-soft relative">
      <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl -z-10 rounded-full", categoryInfo.color.replace("bg-", "bg-").replace("/10", ""))} />
      
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 pt-5 px-5">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl backdrop-blur-sm", categoryInfo.color)}>
            <CategoryIcon size={24} className="opacity-90" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight line-clamp-1">{title}</CardTitle>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Users size={14} />
              {participants} participants
            </p>
          </div>
        </div>
        <Badge variant={status === "Pending" ? "warning" : "success"} className="shadow-sm">
          {status}
        </Badge>
      </CardHeader>

      <CardContent className="pt-2 pb-6 px-5 flex-1">
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {amount}
        </p>
      </CardContent>

      <CardFooter className="pt-4 pb-4 px-5 border-t border-border/40 bg-muted/20">
        <Link to={`/bills/${id}`} className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group/link">
          <span>View Details</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border/50 shadow-sm transition-transform group-hover/link:translate-x-1">
            <ArrowRight size={14} className="text-foreground" />
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}