import { notFound } from "next/navigation";
import { getContestById } from "@/lib/services/contestService";
import ContestWorkspace from "@/app/components/contest/ContestWorkspace";

export default async function ContestProblemPage({ params }) {
  const { id } = await params;

  // 1. Fetch Contest Metadata (Fast, Server-Side)
  // We don't fetch problems here because that depends on the User's Bundle
  const contest = await getContestById(id);

  if (!contest) return notFound();

  return (
    // 2. Load the Interactive Workspace
    <ContestWorkspace contest={contest} />
  );
}