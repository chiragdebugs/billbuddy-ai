import { useState } from "react";
import { X, CreditCard, Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { loadRazorpay } from "@/lib/razorpay";
import type { RazorpayOptions } from "@/types/razorpay";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  amount: number;
  amountOwed: number;
  onSuccess: (gateway: string, transactionId: string, paidAmount: number) => Promise<void>;
}

export default function PaymentModal({
  isOpen,
  onClose,
  participantName,
  amount,
  amountOwed,
  onSuccess,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [payAmount, setPayAmount] = useState(amount.toString());

  if (!isOpen) return null;

  const paymentMethods = [
    { id: "razorpay", name: "Razorpay Checkout", icon: CreditCard },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Failed to load Razorpay SDK. Are you online?");
      setIsProcessing(false);
      return;
    }

    const numericAmount = Number(payAmount);

    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_invalid", // Fallback to avoid crash if env is missing
      amount: numericAmount * 100, // Amount is in currency subunits (paise)
      currency: "INR",
      name: "BillBuddy AI",
      description: `Settlement for ${participantName}`,
      handler: async function (response: any) {
        setIsSuccess(true);
        // Delay slightly for UX
        setTimeout(async () => {
          await onSuccess(selectedMethod, response.razorpay_payment_id, numericAmount);
          setIsSuccess(false);
          setSelectedMethod(null);
        }, 1500);
      },
      prefill: {
        name: participantName,
      },
      theme: {
        color: "#6366f1", // Match our primary brand color
      }
    };

    const rzp = new window.Razorpay(options);
    
    // Listen for modal close
    rzp.on('payment.failed', function (response: any) {
      console.error(response.error);
      setIsProcessing(false);
    });
    
    rzp.open();
    
    // We set processing false immediately after opening, because Razorpay has its own UI overlay
    // but leaving it true disables our buttons underneath while it's open.
    // However, if the user closes the modal without paying, we need a way to reset.
    // For now, Razorpay's modal will capture focus.
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={!isProcessing ? onClose : undefined}
      />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl border border-black/5 bg-card p-6 shadow-card duration-200 sm:rounded-xl">
        {!isSuccess ? (
          <>
            <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold leading-none tracking-tight">Select Payment Method</h2>
                <Button variant="ghost" size="icon" onClick={onClose} disabled={isProcessing}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Settling for {participantName}. Total pending: <span className="font-medium text-foreground">₹{amount}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                Amount to Pay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  max={amount}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      disabled={isProcessing}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all hover:bg-muted ${
                        selectedMethod === method.id 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-input bg-background"
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${selectedMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium">{method.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={!selectedMethod || isProcessing || !payAmount || Number(payAmount) <= 0 || Number(payAmount) > amount}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${payAmount}`
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="rounded-full bg-success/20 p-3 text-success">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Payment Successful!</h2>
            <p className="text-muted-foreground">The bill has been settled.</p>
          </div>
        )}
      </div>
    </>
  );
}
