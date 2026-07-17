import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Here's an overview of your expenses and recent activity.
        </p>
      </div>

      <Button
        size="lg"
        onClick={() => navigate("/create-bill")}
        className="self-start sm:self-auto shadow-soft"
      >
        <Plus className="mr-2" size={18} />
        New Bill
      </Button>
    </div>
  );
}