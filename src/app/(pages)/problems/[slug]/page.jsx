import { getProblems, getProblemById } from "@/lib/services/problemService";
import { notFound } from "next/navigation";
import TopNav from "@/components/organisms/TopNav";
import ProblemDescription from "@/components/organisms/ProblemDescription";
import CodeEditor from "@/components/organisms/CodeEditor";

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
    <div className="bg-base-100 flex flex-col min-h-screen font-sans text-base-content transition-colors duration-300">
      <TopNav problem={problem} problems={allProblems} />
      <main className="flex-1 overflow-hidden p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProblemDescription
          title={problem.title}
          description={problem.description}
          examples={problem.examples}
          constraints={problem.constraints}
          problemId={problem.id}
        />

        <CodeEditor
          problemId={problem.id}
          description={problem.description}
          codeSnippets={problem.codeSnippets}
          testcases={problem.visibleTestcases}
        />
      </main>
    </div>
  );
}