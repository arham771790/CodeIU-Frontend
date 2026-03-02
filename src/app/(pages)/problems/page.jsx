import { getProblems } from "@/lib/services/problemService";
import ProblemFilters from "@/components/molecules/ProblemFilters";
import GridHighlights from "@/components/atoms/GridHighlights";
import { Terminal } from "lucide-react";
import ProblemsTable from "./ProblemsTable"; 

export default async function ProblemsPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || "";
  const difficulty = params?.difficulty || "";
  
  // 🚀 This is now 100% statically cached across all users!
  const problems = await getProblems(query, difficulty);

  return (
    <div className="bg-base-300 text-base-content font-sans min-h-screen overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-20 pointer-events-none" />

      <div
        className="absolute top-0 left-0 w-full h-[100vh] [mask-image:linear-gradient(to_bottom,black_40%,transparent)] pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <GridHighlights />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="relative z-10 py-12 md:py-24 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-primary/60 blur-[100px] rounded-full animate-pulse pointer-events-none" />

          <div className="flex flex-col items-center relative z-5">
            <h1 className="relative text-5xl md:text-7xl font-black tracking-tighter mb-4">
              <span className="relative inline-block mx-2">
                <span className="text-base-content">Problems</span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-primary/60 mx-2 animate-pulse">
                  X
                  <div className="absolute -top-2 -right-5 md:-top-7 md:-right-6 flex items-end gap-4 pointer-events-none">
                    <div className="relative p-2 bg-base-200 border-2 border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(var(--p),0.5)] animate-bounce">
                      <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full animate-pulse" />
                      <div className="absolute inset-[-8px] border border-dashed border-primary/40 rounded-full animate-[spin_10s_linear_infinite] opacity-50" />
                      <Terminal className="text-primary w-6 h-6 md:w-6 md:h-6 relative z-10 drop-shadow-[0_0_8px_rgba(var(--p),0.8)]" />
                    </div>
                  </div>
                </span>
              </span>
            </h1>

            <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mt-2">
              Boost your coding skills with our curated problems.
            </p>

            <div className="h-1.5 w-24 bg-primary mt-6 rounded-full shadow-[0_0_20px_rgba(var(--p),0.6)] mx-auto" />
          </div>
        </header>

        <div className="mb-10 relative z-20">
          <ProblemFilters />
        </div>

        {/* 🚀 Pass the cached problems down to the Client Component */}
        <ProblemsTable problems={problems} />
        
      </div>
    </div>
  );
}