import { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, CreditCard, Clock } from "lucide-react";
import { subscriptionService, Subscription } from "../services/subscription.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState<"Monthly" | "Yearly" | "Weekly">("Monthly");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [category, setCategory] = useState("Entertainment");

  const fetchSubscriptions = async () => {
    setLoading(true);
    const data = await subscriptionService.getSubscriptions();
    // Sort by next billing date
    data.sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime());
    setSubscriptions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !nextBillingDate) return;

    await subscriptionService.addSubscription({
      name,
      amount: Number(amount),
      cycle,
      next_billing_date: nextBillingDate,
      category,
    });
    
    setIsModalOpen(false);
    setName("");
    setAmount("");
    setNextBillingDate("");
    fetchSubscriptions();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this subscription?")) return;
    await subscriptionService.deleteSubscription(id);
    fetchSubscriptions();
  };

  const totalMonthlySpend = subscriptions.reduce((acc, sub) => {
    if (sub.cycle === "Monthly") return acc + sub.amount;
    if (sub.cycle === "Yearly") return acc + (sub.amount / 12);
    if (sub.cycle === "Weekly") return acc + (sub.amount * 4);
    return acc;
  }, 0);

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const billDate = new Date(dateStr);
    billDate.setHours(0, 0, 0, 0);
    const diffTime = billDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calendar size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Subscriptions
            </h1>
            <p className="text-muted-foreground">
              Track your recurring expenses.
            </p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" /> Add Subscription
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full border-primary/20 bg-primary/5 sm:col-span-1 lg:col-span-1 overflow-hidden relative">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Monthly Spend</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
              ₹{Math.round(totalMonthlySpend)}
            </h2>
            <div className="absolute -right-4 -bottom-4 text-primary/10">
              <CreditCard size={120} />
            </div>
          </CardContent>
        </Card>

        {subscriptions.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            No subscriptions tracked yet. Keep your recurring bills organized!
          </div>
        ) : (
          subscriptions.map((sub) => {
            const daysUntil = getDaysUntil(sub.next_billing_date);
            const isDueSoon = daysUntil >= 0 && daysUntil <= 3;
            const isOverdue = daysUntil < 0;

            return (
              <Card key={sub.id} className={`transition-all hover:shadow-md ${isDueSoon ? 'border-orange-500/50 bg-orange-500/5' : isOverdue ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{sub.name}</h3>
                      <p className="text-sm text-muted-foreground">{sub.category}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(sub.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-foreground">₹{sub.amount}</span>
                    <span className="text-sm font-medium text-muted-foreground mb-1">/{sub.cycle.toLowerCase()}</span>
                  </div>

                  <div className={`flex items-center gap-2 text-sm font-medium ${isOverdue ? 'text-destructive' : isDueSoon ? 'text-orange-600' : 'text-muted-foreground'}`}>
                    <Clock size={16} />
                    {isOverdue 
                      ? `Overdue by ${Math.abs(daysUntil)} days` 
                      : daysUntil === 0 
                      ? "Due Today" 
                      : `Due in ${daysUntil} days`}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Subscription Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border bg-card p-6 shadow-xl"
            >
              <h2 className="text-xl font-bold mb-4">Add Subscription</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Service Name</label>
                  <Input required placeholder="Netflix, Spotify, Rent..." value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Amount</label>
                    <Input required type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Cycle</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={cycle} 
                      onChange={(e) => setCycle(e.target.value as any)}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Next Billing Date</label>
                  <Input required type="date" value={nextBillingDate} onChange={(e) => setNextBillingDate(e.target.value)} />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="w-full">Save</Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
