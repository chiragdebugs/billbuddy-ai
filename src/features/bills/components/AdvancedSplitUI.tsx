import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SplitMode = "EQUAL" | "EXACT" | "PERCENTAGE" | "SHARES";

interface AdvancedSplitUIProps {
  totalAmount: number;
  participants: string[];
  onSplitsCalculated: (splits: { name: string; amount_owed: number }[], isValid: boolean) => void;
}

export default function AdvancedSplitUI({ totalAmount, participants, onSplitsCalculated }: AdvancedSplitUIProps) {
  const [mode, setMode] = useState<SplitMode>("EQUAL");
  const [values, setValues] = useState<Record<string, number>>({});
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize values when participants change
  useEffect(() => {
    const newValues: Record<string, number> = {};
    if (mode === "PERCENTAGE") {
      const split = 100 / (participants.length || 1);
      participants.forEach((p) => { newValues[p] = split; });
    } else if (mode === "SHARES") {
      participants.forEach((p) => { newValues[p] = 1; });
    } else if (mode === "EXACT") {
      const split = totalAmount / (participants.length || 1);
      participants.forEach((p) => { newValues[p] = Number(split.toFixed(2)); });
    }
    setValues(newValues);
  }, [participants, mode, totalAmount]);

  useEffect(() => {
    if (participants.length === 0) {
      onSplitsCalculated([], false);
      return;
    }

    let calculatedSplits: { name: string; amount_owed: number }[] = [];
    let valid = true;
    let msg = "";

    if (mode === "EQUAL") {
      const amountPerPerson = totalAmount / participants.length;
      calculatedSplits = participants.map((name) => ({
        name,
        amount_owed: Number(amountPerPerson.toFixed(2)),
      }));
    } else if (mode === "EXACT") {
      let sum = 0;
      calculatedSplits = participants.map((name) => {
        const val = values[name] || 0;
        sum += val;
        return { name, amount_owed: val };
      });
      // Allow minor floating point diffs
      if (Math.abs(sum - totalAmount) > 0.05) {
        valid = false;
        msg = `Total amounts must exactly match ₹${totalAmount}. Current sum: ₹${sum.toFixed(2)}`;
      }
    } else if (mode === "PERCENTAGE") {
      let sum = 0;
      calculatedSplits = participants.map((name) => {
        const percent = values[name] || 0;
        sum += percent;
        return { name, amount_owed: Number(((percent / 100) * totalAmount).toFixed(2)) };
      });
      if (Math.abs(sum - 100) > 0.01) {
        valid = false;
        msg = `Percentages must add up to exactly 100%. Current sum: ${sum.toFixed(2)}%`;
      }
    } else if (mode === "SHARES") {
      let totalShares = 0;
      participants.forEach((name) => { totalShares += values[name] || 0; });
      if (totalShares === 0) {
        valid = false;
        msg = "Total shares cannot be zero.";
      } else {
        calculatedSplits = participants.map((name) => {
          const share = values[name] || 0;
          return { name, amount_owed: Number(((share / totalShares) * totalAmount).toFixed(2)) };
        });
      }
    }

    setIsValid(valid);
    setErrorMessage(msg);
    onSplitsCalculated(calculatedSplits, valid);
  }, [mode, values, participants, totalAmount]);

  const handleValueChange = (name: string, value: string) => {
    const num = parseFloat(value);
    setValues((prev) => ({
      ...prev,
      [name]: isNaN(num) ? 0 : num,
    }));
  };

  if (participants.length === 0) return null;

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg tracking-tight">Split Options</h3>
        <div className="flex flex-wrap gap-2">
          {(["EQUAL", "EXACT", "PERCENTAGE", "SHARES"] as SplitMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                mode === m 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {m.charAt(0) + m.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {participants.map((name) => (
          <div key={name} className="flex items-center justify-between gap-4">
            <Label className="flex-1 text-base">{name}</Label>
            
            <div className="flex items-center gap-2">
              {mode !== "EQUAL" && (
                <div className="relative w-24">
                  <Input
                    type="number"
                    value={values[name] === 0 ? "" : values[name]}
                    onChange={(e) => handleValueChange(name, e.target.value)}
                    className="text-right pr-6"
                    step={mode === "SHARES" ? "1" : "0.01"}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                    {mode === "PERCENTAGE" ? "%" : mode === "SHARES" ? "x" : ""}
                  </span>
                </div>
              )}
              
              <div className="w-24 text-right font-medium text-foreground">
                ₹
                {mode === "EQUAL" 
                  ? (totalAmount / participants.length).toFixed(2)
                  : mode === "EXACT"
                    ? (values[name] || 0).toFixed(2)
                    : mode === "PERCENTAGE"
                      ? (((values[name] || 0) / 100) * totalAmount).toFixed(2)
                      : mode === "SHARES"
                        ? (() => {
                            const totalShares = participants.reduce((acc, p) => acc + (values[p] || 0), 0);
                            return totalShares ? (((values[name] || 0) / totalShares) * totalAmount).toFixed(2) : "0.00";
                          })()
                        : "0.00"
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isValid && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}
      
      {isValid && mode !== "EQUAL" && (
        <div className="flex items-center gap-2 text-sm text-success font-medium">
          <CheckCircle2 size={16} /> Math adds up perfectly!
        </div>
      )}
    </div>
  );
}
