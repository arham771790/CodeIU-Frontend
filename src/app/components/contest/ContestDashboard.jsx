"use client";

import { useEffect, useState, useMemo } from "react";
import { useContestStore } from "@/app/store/useContestStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import CreateContestDialog from "@/app/components/contest/CreateContestDialog";
import ManageContestsButton from "@/app/components/contest/ManageContestButton";
import ContestGrid from "@/app/components/contest/ContestGrid";
import { getSocket, joinContestRoom } from "@/app/lib/socket";

const tabs = [
  { key: "all", label: "All" },
  { key: "RUNNING", label: "Running" },
  { key: "UPCOMING", label: "Upcoming" },
  { key: "PAST", label: "Past" },
];

export default function ContestDashboard({ initialContests }) {
  const { contests, setContests, updateContestStatus } = useContestStore();
  const { authUser } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";

  const [activeTab, setActiveTab] = useState("UPCOMING"); // Default to upcoming
  const [openCreate, setOpenCreate] = useState(false);

  // 1. Hydrate Store
  useEffect(() => {
    setContests(initialContests);
  }, [initialContests, setContests]);

  // 2. Socket Logic (Join rooms for active contests)
  useEffect(() => {
    const socket = getSocket();
    const now = new Date();

    // Only join Running or Upcoming contests
    const activeContests = contests.filter(c => new Date(c.endsAt) > now);
    
    activeContests.forEach((c) => joinContestRoom(c.id));

    const onStatus = ({ contestId, newStatus }) => {
      console.log("⚡ [Socket] Status Update:", contestId, newStatus);
      updateContestStatus(contestId, newStatus);
    };

    socket.on("contestStatusUpdated", onStatus);
    return () => socket.off("contestStatusUpdated", onStatus);
  }, [contests, updateContestStatus]);

  // 3. ✅ FIXED: TIME-BASED FILTERING
  // This ensures a newly created contest (with future date) ALWAYS shows in Upcoming
  const filteredContests = useMemo(() => {
    // Force a re-calculation based on current time
    const now = new Date(); 

    if (activeTab === "all") return contests;

    return contests.filter((c) => {
      const start = new Date(c.startsAt);
      const end = new Date(c.endsAt);

      if (activeTab === "UPCOMING") {
        // It's upcoming if Start Time is in the future
        return start > now;
      }
      if (activeTab === "RUNNING") {
        // It's running if we are strictly between Start and End
        return start <= now && now < end;
      }
      if (activeTab === "PAST") {
        // It's past if End Time has passed
        return now >= end;
      }
      return true;
    });
  }, [contests, activeTab]);

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      {/* Hero Section */}
      <div className="pb-6 mb-15 border-b border-white/10">
        <header className="relative text-center py-10 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_50%,_rgba(37,99,235,0.5),transparent)] p-6 text-white shadow-xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_2px,transparent_2px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_2px,transparent_4px)] bg-[size:1.5rem_1.5rem] opacity-50" />
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
          </div>
        </header>
      </div>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 rounded-full border transition
                ${
                  activeTab === t.key
                    ? "font-semibold bg-gradient-to-t from-blue-900 via-black to-blue-900 text-white border-blue-500"
                    : "font-semibold bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => setOpenCreate(true)}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
              >
                Create Contest
              </button>

              {openCreate && <CreateContestDialog setOpen={setOpenCreate} />}
              <ManageContestsButton />
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            {tabs.find((t) => t.key === activeTab)?.label} Contests
          </h2>

          {filteredContests.length > 0 ? (
            <ContestGrid items={filteredContests} />
          ) : (
            <div className="text-gray-400 border border-gray-800 rounded-lg p-8 bg-[#0e0e0e] text-center">
              No contests found in {tabs.find((t) => t.key === activeTab)?.label} category.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}