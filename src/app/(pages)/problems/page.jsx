import Link from "next/link";
import { getProblems } from "@/lib/services/problemService";
import { useAuthStore } from "@/app/store/useAuthStore";
import ProblemFilters from "@/app/components/ProblemFilters";
import GridHighlights from "@/app/components/GridHighlights";
import { Terminal, Youtube, CheckCircle, Circle } from "lucide-react"; // Imported Check icons
import { cookies } from "next/headers";

const DifficultyChip = ({ difficulty }) => {
  const styles =
    difficulty === "EASY"
      ? "bg-green-500/10 text-green-600 dark:text-green-400"
      : difficulty === "MEDIUM"
        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
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

  let loggedInUserId = null;

  const cookieStore = cookies();
     const token = cookieStore.get('your_auth_token')?.value;
     if (token) {
        loggedInUserId = decodeToken(token).id; 
     }
  
  // TODO: Fetch the actual logged-in user's ID from your Auth provider (NextAuth, Clerk, etc.)
  // Example: const session = await getServerSession(); const loggedInUserId = session?.user?.id;
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
                  
                  {/* 3. POSITIONED ICON CONTAINER */}
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
          
          {/* Table Header (Fixed Grid Cols: 1 + 5 + 2 + 2 + 2 = 12) */}
          <div className="grid grid-cols-12 px-10 py-6 border-b border-base-content/5 bg-base-300 text-[11px] font-black opacity-40 uppercase tracking-[0.25em]">
            <div className="col-span-1 text-center">solved</div>
            <div className="col-span-5 text-left">Directory</div>
            <div className="col-span-2 text-center">Difficulty</div>
            <div className="col-span-2 text-center">Editorial</div>
            <div className="col-span-2 text-center">Acceptance</div>
          </div>

          {/* Table Body with Alternate Row Logic */}
          <div className="divide-y divide-base-content/5">
            {problems.length > 0 ? (
              problems.map((problem, idx) => {
                
                // Determine if the logged-in user has solved this specific problem
                const isSolved = problem.solvedBy?.includes(loggedInUserId);

                return (
                  <div
                    key={problem.id}
                    className={`relative grid grid-cols-12 items-center px-10 py-6 transition-all duration-300 group
                      ${
                        idx % 2 === 0
                          ? "bg-base-100" 
                          : "bg-base-200/40" 
                      } 
                      hover:bg-primary/[0.08] hover:translate-x-1`}
                  >
                    
                    {/* Invisible Link stretching over the whole row */}
                    <Link 
                      href={`/Each-problem/${problem.id}`}
                      className="absolute inset-0 z-0 cursor-pointer"
                      aria-label={`View problem ${problem.title}`}
                    />

                    {/* Solved Status */}
                    <div className="col-span-1 flex justify-center items-center relative z-10 pointer-events-none">
                      {isSolved ? (
                        // Green checked circle with a slight glow
                        <CheckCircle className="w-5 h-5 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      ) : (
                        // Faded empty circle
                        <Circle className="w-5 h-5 text-base-content/20 group-hover:text-base-content/40 transition-colors" />
                      )}
                    </div>

                    {/* Directory / Title */}
                    <div className="col-span-5 relative z-10 pointer-events-none">
                      <div className="flex items-center gap-5">
                        <span className="text-xs font-mono opacity-20 font-black group-hover:text-primary group-hover:opacity-100 transition-all">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <p className="text-base-content font-semibold group-hover:text-primary transition-colors tracking-tight text-base md:text-lg truncate">
                          {problem.title}
                        </p>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="col-span-2 flex justify-center items-center relative z-10 pointer-events-none">
                      <DifficultyChip difficulty={problem.difficulty} />
                    </div>

                    {/* Editorial (YouTube Link) */}
                    <div className="col-span-2 flex justify-center items-center relative z-20">
                      {problem.editorial ? (
                        <a 
                          href={problem.editorial} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-base-content/30 text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-300 drop-shadow-lg cursor-pointer"
                          title="Watch Editorial"
                        >
                          <Youtube className="w-6 h-6" />
                        </a>
                      ) : (
                        <span className="p-2 text-base-content/20 font-mono font-bold">-</span>
                      )}
                    </div>

                    {/* Acceptance */}
                    <div className="col-span-2 flex justify-center items-center relative z-10 pointer-events-none">
                      <p className="font-mono text-sm font-black opacity-30 group-hover:opacity-100 group-hover:text-base-content transition-all">
                        {problem.acceptance || "0%"}
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
      </div>
    </div>
  );
}