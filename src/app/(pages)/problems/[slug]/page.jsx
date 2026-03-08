import { getProblems, getProblemById } from "@/lib/services/problemService";
import { notFound } from "next/navigation";
import TopNav from "@/components/organisms/TopNav";
import dynamic from "next/dynamic";
const ProblemWorkspace = dynamic(() => import("@/components/organisms/ProblemWorkspace"), {
  loading: () => <div className="h-full flex gap-3 animate-pulse p-3">
    <div className="flex-1 bg-base-200 rounded-[2.5rem]" />
    <div className="flex-1 bg-base-200 rounded-[2.5rem]" />
  </div>
});

export default async function EachProblemPage({ params }) {
  const { slug } = await params;

  const [problem, allProblems] = await Promise.all([
    getProblemById(slug),
    getProblems()
  ]);

  if (!problem) {
    notFound();
  }

  return (
    <div className="bg-base-100 flex flex-col h-screen font-sans text-base-content transition-colors duration-300 overflow-hidden">
      <TopNav problem={problem} problems={allProblems} />
      <main className="flex-1 overflow-hidden p-3 pt-0">
        <ProblemWorkspace problem={problem} allProblems={allProblems} />
      </main>
    </div>
  );
}