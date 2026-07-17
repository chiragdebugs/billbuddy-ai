import { useEffect, useState } from "react";
import { Plus, Receipt, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

import BillCard from "../components/BillCard";
import { billService } from "../services/bill.service";
import { BILL_CATEGORIES } from "../constants/categories";

interface Bill {
  id: string;
  title: string;
  amount: number;
  participants: {
    id: string;
    name: string;
    status: string;
  }[];
  category?: string;
}

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await billService.getBills();
        setBills(data as Bill[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleExportCSV = () => {
    if (bills.length === 0) return;

    // Headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Title,Amount,Category,Participants,Status\n";

    // Rows
    bills.forEach(bill => {
      const participantsStr = bill.participants.map(p => p.name).join(" & ");
      const status = bill.participants?.every((p) => p.status === "Paid") ? "Paid" : "Pending";
      const row = `"${bill.id}","${bill.title}",${bill.amount},"${bill.category || 'General'}","${participantsStr}","${status}"`;
      csvContent += row + "\n";
    });

    // Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `billbuddy_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Bills</h1>
            <p className="mt-2 text-muted-foreground">Manage and split your expenses.</p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Bills
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Manage and split your expenses.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button variant="outline" size="lg" onClick={handleExportCSV} disabled={bills.length === 0} className="w-full sm:w-auto">
            <Download className="mr-2" size={16} />
            Export CSV
          </Button>
          <Link to="/create-bill" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto shadow-soft")}>
            <Plus className="mr-2" size={18} />
            Create Bill
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("All")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
            selectedCategory === "All"
              ? "bg-accent text-accent-foreground shadow-soft"
              : "bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          All
        </button>
        {BILL_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                selectedCategory === cat.id
                  ? "bg-accent text-accent-foreground shadow-soft"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {bills.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
            <Receipt size={32} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">No bills found</h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            You haven't created any bills yet. Add your first expense to start splitting with friends.
          </p>
          <Link to="/create-bill" className={buttonVariants()}>
            <Plus className="mr-2" size={16} />
            Create your first bill
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bills
            .filter((b) => selectedCategory === "All" || b.category === selectedCategory)
            .map((bill) => (
            <BillCard
              key={bill.id}
              id={bill.id}
              title={bill.title}
              amount={`₹${bill.amount}`}
              participants={bill.participants.length}
              status={bill.participants?.every((p) => p.status === "Paid") ? "Paid" : "Pending"}
              category={bill.category}
            />
          ))}
          
          {bills.filter((b) => selectedCategory === "All" || b.category === selectedCategory).length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No bills found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}