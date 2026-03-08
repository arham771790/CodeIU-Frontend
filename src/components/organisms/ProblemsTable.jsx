"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useProblemStore } from "@/store/useProblemStore";
import { BookOpen, CheckCircle, Circle, Loader2 } from "lucide-react";

const DifficultyChip = ({ difficulty }) => {
  const styles =
    difficulty === "EASY"
      ? "bg-success/10 text-success"
      : difficulty === "MEDIUM"
        ? "bg-warning/10 text-warning"
        : "bg-error/10 text-error";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${styles}`}>
      {difficulty}
    </span>
  );
};

const cleanTitle = (title, problemNo) => {
  if (!title) return "";
  const prefix = `${problemNo}. `;
  if (title.startsWith(prefix)) {
    return title.slice(prefix.length);
  }
  return title;
};

export default function ProblemsTable({ problems }) {
  const { authUser } = useAuthStore();
  const { solvedProblemsIds, fetchUserSolvedProblems, isSolvedLoading } = useProblemStore();

  // Fetch the solved problems when the component mounts IF the user is logged in
  useEffect(() => {
    if (authUser) {
      fetchUserSolvedProblems();
    }
  }, [authUser, fetchUserSolvedProblems]);

  return (
    <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2.5rem] overflow-hidden shadow-2xl mb-24">

      {/* Table Header — hidden on mobile */}
      <div className="hidden md:grid grid-cols-12 px-6 md:px-10 py-6 border-b border-base-content/5 bg-base-300 text-[11px] font-black opacity-40 uppercase tracking-[0.25em]">
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-5 text-left">Directory</div>
        <div className="col-span-2 text-center">Difficulty</div>
        <div className="col-span-2 text-center">Editorial</div>
        <div className="col-span-2 text-center">Acceptance</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-base-content/5">
        {problems.length > 0 ? (
          problems.map((problem, idx) => {

            // Check if this problem's ID is in the user's solved array
            const isSolved = solvedProblemsIds.includes(problem.id);

            return (
              <div
                key={problem.id}
                className={`relative transition-all duration-300 group
                  ${idx % 2 === 0 ? "bg-base-100" : "bg-base-200/40"} 
                  hover:bg-primary/[0.08]
                  
                  /* Mobile: card layout */
                  flex items-start gap-3 px-4 py-4
                  
                  /* Desktop: grid layout */
                  md:grid md:grid-cols-12 md:items-center md:px-10 md:py-6 md:hover:translate-x-1`}
              >

                <Link
                  href={`/problems/${problem.slug || problem.id}`}
                  className="absolute inset-0 z-0 cursor-pointer"
                  aria-label={`View problem ${problem.title}`}
                />

                {/* Solved Status */}
                <div className="flex-shrink-0 md:col-span-1 flex justify-center items-center relative z-20 mt-0.5">
                  {isSolvedLoading ? (
                    <Loader2 className="w-4 h-4 text-base-content/20 animate-spin" />
                  ) : isSolved ? (
                    <CheckCircle className="w-5 h-5 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  ) : (
                    <Circle className="w-4 h-4 text-base-content/20 group-hover:text-base-content/40 transition-colors" />
                  )}
                </div>

                {/* Directory / Title + mobile difficulty */}
                <div className="flex-1 min-w-0 md:col-span-5 relative z-10 pointer-events-none">
                  <div className="flex items-center gap-2 md:gap-5">
                    <span className="hidden md:inline text-xs font-mono opacity-20 font-black group-hover:text-primary group-hover:opacity-100 transition-all">
                      {String(problem.problemNo ?? idx + 1).padStart(2, "0")}
                    </span>
                    <p className="text-base-content font-semibold group-hover:text-primary transition-colors tracking-tight text-sm md:text-lg truncate">
                      {cleanTitle(problem.title, problem.problemNo)}
                    </p>
                  </div>
                  {/* Difficulty shown inline on mobile only */}
                  <div className="mt-1 md:hidden">
                    <DifficultyChip difficulty={problem.difficulty} />
                  </div>
                </div>

                {/* Difficulty — desktop only */}
                <div className="hidden md:flex col-span-2 justify-center items-center relative z-10 pointer-events-none">
                  <DifficultyChip difficulty={problem.difficulty} />
                </div>

                {/* Editorial — desktop only */}
                <div className="hidden md:flex col-span-2 justify-center items-center relative z-20">
                  {problem.editorial ? (
                    <div className="p-2 text-primary opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  ) : (
                    <span className="p-2 text-base-content/20 font-mono font-bold">-</span>
                  )}
                </div>

                {/* Acceptance — desktop only */}
                <div className="hidden md:flex col-span-2 justify-center items-center relative z-10 pointer-events-none">
                  <p className="font-mono text-sm font-black opacity-30 group-hover:opacity-100 group-hover:text-base-content transition-all">
                    {problem.acceptance || "-"}
                  </p>
                </div>

              </div>
            );
          })
        ) : (
          <div className="p-32 text-center opacity-20 font-black uppercase tracking-widest italic">
            No challenges available in this sector.
          </div>
        )}
      </div>
    </div>
  );
}