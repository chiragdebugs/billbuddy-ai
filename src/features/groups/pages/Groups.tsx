import { useEffect, useState } from "react";
import { Users, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { groupService, Group } from "../services/group.service";

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Groups
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your shared expenses and trip groups.
          </p>
        </div>
        <Link to="/groups/create" className={cn(buttonVariants(), "self-start sm:self-auto")}>
          <Plus className="mr-2" size={16} />
          Create Group
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/4 mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
            <Users size={32} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">No groups yet</h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            Create a group to easily split bills for trips, apartments, or events with friends.
          </p>
          <Link to="/groups/create" className={buttonVariants()}>
            <Plus className="mr-2" size={16} />
            Create your first group
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Link key={group.id} to={`/groups/${group.id}`}>
              <Card className="group h-full cursor-pointer transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <ArrowRight className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" size={16} />
                  </div>
                  {group.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {group.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={16} />
                    <span>{group.group_members?.length || 0} members</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
