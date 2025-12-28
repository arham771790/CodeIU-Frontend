import { getContestById } from "@/lib/services/contestService";
import ContestClientView from "@/app/components/contest/ContestClientView";
import { notFound } from "next/navigation";

export default async function ContestDetailPage({ params }) {
  // 1. Fetch on Server (Instant Load)
  const { id } = await params;
  const contest = await getContestById(id);

  if (!contest) {
    return notFound();
  }

  // 2. Pass to Client View
  return <ContestClientView initialContest={contest} />;
}