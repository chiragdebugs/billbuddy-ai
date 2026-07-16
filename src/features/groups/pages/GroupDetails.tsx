import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Users, IndianRupee, FileText } from "lucide-react";

import { groupService, Group } from "../services/group.service";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BillCard from "@/features/bills/components/BillCard";
import { OptimalSettlement } from "@/lib/settlement-engine";
import { Sparkles, ArrowRight } from "lucide-react";

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<OptimalSettlement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupDetails = async () => {
    if (!id) return;
    try {
      const data = await groupService.getGroupDetails(id);
      setGroup(data.group);
      setBills(data.bills);
      
      const optimal = await groupService.getGroupSettlements(id);
      setSettlements(optimal);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    const confirmed = window.confirm("Are you sure you want to delete this group? The bills inside it will not be deleted, but they will be removed from the group.");
    if (!confirmed) return;

    try {
      await groupService.deleteGroup(id);
      navigate("/groups");
    } catch (error) {
      console.error(error);
      alert("Failed to delete group");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-4 w-24" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4 mt-2" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold text-foreground">Group not found</h3>
        <p className="mt-2 text-muted-foreground">This group does not exist or has been deleted.</p>
        <Link to="/groups" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
          Return to Groups
        </Link>
      </div>
    );
  }

  const totalGroupExpenses = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link
        to="/groups"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} /> Back to Groups
      </Link>

      <Card className="overflow-hidden border-primary/10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between p-6 pb-0">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {group.name}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {group.description || "No description provided."}
            </p>
          </div>

          <Button variant="destructive" onClick={handleDelete} className="self-start sm:self-auto">
            <Trash2 className="mr-2" size={16} /> Delete Group
          </Button>
        </div>

        <CardContent className="mt-8 bg-muted/30 pt-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                <IndianRupee size={16} /> Total Expenses
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">₹{totalGroupExpenses}</h2>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                <Users size={16} /> Members
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{group.group_members?.length || 0}</h2>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                <FileText size={16} /> Bills
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{bills.length}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">

          {/* AI Debt Simplification Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              <h3 className="text-xl font-semibold tracking-tight">AI Debt Simplification</h3>
            </div>
            {settlements.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center bg-muted/20">
                  <p className="text-muted-foreground">All debts are settled! No transactions needed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {settlements.map((s, idx) => (
                  <Card key={idx} className="overflow-hidden border-primary/20">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="font-semibold text-foreground">{s.from}</div>
                        <div className="flex flex-col items-center text-muted-foreground text-xs gap-1">
                          <span>pays</span>
                          <ArrowRight size={16} />
                        </div>
                        <div className="font-semibold text-foreground">{s.to}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-bold text-lg text-primary">
                          ₹{s.amount}
                        </div>
                        <Button size="sm" onClick={() => alert("Optimal settlement resolution will mark multiple underlying bills as paid. (Coming soon)")}>
                          Settle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight">Settlement History</h3>
              <Link to={`/create-bill?groupId=${group.id}`} className={buttonVariants({ size: "sm" })}>
                Create Bill
              </Link>
            </div>
          
          {bills.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-muted/10">
              <p className="text-muted-foreground mb-4">No bills recorded in this group yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bills.map((bill) => (
                <BillCard 
                  key={bill.id} 
                  id={bill.id}
                  title={bill.title}
                  amount={`₹${bill.amount}`}
                  participants={bill.participants?.length || 0}
                  status={bill.participants?.every((p: any) => p.status === "Paid") ? "Paid" : "Pending"}
                />
              ))}
            </div>
          )}
        </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">Members</h3>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {group.group_members?.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
