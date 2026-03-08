import { getContestById } from "@/lib/services/contestService";
import dynamic from "next/dynamic";
const ContestClientView = dynamic(() => import("@/components/organisms/ContestClientView"), {
  loading: () => <div className="min-h-screen bg-base-100 p-8 flex flex-col gap-6 animate-pulse">
    <div className="h-48 bg-base-200 rounded-[2.5rem]" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 h-96 bg-base-200 rounded-[2.5rem]" />
      <div className="h-96 bg-base-200 rounded-[2.5rem]" />
    </div>
  </div>
});
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