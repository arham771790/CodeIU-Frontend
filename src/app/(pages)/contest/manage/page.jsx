import { getContests } from "@/lib/services/contestService";
import ContestManager from "@/app/components/contest/ContestManager"; // We will create this next

export default async function ManageContestsPage() {
  // 1. Fetch on Server
  const contests = await getContests();

  // 2. Pass to Client Component
  return <ContestManager initialContests={contests} />;
}