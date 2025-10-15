"use client";
import { useEffect, useState } from "react";
import { useContestStore } from "@/app/store/useContestStore";
import CreateContestDialog from "@/app/components/contest/CreateContestDialog";
import ContestGrid from "@/app/components/contest/ContestGrid";

const tabs = [
  { key: "", label: "All" },
  { key: "running", label: "Running" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

export default function ContestPage() {
  const { contests, fetchContests, isLoading } = useContestStore();
  const [type, setType] = useState("upcoming");

  useEffect(() => {
    fetchContests(type);
  }, [type, fetchContests]);

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      {/* Hero */}
      <div className="pb-6 mb-15 border-b border-white/10">
        <header className="relative text-center py-20 md:py-28 overflow-hidden ">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020d2e] via-black to-black" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_2px,transparent_2px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_2px,transparent_4px)] bg-[size:1.5rem_1.5rem] opacity-50"></div>
          <div className="absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-250 h-30 bg-[radial-gradient(circle,rgba(96,165,250,0.15)_0%,transparent_60%)]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              <span className="font-mono bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                CodeIU
              </span>{" "}
              X Contest
            </h1>
            <div className="w-32 h-0.5 bg-blue-500/50 mt-6 mb-4 rounded-full" />
            <p className="text-md md:text-lg text-gray-300 max-w-2xl">
              A space where learning meets competition every week.
            </p>
            <p className="text-sm md:text-md text-gray-400 mt-2 font-mono">
              Code fast. Think smart. Rise high
            </p>
          </div>
        </header>
      </div>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={`px-3 py-1.5 rounded-full border ${
                type === t.key
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Admin only */}
        <CreateContestDialog />
      </div>

      {/* Grid */}
      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Weekly Contest</h2>

          {isLoading ? (
            <p className="text-gray-400">Loading…</p>
          ) : (
            <ContestGrid items={contests} />
          )}
        </div>
      </main>
    </div>
  );
}
