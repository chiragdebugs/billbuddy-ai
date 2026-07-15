import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ParticipantListProps {
  participants: string[];
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ParticipantList({
  participants,
  setParticipants,
}: ParticipantListProps) {
  const [name, setName] = useState("");

  const addParticipant = () => {
    if (!name.trim()) return;

    setParticipants((prev) => [...prev, name.trim()]);
    setName("");
  };

  const removeParticipant = (index: number) => {
    setParticipants((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4 rounded-2xl border bg-white p-6">
      <h2 className="text-xl font-semibold">
        Participants
      </h2>

      <div className="flex gap-3">
        <Input
          placeholder="Enter friend's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button
          type="button"
          onClick={addParticipant}
        >
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {participants.map((person, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border p-3"
          >
            <span>{person}</span>

            <button
              type="button"
              onClick={() => removeParticipant(index)}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}