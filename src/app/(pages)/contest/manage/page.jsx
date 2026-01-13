import ContestManager from "@/app/components/contest/ContestManager";
import { getContests } from "@/lib/services/contestService";

export const dynamic = 'force-dynamic';

export default async function ManageContestsPage() {
  // 1. Fetch on Server
  const contests = await getContests();

  // 2. Pass to Client Component
  return <ContestManager initialContests={contests} />;
}