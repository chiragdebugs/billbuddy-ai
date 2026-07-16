import { useState, useEffect } from "react";
import { ArrowRightLeft, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState<number | null>(null);

  // Mock rates against USD
  const rates: Record<string, number> = {
    USD: 1,
    INR: 83.2,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 151.4,
    AUD: 1.53,
    CAD: 1.36,
  };

  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setResult(null);
      return;
    }

    // Convert from -> USD -> To
    const amountInUSD = numAmount / rates[fromCurrency];
    const finalAmount = amountInUSD * rates[toCurrency];
    setResult(finalAmount);
  }, [amount, fromCurrency, toCurrency]);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Plane className="h-4 w-4 text-primary" />
          Travel Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground mb-1 block">Amount</label>
            <Input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="h-8 text-sm"
            />
          </div>
          <div className="w-20">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground mb-1 block">From</label>
            <select 
              value={fromCurrency} 
              onChange={(e) => setFromCurrency(e.target.value)}
              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm"
            >
              {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mt-5 text-muted-foreground">
            <ArrowRightLeft size={14} />
          </div>
          <div className="w-20">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground mb-1 block">To</label>
            <select 
              value={toCurrency} 
              onChange={(e) => setToCurrency(e.target.value)}
              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm"
            >
              {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {result !== null && (
          <div className="rounded-lg bg-background/50 p-3 text-center border">
            <p className="text-xs text-muted-foreground mb-1">Estimated Conversion</p>
            <p className="text-lg font-bold text-foreground">
              {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
