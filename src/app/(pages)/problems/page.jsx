import Link from "next/link";
import { getProblems } from "@/lib/services/problemService";
import ProblemFilters from "@/app/components/ProblemFilters";
<<<<<<< HEAD
import GridHighlights from "@/app/components/GridHighlights";
import { Terminal } from "lucide-react";

const DifficultyChip = ({ difficulty }) => {
  const styles =
    difficulty === "EASY"
      ? "bg-green-500/10 text-green-600 dark:text-green-400"
      : difficulty === "MEDIUM"
        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
=======

export const metadata = {
  title: "Coding Problems",
  description: "Browse and solve a wide range of coding problems, from easy to hard. Enhance your algorithmic thinking and coding skills.",
};

const problemSets = [
  { title: "Master Interview", progress: "0/25", author: "By CodeIU" },
  { title: "Array Mastery", progress: "0/15", author: "By CodeIU" },
  { title: "Master Google Prep", progress: "0/15", author: "By CodeIU" },
];

const DifficultyChip = ({ difficulty }) => {
  const styles =
    difficulty === "EASY" ? "bg-green-500/10 text-green-600 dark:text-green-400"
      : difficulty === "MEDIUM" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
>>>>>>> a2dcbee15667a99e7abf68a51c10c6f8081bbf7e
        : "bg-red-500/10 text-red-600 dark:text-red-400";

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${styles}`}
    >
      {difficulty}
    </span>
  );
};

export default async function ProblemsPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || "";
  const difficulty = params?.difficulty || "";
  const problems = await getProblems(query, difficulty);
  const isAdmin = true;

  return (
    <div className="bg-base-300 text-base-content font-sans min-h-screen overflow-hidden relative">
      {/* 1. Global Background Grid & Highlights */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-20 pointer-events-none" />

      <div
        className="absolute top-0 left-0 w-full h-[100vh] 
        [mask-image:linear-gradient(to_bottom,black_40%,transparent)]
        pointer-events-none z-0"
      >
        <div
          className="absolute inset-0 
          bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
          bg-[size:24px_24px]"
        />
        <GridHighlights />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Header with Constant "Developer Page Style" Glow */}
       <header className="relative z-10 py-12 md:py-24 text-center">
  {/* 1. THE CONSTANT BACKGROUND GLOW (Title Aura) */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-primary/60 blur-[100px] rounded-full animate-pulse pointer-events-none" />

  <div className="flex flex-col items-center relative z-5">
    {/* 2. THE TITLE */}
    <h1 className="relative text-5xl md:text-7xl font-black tracking-tighter mb-4">
      <span className="relative inline-block mx-2">
        <span className="text-base-content">Problems</span>

        {/* WE NEST THE ICON INSIDE THIS RELATIVE SPAN */}
        <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-primary/60 mx-2 animate-pulse">
          X
          
          {/* 3. POSITIONED ICON CONTAINER - UPDATED COORDINATES */}
          {/* Reduced -top and -right to bring it closer to the X */}
          <div className="absolute -top-2 -right-5 md:-top-7 md:-right-6 flex items-end gap-4 pointer-events-none">
            <div className="relative p-2 bg-base-200 border-2 border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(var(--p),0.5)] animate-bounce">
              {/* Internal Pulsing Glow */}
              <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full animate-pulse" />

              {/* Rotating Dashed Orbit */}
              <div className="absolute inset-[-8px] border border-dashed border-primary/40 rounded-full animate-[spin_10s_linear_infinite] opacity-50" />

              {/* The Icon */}
              <Terminal className="text-primary w-6 h-6 md:w-6 md:h-6 relative z-10 drop-shadow-[0_0_8px_rgba(var(--p),0.8)]" />
            </div>
          </div>
        </span>
      </span>
    </h1>

    <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mt-2">
      Boost your coding skills with our curated problems.
    </p>

    {/* 4. NEON UNDERLINE */}
    <div className="h-1.5 w-24 bg-primary mt-6 rounded-full shadow-[0_0_20px_rgba(var(--p),0.6)] mx-auto" />
  </div>
</header>

        {/* 3. Filters Section */}
        <div className="mb-10 relative z-20">
          <ProblemFilters />
        </div>

        {/* 4. Problems Table Section */}
        <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2.5rem] overflow-hidden shadow-2xl mb-24">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-10 py-6 border-b border-base-content/5 bg-base-300 text-[11px] font-black opacity-40 uppercase tracking-[0.25em]">
            <div className="col-span-6">Directory</div>
            <div className="col-span-3 text-center">Difficulty</div>
            <div className="col-span-3 text-right">Acceptance</div>
          </div>

<<<<<<< HEAD
          {/* Table Body with Alternate Row Logic */}
          <div className="divide-y divide-base-content/5">
            {problems.length > 0 ? (
              problems.map((problem, idx) => (
                <Link href={`/Each-problem/${problem.id}`} key={problem.id}>
                  <div
                    className={`grid grid-cols-12 items-center px-10 py-6 transition-all duration-300 cursor-pointer group
                      ${
                        idx % 2 === 0
                          ? "bg-base-100" // Light Row for Even
                          : "bg-base-200/40" // Muted Translucent for Odd
                      } 
                      hover:bg-primary/[0.08] hover:translate-x-1`}
                  >
                    <div className="col-span-6">
                      <div className="flex items-center gap-5">
                        <span className="text-xs font-mono opacity-20 font-black group-hover:text-primary group-hover:opacity-100 transition-all">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <p className="text-base-content font-semibold group-hover:text-primary transition-colors tracking-tight text-base md:text-lg">
                          {problem.title}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 text-center">
                      <DifficultyChip difficulty={problem.difficulty} />
                    </div>
                    <div className="col-span-3 text-right">
                      <p className="font-mono text-sm font-black opacity-30 group-hover:opacity-100 group-hover:text-base-content transition-all">
                        {problem.acceptance}
                      </p>
                    </div>
=======
          {problems.length > 0 ? (
            problems.map((problem, idx) => (
              <Link href={`/Each-problem/${problem.id}`} key={problem.id}>
                <div className="grid grid-cols-12 items-center px-6 py-5 bg-base-100 border-b border-base-content/5 last:border-b-0 hover:bg-base-300/30 transition-colors cursor-pointer">
                  <div className="col-span-6">
                    <p className="text-base-content font-medium">{`${idx + 1}. ${problem.title}`}</p>
>>>>>>> a2dcbee15667a99e7abf68a51c10c6f8081bbf7e
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-32 text-center opacity-20 font-black uppercase tracking-widest italic">
                No challenges available in this sector.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}