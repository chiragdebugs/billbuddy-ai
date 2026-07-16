import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, IndianRupee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import { billService } from "../services/bill.service";
import ParticipantList from "./ParticipantList";
import AdvancedSplitUI from "./AdvancedSplitUI";
import { groupService, Group } from "@/features/groups/services/group.service";
import { BILL_CATEGORIES } from "../constants/categories";
import AIVoiceModal from "./AIVoiceModal";
import { ParsedBill } from "../services/voiceParser.service";
import { Sparkles } from "lucide-react";

export default function BillForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialGroupId = searchParams.get("groupId");
  const initialTitle = searchParams.get("title");
  const initialAmount = searchParams.get("amount");
  const initialCategory = searchParams.get("category");

  const [title, setTitle] = useState(initialTitle || "");
  const [amount, setAmount] = useState(initialAmount || "");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [groupId, setGroupId] = useState(initialGroupId || "");
  const [groups, setGroups] = useState<Group[]>([]);
  const [category, setCategory] = useState(initialCategory || "General");
  const [calculatedSplits, setCalculatedSplits] = useState<{ name: string; amount_owed: number }[]>([]);
  const [isSplitValid, setIsSplitValid] = useState(true);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleVoiceParsed = (data: ParsedBill) => {
    setTitle(data.title);
    setAmount(data.amount.toString());
    setCategory(data.category);
    // Combine existing participants with new ones without duplicates
    const uniqueParticipants = Array.from(new Set([...participants, ...data.participants]));
    setParticipants(uniqueParticipants);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupService.getGroups();
        setGroups(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGroups();
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !amount || participants.length === 0) {
      setError("Please add title, amount and at least one participant");
      return;
    }

    if (!isSplitValid) {
      setError("Please fix the split math before submitting.");
      return;
    }

    try {
      setLoading(true);

      await billService.createBill({
        title,
        amount: Number(amount),
        description,
        participants: calculatedSplits,
        group_id: groupId || undefined,
        category,
      });

      alert("Bill created successfully!");
      navigate("/bills");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="overflow-hidden border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Voice Input
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Tap the mic and say: "I spent ₹800 on dinner with Amit"</p>
            </div>
            <Button type="button" onClick={() => setIsVoiceModalOpen(true)} className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              <Sparkles className="mr-2 h-4 w-4" /> Try it now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Bill Title</Label>
            <Input
              id="title"
              placeholder="Example: Goa Trip"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Group (Optional)</Label>
            <select
              id="group"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              disabled={!!initialGroupId}
            >
              <option value="">No Group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {BILL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Total Amount</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <IndianRupee size={16} />
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-9"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Add details about this expense..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <ParticipantList
        participants={participants}
        setParticipants={setParticipants}
      />

      {participants.length > 0 && (
        <AdvancedSplitUI
          totalAmount={Number(amount || 0)}
          participants={participants}
          onSplitsCalculated={(splits, valid) => {
            setCalculatedSplits(splits);
            setIsSplitValid(valid);
          }}
        />
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          variant="ghost"
          className="mr-2"
          onClick={() => navigate("/bills")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Creating..." : "Create Bill"}
        </Button>
      </div>

      <AIVoiceModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
        onParsed={handleVoiceParsed} 
      />
    </form>
  );
}