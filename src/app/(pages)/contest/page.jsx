"use client";

import { useEffect, useState } from "react";
import { useContestStore } from "@/app/store/useContestStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import CreateContestDialog from "@/app/components/contest/CreateContestDialog";
import ManageContestsButton from "@/app/components/contest/ManageContestButton";
import ContestGrid from "@/app/components/contest/ContestGrid";
import { getSocket } from "@/app/lib/socket";
const tabs = [
  { key: "", label: "All" },
  { key: "running", label: "Running" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

export default function ContestPage() {
  const { contests, fetchContests, isLoading } = useContestStore();
  const { authUser } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";

  const [type, setType] = useState("upcoming");

  // Fetch whenever filter changes
  useEffect(() => {
    fetchContests(type);
    // Zustand actions are stable, so no need to add fetchContests to deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
   useEffect(() => {
    const socket = getSocket();
    socket.on("connect", () => console.log("[socket] connected:", socket.id));

    socket.on("contestStatusUpdated", ({ contestId, newStatus }) => {
      console.log("[socket] contestStatusUpdated:", contestId, newStatus);
      fetchContests(type); // refresh current tab
    });

    return () => socket.off("contestStatusUpdated");
  }, [type, fetchContests]);

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      {/* Hero */}
      <div className="pb-6 mb-15 border-b border-white/10">
        <header className="relative text-center py-10 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_50%,_rgba(37,99,235,0.5),transparent)] p-6 text-white shadow-xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_2px,transparent_2px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_2px,transparent_4px)] bg-[size:1.5rem_1.5rem] opacity-50" />
          {/* fix invalid sizes: use arbitrary values */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[120px] bg-[radial-gradient(circle,rgba(96,165,250,0.15)_0%,transparent_60%)]" />
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
              className={`px-3 py-1.5 rounded-full border transition
                ${type === t.key
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
              <div className="flex gap-2">
                {isAdmin && <CreateContestDialog />}
                {isAdmin && <ManageContestsButton />}   {/* NEW */}
              </div>

      </div>

      {/* Grid */}
      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            {type ? `${tabs.find((t) => t.key === type)?.label} Contests` : "All Contests"}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-52 rounded-lg bg-gray-900 animate-pulse border border-gray-800" />
              ))}
            </div>
          ) : contests?.length ? (
            <ContestGrid items={contests} />
          ) : (
            <div className="text-gray-400 border border-gray-800 rounded-lg p-8 bg-[#0e0e0e]">
              No contests found{type ? ` in ${tabs.find((t) => t.key === type)?.label.toLowerCase()}` : ""}.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
