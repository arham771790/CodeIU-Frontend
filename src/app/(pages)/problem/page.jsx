"use client";

import { useState , useEffect } from "react";
import { Search, ArrowUpDown, Filter, Shuffle, Moon, Loader2, Loader , Ellipsis} from "lucide-react";
import { useProblemStore } from "@/app/store/useProblemStore";
import { useAuthStore } from "@/app/store/useAuthStore";

const problemSets = [
  {
    title: "Master Interview",
    progress: "0/25",
    author: "By CodeIU",
  },
  {
    title: "Array Mastery",
    progress: "0/15",
    author: "By CodeIU",
  },
  {
    title: "Master Google Prep",
    progress: "0/15",
    author: "By CodeIU",
  },
];


const DifficultyChip = ({ difficulty }) => {
  const color =
    difficulty === "EASY"
      ? "text-green-400"
      : difficulty === "MEDIUM"
      ? "text-yellow-400"
      : "text-red-400";
  return <span className={`font-medium ${color}`}>{difficulty}</span>;
};

const ProblemsPage = () => {

  const {authUser} = useAuthStore();

  console.log("authuser..........................");
  console.log(authUser);

  const { isProblemsLoading , problems , getAllProblems} = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, []);

  console.log("....................PROBLEMS...........................");
  console.log(problems);

  return (
    <div className="bg-black text-gray-300 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Problems</h1>
            <p className="text-gray-400 mt-2">
              Boost your coding skills with our curated problems.
            </p>
          </div>
        </header>

        {/* Problem Sets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {problemSets.map((set, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-black border border-gray-700/50 rounded-xl p-6 flex flex-col justify-between hover:border-gray-600 hover:-translate-y-1 transition-all cursor-pointer"
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_2px,transparent_2px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_2px,transparent_4px)] bg-[size:1.5rem_1.5rem] opacity-50"></div>
              <div className="absolute -bottom-20 -right-15 w-60 h-60 bg-[radial-gradient(circle,rgba(96,165,250,0.15)_0%,transparent_60%)]"></div>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white">
                      {set.title}
                    </h2>
                    <span className="text-gray-300 font-semibold bg-gray-800 px-3 py-1 rounded-full text-xs">
                      {set.progress}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-15">
                  <span>
                    {set.author}
                  </span>
                  <span className="text-2xl filter opacity-60">🌊</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-auto flex-grow max-w-lg ">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500  " />
            <input
              type="text"
              placeholder="Search problems"
              className="w-full bg-gray-800 border border-gray-700/50 rounded-full pl-12 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-gray-800 border border-gray-700/50 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowUpDown className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2.5 bg-gray-800 border border-gray-700/50 rounded-full hover:bg-gray-800 transition-colors">
              <Filter className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2.5 bg-gray-800 border border-gray-700/50 rounded-full hover:bg-gray-800 transition-colors">
              <Shuffle className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-gray-900 border border-gray-700/50 rounded-xl">
          <div className="grid grid-cols-12 px-6 py-4 border-b border-gray-700/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-6">Title</div>
            <div className="col-span-3 text-center">Difficulty</div>
            <div className="col-span-3 text-right">Acceptance</div>
          </div>
          {isProblemsLoading ? (
            <div className="flex items-center justify-center mt-4 mb-4">
              <Loader className="h-10 w-10 animate-spin " />
            </div>
          ) : (
            <div>
            {problems.map((problem, index) => (
              <div
                key={index}
                className="grid grid-cols-12 items-center px-6 py-5 bg-black border-b border-white/10 last:border-b-0 hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
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
            ))}
          </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
