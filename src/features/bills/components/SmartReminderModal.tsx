import { useEffect, useState } from "react";
import { X, Sparkles, Brain, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { analyticsService, PaymentBehavior } from "../services/analytics.service";

interface SmartReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  participantName: string;
  billAgeDays: number;
}

export default function SmartReminderModal({
  isOpen,
  onClose,
  onConfirm,
  participantName,
  billAgeDays,
}: SmartReminderModalProps) {
  const [behavior, setBehavior] = useState<PaymentBehavior | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchAnalytics = async () => {
        setLoading(true);
        try {
          const data = await analyticsService.getParticipantPaymentBehavior(participantName, billAgeDays);
          setBehavior(data);
        } catch (error) {
          console.error("Failed to fetch analytics:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAnalytics();
    }
  }, [isOpen, participantName, billAgeDays]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="relative w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-xl"
        >
          {/* Header Gradient */}
          <div className="h-24 w-full bg-gradient-to-br from-primary/80 to-primary flex items-center px-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md">
              <Brain size={24} />
            </div>
            <div className="ml-4 text-white">
              <h2 className="text-xl font-bold">AI Smart Reminder</h2>
              <p className="text-sm text-white/80 opacity-90">Analyzing payment behavior</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/20 p-1 text-white hover:bg-black/40 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Sparkles className="animate-pulse text-primary" size={32} />
                <p className="text-sm font-medium text-muted-foreground">AI is crunching the numbers...</p>
              </div>
            ) : behavior ? (
              <div className="space-y-6">
                
                {/* AI Recommendation Box */}
                <div className={`rounded-xl border p-4 ${
                  behavior.recommendation === "Hold Off" ? "bg-success/10 border-success/20 text-success" :
                  behavior.recommendation === "Remind Now" ? "bg-destructive/10 border-destructive/20 text-destructive" :
                  "bg-warning/10 border-warning/20 text-warning"
                }`}>
                  <div className="flex items-start gap-3">
                    {behavior.recommendation === "Hold Off" ? <CheckCircle2 className="mt-0.5 shrink-0" size={18} /> :
                     behavior.recommendation === "Remind Now" ? <ShieldAlert className="mt-0.5 shrink-0" size={18} /> :
                     <Clock className="mt-0.5 shrink-0" size={18} />}
                    
                    <div>
                      <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">
                        AI Recommendation: {behavior.recommendation}
                      </h4>
                      <p className="text-sm opacity-90">
                        {behavior.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Points */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground mb-1">Average Pay Time</p>
                    <p className="text-lg font-bold text-foreground">
                      {behavior.averageDaysToPay !== null ? `${behavior.averageDaysToPay} days` : "N/A"}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground mb-1">Reliability Score</p>
                    <p className="text-lg font-bold text-foreground">
                      {behavior.reliabilityScore}%
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-4">
                  <Button 
                    className="w-full" 
                    variant={behavior.recommendation === "Hold Off" ? "outline" : "default"}
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    Send Reminder Anyway
                  </Button>
                  <Button 
                    variant={behavior.recommendation === "Hold Off" ? "default" : "ghost"} 
                    className="w-full"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Failed to load behavior analytics.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
