import { useNavigate } from "react-router-dom";
import { Plus, Users, ScanLine, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { exportToCSV } from "@/lib/export";
import { billService } from "@/features/bills/services/bill.service";
import { useState } from "react";

export default function QuickActions() {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const bills = await billService.getBills() as any[];
      if (!bills || bills.length === 0) return;
      
      const formattedData = bills.map(b => ({
        Date: new Date(b.created_at).toLocaleDateString(),
        Title: b.title,
        Category: b.category || "General",
        Amount: b.amount,
        Participants: b.participants?.length || 0
      }));

      exportToCSV(formattedData, `BillBuddy_Export_${new Date().toISOString().split('T')[0]}`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="shrink-0 bg-card shadow-soft border border-black/5">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
          <button
            onClick={() => navigate("/create-bill")}
            className="group flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-soft"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Plus size={20} />
            </div>
            <div className="w-full">
              <h3 className="text-sm font-semibold text-foreground truncate">Create Bill</h3>
              <p className="mt-1 text-xs text-muted-foreground truncate">Add a new expense</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/groups")}
            className="group flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-soft"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Users size={20} />
            </div>
            <div className="w-full">
              <h3 className="text-sm font-semibold text-foreground truncate">New Group</h3>
              <p className="mt-1 text-xs text-muted-foreground truncate">Split with friends</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/upload-receipt")}
            className="group flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-soft"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ScanLine size={20} />
            </div>
            <div className="w-full">
              <h3 className="text-sm font-semibold text-foreground truncate">Scan</h3>
              <p className="mt-1 text-xs text-muted-foreground truncate">Receipt AI</p>
            </div>
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="group flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-soft disabled:opacity-50"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Download size={20} className={isExporting ? "animate-bounce" : ""} />
            </div>
            <div className="w-full">
              <h3 className="text-sm font-semibold text-foreground truncate">Export</h3>
              <p className="mt-1 text-xs text-muted-foreground truncate">Download CSV</p>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}