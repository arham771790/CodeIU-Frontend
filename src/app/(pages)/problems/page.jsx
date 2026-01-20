import Link from "next/link";
import { getProblems } from "@/lib/services/problemService";
import ProblemFilters from "@/app/components/ProblemFilters";

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
        : "bg-red-500/10 text-red-600 dark:text-red-400";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles}`}>
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
    <div className="bg-base-100 text-base-content/80 min-h-screen font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Problems</h1>
            <p className="opacity-60 mt-2">Boost your coding skills with our curated problems.</p>
          </div>
        </header>

        {/* Problem Sets Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {problemSets.map((set, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-base-200 border border-base-content/10 rounded-xl p-6 flex flex-col justify-between border-primary/20 -translate-y-1 transition-all shadow-sm "
            >
              {/* 1. The High-Contrast Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-5 pointer-events-none"></div>

              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 blur-3xl opacity-100 pointer-events-none transition-opacity group-hover:opacity-120"></div>

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-base-content">{set.title}</h2>
                    <span className="font-semibold bg-base-100 border border-base-content/10 px-3 py-1 rounded-full text-xs">
                      {set.progress}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-15">
                  <span className="text-sm opacity-90">{set.author}</span>
                  <span className="text-2xl filter  opacity-100 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🌊</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ProblemFilters isAdmin={isAdmin} />

        {/* Problems Table Section */}
        <div className="bg-base-200 border border-base-content/10 rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 px-6 py-4 border-b border-base-content/10 text-xs font-semibold opacity-50 uppercase tracking-wider">
            <div className="col-span-6">Title</div>
            <div className="col-span-3 text-center">Difficulty</div>
            <div className="col-span-3 text-right">Acceptance</div>
          </div>

          {problems.length > 0 ? (
            problems.map((problem, idx) => (
              <Link href={`/Each-problem/${problem.id}`} key={problem.id}>
                <div className="grid grid-cols-12 items-center px-6 py-5 bg-base-100 border-b border-base-content/5 last:border-b-0 hover:bg-base-300/30 transition-colors cursor-pointer">
                  <div className="col-span-6">
                    <p className="text-base-content font-medium">{`${idx + 1}. ${problem.title}`}</p>
                  </div>
                  <div className="col-span-3 text-center">
                    <DifficultyChip difficulty={problem.difficulty} />
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="opacity-60">{problem.acceptance}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-10 text-center opacity-50">No problems found.</div>
          )}
        </div>
      </div>
    </div>
  );
}