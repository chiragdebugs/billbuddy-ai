import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { billService } from "../services/bill.service";

import ParticipantList from "./ParticipantList";
import SplitSummary from "./SplitSummary";

export default function BillForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const splitAmount =
    participants.length > 0
      ? Number(amount || 0) / participants.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!title || !amount || participants.length === 0) {
      setError(
        "Please add title, amount and at least one participant"
      );
      return;
    }

    try {
      setLoading(true);

      await billService.createBill({
        title,
        amount: Number(amount),
        description,
        participants,
      });

      alert("Bill created successfully 🚀");

      navigate("/bills");
    } catch (err: any) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="rounded-2xl border bg-white p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <Label>Bill Title</Label>

          <Input
            placeholder="Example: Goa Trip"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Total Amount</Label>

          <Input
            type="number"
            placeholder="₹ Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>

          <textarea
            className="min-h-28 w-full rounded-xl border p-3 text-sm"
            placeholder="Add details about this expense..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>
      </div>

      <ParticipantList
        participants={participants}
        setParticipants={setParticipants}
      />

      {participants.length > 0 && (
        <SplitSummary
          participants={participants}
          amount={splitAmount}
        />
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Bill"}
      </Button>
    </form>
  );
}