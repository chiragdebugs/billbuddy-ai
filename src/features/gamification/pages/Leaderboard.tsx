import { useEffect, useState } from "react";
import { Trophy, Medal, Award, Zap, ShieldCheck, Crown, Clock, ThumbsUp } from "lucide-react";
import { gamificationService, GamificationProfile } from "../services/gamification.service";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Leaderboard() {
  const [profiles, setProfiles] = useState<GamificationProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await gamificationService.getLeaderboard();
        setProfiles(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap": return <Zap size={14} className="mr-1" />;
      case "ShieldCheck": return <ShieldCheck size={14} className="mr-1" />;
      case "Crown": return <Crown size={14} className="mr-1" />;
      case "Clock": return <Clock size={14} className="mr-1" />;
      case "ThumbsUp": return <ThumbsUp size={14} className="mr-1" />;
      default: return null;
    }
  };

  const getRankMedal = (index: number) => {
    if (index === 0) return <Trophy className="text-yellow-500" size={24} />;
    if (index === 1) return <Medal className="text-slate-400" size={24} />;
    if (index === 2) return <Medal className="text-amber-600" size={24} />;
    return <div className="flex h-6 w-6 items-center justify-center font-bold text-muted-foreground">{index + 1}</div>;
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Award size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Friends Leaderboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Ranked by XP and payment reliability.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {profiles.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            No friends to rank yet. Add participants to bills!
          </div>
        ) : (
          profiles.map((profile, index) => (
            <Card key={profile.name} className={`overflow-hidden transition-all hover:shadow-md ${index === 0 ? 'border-yellow-500/50 bg-yellow-500/5' : ''}`}>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center p-5 gap-4">
                  {/* Rank & Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="flex w-8 justify-center shrink-0">
                      {getRankMedal(index)}
                    </div>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{profile.name}</h3>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Level {profile.level} • {profile.rank}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {profile.badges.map(badge => (
                        <div key={badge.id} className={`flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.color}`} title={badge.description}>
                          {getIcon(badge.icon)}
                          {badge.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 sm:border-l sm:pl-6">
                    <div className="text-center">
                      <p className="text-2xl font-black text-primary">{profile.xp}</p>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">XP</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-lg font-bold text-foreground">{profile.billsCount}</p>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Bills</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
