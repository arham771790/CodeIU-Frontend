import {
  getProblemPageData,
  getProblemsPageData,
} from "@/lib/services/problemService";
import { notFound } from "next/navigation";
import Link from "next/link";
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

  const [problemResult, allProblemsResult] = await Promise.all([
    getProblemPageData(slug),
    getProblemsPageData(),
  ]);

  if (problemResult.error?.status === 404 && !problemResult.problem) {
    notFound();
  }

  if (!problemResult.problem) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-6">
        <div className="max-w-xl rounded-[2.5rem] border border-base-content/10 bg-base-200/70 p-10 text-center shadow-2xl backdrop-blur-md">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-warning">
            Problem Service Delayed
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight">
            This problem is temporarily unavailable
          </h1>
          <p className="mt-4 text-sm leading-6 text-base-content/70">
            {problemResult.error?.message ||
              "We could not load this problem right now. If the database is waking up, try again in a few moments."}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/problems" className="btn btn-primary rounded-2xl px-6">
              Back to Problems
            </Link>
            <Link href={`/problems/${slug}`} className="btn btn-ghost rounded-2xl px-6">
              Retry
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allProblems =
    allProblemsResult.problems?.length > 0
      ? allProblemsResult.problems
      : [problemResult.problem];

  return (
    <div className="bg-base-100 flex flex-col h-screen font-sans text-base-content transition-colors duration-300 overflow-hidden">
      <TopNav problem={problemResult.problem} problems={allProblems} />
      <main className="flex-1 overflow-hidden p-3 pt-0">
        <ProblemWorkspace problem={problemResult.problem} allProblems={allProblems} />
      </main>
    </div>
  );
}
