import { getLeaderboardService } from "@/lib/services/leaderboardService";
import dynamic from "next/dynamic";

const LeaderboardClientView = dynamic(() => import("@/components/organisms/LeaderboardClientView"), {
  loading: () => <div className="p-8 space-y-4 animate-pulse">
    <div className="h-24 bg-base-200 rounded-3xl" />
    <div className="h-96 bg-base-200 rounded-3xl" />
  </div>
});

export default async function LeaderboardPage({ params }) {
  const { id } = await params;

  // 1. Server Fetch (Instant)
  const initialData = await getLeaderboardService(id);

  // 2. Render Client View
  return <LeaderboardClientView contestId={id} initialData={initialData} />;
}