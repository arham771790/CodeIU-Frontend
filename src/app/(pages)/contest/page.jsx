import { getContests } from "@/lib/services/contestService";
import ContestDashboard from "@/app/components/contest/ContestDashboard";

export default async function ContestPage() {
  // 1. Fetch on Server (Instant Load + SEO)
  const initialContests = await getContests();

  return (
    // 2. Pass data to the Client Component
    <ContestDashboard initialContests={initialContests} />
  );
}