import { getProblems, getProblemById } from "@/lib/services/problemService";
import TopNav from "@/app/components/perProblem_comp/TopNav";
import ProblemDescription from "@/app/components/perProblem_comp/ProblemDescription";
import CodeEditor from "@/app/components/perProblem_comp/CodeEditor";

export default async function EachProblemPage({ params }) {
  const { id } = await params;

  const [problem, allProblems] = await Promise.all([
    getProblemById(id),
    getProblems() 
  ]);

  if (!problem) {
    return (
      <div className="bg-base-100 text-base-content min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Problem not found.</h1>
      </div>
    );
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
        />
        
        <CodeEditor
          description={problem.description}
          codeSnippets={problem.codeSnippets}
          testcases={problem.visibleTestcases}
        />
      </main>
    </div>
  );
}