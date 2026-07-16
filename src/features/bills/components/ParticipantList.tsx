import { useState } from "react";
import { User, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ParticipantListProps {
  participants: string[];
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ParticipantList({
  participants,
  setParticipants,
}: ParticipantListProps) {
  const [name, setName] = useState("");

  const addParticipant = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;
    setParticipants((prev) => [...prev, name.trim()]);
    setName("");
  };

  const removeParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={addParticipant} className="flex gap-3">
          <Input
            placeholder="Enter friend's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            <Plus size={16} className="mr-2" /> Add
          </Button>
        </form>

        {participants.length > 0 ? (
          <div className="space-y-2">
            {participants.map((person, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User size={14} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{person}</span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeParticipant(index)}
                >
                  <X size={14} />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No participants added yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}