// app/problems/page.jsx
import Link from "next/link";
import { getProblems } from "@/lib/services/problemService";
import ProblemFilters from "@/app/components/ProblemFilters";

const DifficultyChip = ({ difficulty }) => {
  const color =
    difficulty === "EASY" ? "text-green-400"
    : difficulty === "MEDIUM" ? "text-yellow-400"
    : "text-red-400";
  return <span className={`font-medium ${color}`}>{difficulty}</span>;
};

// 🛑 FIX HERE: 'searchParams' is now a Promise
export default async function ProblemsPage({ searchParams }) {
  
  // 1. AWAIT the params before using them
  const params = await searchParams;
  
  const query = params?.q || '';
  const difficulty = params?.difficulty || '';

  // 2. Pass extracted values to the fetcher
  const problems = await getProblems(query, difficulty);
  
  const isAdmin = true; 

  return (
    <div className="bg-black text-gray-300 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Problems</h1>
            <p className="text-gray-400 mt-2">
              Boost your coding skills with our curated problems.
            </p>
          </div>
        </header>

        <ProblemFilters isAdmin={isAdmin} />

        <div className="bg-gray-900 border border-gray-700/50 rounded-xl">
          <div className="grid grid-cols-12 px-6 py-4 border-b border-gray-700/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-6">Title</div>
            <div className="col-span-3 text-center">Difficulty</div>
            <div className="col-span-3 text-right">Acceptance</div>
          </div>

          {problems.length > 0 ? (
            problems.map((problem) => (
              <Link href={`/Each-problem/${problem.id}`} key={problem.id}>
                <div className="grid grid-cols-12 items-center px-6 py-5 bg-black border-b border-white/10 last:border-b-0 hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="col-span-6">
                    <p className="text-white font-medium">{problem.title}</p>
                  </div>
                  <div className="col-span-3 text-center">
                    <DifficultyChip difficulty={problem.difficulty} />
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="text-gray-400">{problem.acceptance}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No problems found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}