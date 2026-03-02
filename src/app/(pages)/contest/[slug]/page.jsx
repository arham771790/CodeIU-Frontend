import { getContestById } from "@/lib/services/contestService";
import ContestClientView from "@/components/organisms/ContestClientView";
import { notFound } from "next/navigation";

export default async function ContestDetailPage({ params }) {
  // 1. Fetch on Server (Instant Load)
  const { slug } = await params;
  const contest = await getContestById(slug);

  if (!contest) {
    return notFound();
  }

  // 2. Pass to Client View
  return <ContestClientView initialContest={contest} />;
}