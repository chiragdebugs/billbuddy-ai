import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  BellRing,
  User,
  CreditCard,
  Zap, 
  ShieldCheck, 
  Crown, 
  ThumbsUp
} from "lucide-react";

import { billService } from "../services/bill.service";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryDetails } from "../constants/categories";
import PaymentModal from "../components/PaymentModal";
import SmartReminderModal from "../components/SmartReminderModal";
import { gamificationService, GamificationProfile } from "@/features/gamification/services/gamification.service";

interface Participant {
  id: string;
  name: string;
  amount_owed: number;
  amount_paid: number;
  status: string;
  paid_at: string | null;
}

interface Bill {
  id: string;
  title: string;
  amount: number;
  description: string | null;
  category?: string;
  participants: Participant[];
}

export default function BillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  
  // Smart Reminder State
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [remindingParticipant, setRemindingParticipant] = useState<Participant | null>(null);
  const [remindingId, setRemindingId] = useState<string | null>(null);

  // Gamification State
  const [profiles, setProfiles] = useState<Record<string, GamificationProfile>>({});

  const fetchBill = async () => {
    try {
      const bills = await billService.getBills();
      const selectedBill = bills.find((item: any) => item.id === id);
      setBill(selectedBill || null);

      if (selectedBill) {
        const leaderboard = await gamificationService.getLeaderboard();
        const profileMap: Record<string, GamificationProfile> = {};
        leaderboard.forEach(p => { profileMap[p.name] = p; });
        setProfiles(profileMap);
      }
    } catch (error) {
      console.error("Failed to fetch bill:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBill();
  }, [id]);

  const handleOpenPayment = (participant: Participant) => {
    setSelectedParticipant(participant);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (gateway: string, transactionId: string, paidAmount: number) => {
    if (!selectedParticipant || !bill || !user) return;
    
    try {
      await billService.processPayment({
        bill_id: bill.id,
        participant_id: selectedParticipant.id,
        payer: selectedParticipant.name,
        receiver: user.id, // Assuming the logged-in user is the receiver
        amount: paidAmount,
        payment_gateway: gateway,
        transaction_id: transactionId,
      });
      
      setPaymentModalOpen(false);
      setSelectedParticipant(null);
      await fetchBill();
    } catch (error) {
      console.error("Failed to process payment:", error);
      alert("Failed to record payment");
    }
  };

  const handleOpenReminder = (participant: Participant) => {
    setRemindingParticipant(participant);
    setReminderModalOpen(true);
  };

  const executeRemind = async () => {
    if (!bill || !remindingParticipant) return;
    const participant = remindingParticipant;
    
    setRemindingId(participant.id);
    
    try {
      await billService.sendReminder({
        participant_id: participant.id,
        bill_id: bill.id,
        message: `Hi ${participant.name}, you have ₹${participant.amount_owed - (participant.amount_paid || 0)} pending for ${bill.title}. Please pay via BillBuddy.`,
        channel: "In App"
      });
      alert(`Payment reminder sent to ${participant.name}!`);
    } catch (error: any) {
      console.error("Failed to send reminder:", error);
      alert(error.message || "Failed to send reminder");
    } finally {
      setRemindingId(null);
      setRemindingParticipant(null);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this bill?");
    if (!confirmDelete) return;

    try {
      await billService.deleteBill(id);
      navigate("/bills");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete bill");
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
          <CardContent>
            <Skeleton className="h-12 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold text-foreground">Bill not found</h3>
        <p className="mt-2 text-muted-foreground">The bill you are looking for does not exist or has been deleted.</p>
        <Link to="/bills" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
          Return to Bills
        </Link>
      </div>
    );
  }

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap": return <Zap size={12} className="mr-1" />;
      case "ShieldCheck": return <ShieldCheck size={12} className="mr-1" />;
      case "Crown": return <Crown size={12} className="mr-1" />;
      case "Clock": return <Clock size={12} className="mr-1" />;
      case "ThumbsUp": return <ThumbsUp size={12} className="mr-1" />;
      default: return null;
    }
  };

  const categoryInfo = getCategoryDetails(bill.category);
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        to="/bills"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} /> Back to Bills
      </Link>

      <Card className="overflow-hidden border-primary/10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between p-6 pb-0">
          <div className="flex items-start gap-4">
            <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", categoryInfo.color)}>
              <CategoryIcon size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {bill.title}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {bill.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Button
              variant="outline"
              onClick={() => navigate(`/bills/${id}/edit`)}
            >
              <Pencil className="mr-2" size={16} /> Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2" size={16} /> Delete
            </Button>
          </div>
        </div>

        <CardContent className="mt-8 bg-muted/30 pt-6">
          <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">₹{bill.amount}</h2>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {bill.participants?.map((person) => (
              <div
                key={person.id}
                className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-medium text-foreground">
                        {person.name}
                      </p>
                      {profiles[person.name]?.badges.slice(0, 2).map((badge) => (
                        <div key={badge.id} className={`flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.color}`} title={badge.description}>
                          {getBadgeIcon(badge.icon)}
                          {badge.name}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        ₹{person.amount_owed}
                      </p>
                      {person.amount_paid > 0 && person.amount_paid < person.amount_owed && (
                        <span className="text-xs font-medium text-success">
                          (₹{person.amount_paid} paid)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {person.status === "Paid" ? (
                    <Badge variant="success" className="h-8 gap-1.5 px-3">
                      <CheckCircle2 size={14} />
                      Paid
                    </Badge>
                  ) : (
                    <>
                      <Badge variant="warning" className="h-8 gap-1.5 px-3">
                        <Clock size={14} />
                        {person.status === "Partially Paid" ? "Partial" : "Pending"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={remindingId === person.id}
                        onClick={() => handleOpenReminder(person)}
                      >
                        <BellRing className={`mr-2 ${remindingId === person.id ? "animate-pulse" : ""}`} size={14} />
                        {remindingId === person.id ? "Sending..." : "Remind"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleOpenPayment(person)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <CreditCard className="mr-2" size={14} />
                        Pay Now
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Modal */}
      {selectedParticipant && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedParticipant(null);
          }}
          participantName={selectedParticipant.name}
          amountOwed={selectedParticipant.amount_owed}
          amount={selectedParticipant.amount_owed - (selectedParticipant.amount_paid || 0)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Smart Reminder Modal */}
      {remindingParticipant && bill && (
        <SmartReminderModal
          isOpen={reminderModalOpen}
          onClose={() => {
            setReminderModalOpen(false);
            setRemindingParticipant(null);
          }}
          onConfirm={executeRemind}
          participantName={remindingParticipant.name}
          billAgeDays={Math.ceil(Math.abs(new Date().getTime() - new Date((bill as any).created_at || new Date()).getTime()) / (1000 * 60 * 60 * 24))}
        />
      )}
    </div>
  );
}