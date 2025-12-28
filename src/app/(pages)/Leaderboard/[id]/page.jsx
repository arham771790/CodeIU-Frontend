import { getLeaderboardService } from "@/lib/services/leaderboardService";
import LeaderboardClientView from "@/app/components/contest/LeaderboardClientView";

export default async function LeaderboardPage({ params }) {
  const { id } = await params;

  // 1. Server Fetch (Instant)
  const initialData = await getLeaderboardService(id);

  // 2. Render Client View
  return <LeaderboardClientView contestId={id} initialData={initialData} />;
}