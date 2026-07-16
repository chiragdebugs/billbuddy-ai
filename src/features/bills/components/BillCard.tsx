import { Link } from "react-router-dom";
import { Users, Receipt, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
    <Card className="group flex flex-col transition-all hover:border-primary/50 hover:shadow-soft">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", categoryInfo.color)}>
            <CategoryIcon size={20} />
          </div>
          <div>
            <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Users size={12} />
              {participants} participants
            </p>
          </div>
        </div>
        <Badge variant={status === "Pending" ? "warning" : "success"}>
          {status}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4">
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {amount}
        </p>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Link to={`/bills/${id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between bg-transparent")}>
          View Details
          <ArrowRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}