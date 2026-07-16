import { supabase } from "@/lib/supabase";

export interface Badge {
  id: string;
  name: string;
  icon: "Zap" | "ShieldCheck" | "Crown" | "Clock" | "ThumbsUp";
  color: string;
  description: string;
}

export interface GamificationProfile {
  name: string;
  xp: number;
  level: number;
  rank: string;
  badges: Badge[];
  totalPaid: number;
  billsCount: number;
  reliabilityScore: number;
  averagePayTimeDays: number | null;
}

const calculateLevelAndRank = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  let rank = "Bronze Member";
  if (level >= 3) rank = "Silver Member";
  if (level >= 5) rank = "Gold Member";
  if (level >= 10) rank = "Platinum Member";
  if (level >= 20) rank = "Diamond Member";
  return { level, rank };
};

export const gamificationService = {
  getLeaderboard: async (): Promise<GamificationProfile[]> => {
    // 1. Fetch all participants globally (for the current user's bills)
    // To do this properly we need to fetch bills owned by the user, then their participants.
    // Since we don't have a direct join, we fetch participants directly.
    // RLS on participants will ensure we only see participants for bills we have access to.
    
    const { data: participants, error } = await supabase
      .from("participants")
      .select(`
        name,
        status,
        amount_owed,
        amount_paid,
        created_at,
        paid_at
      `);

    if (error) {
      console.error("Failed to fetch leaderboard data:", error);
      throw error;
    }

    if (!participants || participants.length === 0) return [];

    // 2. Group by name and aggregate stats
    const profilesMap = new Map<string, GamificationProfile>();

    participants.forEach((p) => {
      const name = p.name;
      if (!profilesMap.has(name)) {
        profilesMap.set(name, {
          name,
          xp: 0,
          level: 1,
          rank: "Bronze Member",
          badges: [],
          totalPaid: 0,
          billsCount: 0,
          reliabilityScore: 0,
          averagePayTimeDays: null,
        });
      }

      const profile = profilesMap.get(name)!;
      profile.billsCount += 1;
      profile.totalPaid += Number(p.amount_paid) || 0;
      
      // Calculate XP
      // Base XP for being part of a bill
      profile.xp += 10; 
      
      if (p.status === "Paid" && p.paid_at && p.created_at) {
        // Bonus XP for paying
        profile.xp += 50; 

        const createdDate = new Date(p.created_at);
        const paidDate = new Date(p.paid_at);
        const diffTime = Math.abs(paidDate.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Speed bonus
        if (diffDays <= 1) profile.xp += 100;
        else if (diffDays <= 3) profile.xp += 50;
        else if (diffDays <= 7) profile.xp += 20;

        // Track average time
        if (profile.averagePayTimeDays === null) {
          profile.averagePayTimeDays = diffDays;
        } else {
          // Running average
          profile.averagePayTimeDays = Math.round((profile.averagePayTimeDays + diffDays) / 2);
        }
      }
    });

    // 3. Assign Badges and finalize stats
    const profiles = Array.from(profilesMap.values());

    profiles.forEach((profile) => {
      // Calculate level/rank from XP
      const { level, rank } = calculateLevelAndRank(profile.xp);
      profile.level = level;
      profile.rank = rank;

      // Assign Badges
      if (profile.averagePayTimeDays !== null && profile.averagePayTimeDays <= 3 && profile.billsCount >= 2) {
        profile.badges.push({
          id: "fast_payer",
          name: "Fast Payer",
          icon: "Zap",
          color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
          description: "Pays within 3 days on average."
        });
      }

      if (profile.billsCount >= 3 && profile.totalPaid > 0) {
        profile.badges.push({
          id: "trusted_friend",
          name: "Trusted Friend",
          icon: "ShieldCheck",
          color: "bg-green-500/10 text-green-600 border-green-500/20",
          description: "Reliable and highly trusted."
        });
      }

      if (profile.level >= 5) {
        profile.badges.push({
          id: "gold_member",
          name: "Gold Member",
          icon: "Crown",
          color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          description: "Achieved Level 5 status."
        });
      }
      
      if (profile.averagePayTimeDays !== null && profile.averagePayTimeDays > 14) {
         profile.badges.push({
          id: "slow_payer",
          name: "Takes Their Time",
          icon: "Clock",
          color: "bg-muted text-muted-foreground border-border",
          description: "Takes over 2 weeks to pay on average."
        });
      }
      
      if (profile.badges.length === 0) {
         profile.badges.push({
          id: "good_friend",
          name: "Good Friend",
          icon: "ThumbsUp",
          color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          description: "A solid participant."
        });
      }
    });

    // 4. Sort by XP descending
    profiles.sort((a, b) => b.xp - a.xp);

    return profiles;
  },

  getParticipantProfile: async (name: string): Promise<GamificationProfile | null> => {
    const leaderboard = await gamificationService.getLeaderboard();
    return leaderboard.find(p => p.name === name) || null;
  }
};
