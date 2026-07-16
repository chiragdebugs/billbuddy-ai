import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { groupService } from "../services/group.service";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<string[]>([""]);

  const handleAddMember = () => {
    setMembers([...members, ""]);
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Filter out empty member names
    const validMembers = members.filter(m => m.trim() !== "");

    setLoading(true);
    try {
      const group = await groupService.createGroup({
        name,
        description,
        members: validMembers,
      });
      navigate(`/groups/${group.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/groups"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} /> Back to Groups
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Create Group
        </h1>
        <p className="text-muted-foreground">
          Set up a new space to track expenses with your friends.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Group Details</CardTitle>
          <CardDescription>Give your group a name and add members.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Goa Trip 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Expenses for our summer getaway"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Members</Label>
              {members.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    placeholder="Member name"
                  />
                  {members.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveMember(index)}
                      className="shrink-0"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMember}
                className="w-full border-dashed"
              >
                <Plus className="mr-2" size={16} /> Add Another Member
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
