"use server";

import { getLeaderboardService } from "@/lib/services/leaderboardService";

export async function refreshLeaderboardAction(contestId) {
  return await getLeaderboardService(contestId);
}