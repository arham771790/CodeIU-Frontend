"use client";
import { useEffect, useState, useMemo } from "react";
import { useContestStore } from "@/app/store/useContestStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import CreateContestDialog from "@/app/components/contest/CreateContestDialog";
import ManageContestsButton from "@/app/components/contest/ManageContestButton";
import ContestGrid from "@/app/components/contest/ContestGrid";
import { getSocket, joinContestRoom } from "@/app/lib/socket";
import { Trophy, Calendar, Zap, LayoutGrid, Plus } from "lucide-react";

// Ensure keys match the logic exactly
const tabs = [
  { key: "ALL", label: "All", icon: LayoutGrid },
  { key: "RUNNING", label: "Running", icon: Zap },
  { key: "UPCOMING", label: "Upcoming", icon: Calendar },
  { key: "PAST", label: "Past", icon: Trophy },
];

export default function ContestDashboard({ initialContests }) {
  const { contests, setContests, updateContestStatus } = useContestStore();
  const { authUser } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";

  // Use uppercase keys to stay consistent with the tab definition
  const [activeTab, setActiveTab] = useState("UPCOMING");
  const [openCreate, setOpenCreate] = useState(false);

  // 1. Hydrate Store once
  useEffect(() => {
    if (initialContests) setContests(initialContests);
  }, [initialContests, setContests]);

  // 2. Socket Logic
  useEffect(() => {
    const socket = getSocket();
    contests.forEach((c) => joinContestRoom(c.id));

    const onStatus = ({ contestId, newStatus }) => {
      updateContestStatus(contestId, newStatus);
    };

    socket.on("contestStatusUpdated", onStatus);
    return () => socket.off("contestStatusUpdated", onStatus);
  }, [contests, updateContestStatus]);

  // 3. FIXED: Responsive Filtering Logic
  // This recalculates immediately whenever activeTab or contests change
  const filteredContests = useMemo(() => {
    const now = new Date(); 

    if (activeTab === "ALL") return contests;

    return contests.filter((c) => {
      const start = new Date(c.startsAt);
      const end = new Date(c.endsAt);

      if (activeTab === "UPCOMING") return start > now;
      if (activeTab === "RUNNING") return start <= now && now < end;
      if (activeTab === "PAST") return end <= now;
      
      return true;
    });
  }, [contests, activeTab]); // Dependencies are correct: triggers on tab click

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans">
      {/* Hero Section */}
      <div className="relative border-b border-base-content/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <header className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-400">CodeIU</span>
            <span className="ml-3 text-transparent bg-clip-text bg-gradient-to-l from-primary/50 to-sky-100 ">X</span>
            <span className="ml-3 ml-3 text-transparent bg-clip-text bg-gradient-to-l from-primary to-sky-100">Contests</span>
          </h1>
          <p className="text-lg text-base-content/60 max-w-xl mx-auto leading-relaxed">
            The arena where logic meets speed. Competitive programming at its finest.
          </p>
        </header>
      </div>

      {/* Toolbar - Floating Style */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Tab Controls */}
        <div className="flex p-1.5 bg-base-300/80 backdrop-blur-xl rounded-2xl border border-base-content/10 shadow-2xl">
          {tabs.map((t) => {
             const Icon = t.icon;
             const isActive = activeTab === t.key;
             return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)} // THIS updates activeTab state
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-content shadow-lg shadow-primary/30 scale-105"
                      : "text-base-content/50 hover:bg-base-content/5 hover:text-base-content"
                  }`}
                >
                  <Icon size={16} /> {t.label}
                </button>
             )
          })}
        </div>

        {/* Admin Controls */}
        <div className="flex gap-3">
          {isAdmin && (
            <>
              <button
                onClick={() => setOpenCreate(true)}
                className="btn btn-primary btn-md rounded-2xl px-6 flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <Plus size={18} /> Create Contest
              </button>
              {openCreate && <CreateContestDialog setOpen={setOpenCreate} />}
              <ManageContestsButton />
            </>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-4 mb-10">
            <div className="h-10 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--p),0.5)]" />
            <h2 className="text-3xl font-black tracking-tight uppercase">
                {tabs.find((t) => t.key === activeTab)?.label} <span className="opacity-30">Series</span>
            </h2>
        </div>

        {filteredContests.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <ContestGrid items={filteredContests} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-content/5">
            <div className="opacity-10 mb-6 scale-150"><Trophy size={64} /></div>
            <p className="text-xl text-base-content/30 font-bold uppercase tracking-widest italic">
              No {activeTab.toLowerCase()} contests
            </p>
          </div>
        )}
      </main>
    </div>
  );
}