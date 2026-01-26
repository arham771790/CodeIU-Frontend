"use client";
import { useEffect, useState, useMemo } from "react";
import { useContestStore } from "@/app/store/useContestStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import CreateContestDialog from "@/app/components/contest/CreateContestDialog";
import ManageContestsButton from "@/app/components/contest/ManageContestButton";
import ContestGrid from "@/app/components/contest/ContestGrid";
import { getContestSocket, joinContestRoom } from "@/app/lib/socket";
import { Trophy, Calendar, Zap, LayoutGrid, Plus, Swords } from "lucide-react";
import GridHighlights from "@/app/components/GridHighlights"; // Ensure this import exists

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

  const [activeTab, setActiveTab] = useState("UPCOMING");
  const [openCreate, setOpenCreate] = useState(false);

  // 1. Hydrate Store once
  useEffect(() => {
    if (initialContests) setContests(initialContests);
  }, [initialContests, setContests]);

  // 2. Socket Logic
  useEffect(() => {
    const socket = getContestSocket();
    contests.forEach((c) => joinContestRoom(c.id));

    const onStatus = ({ contestId, newStatus }) => {
      updateContestStatus(contestId, newStatus);
    };

    socket.on("contestStatusUpdated", onStatus);
    return () => socket.off("contestStatusUpdated", onStatus);
  }, [contests, updateContestStatus]);

  // 3. Filtering Logic 
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
  }, [contests, activeTab]);

  return (
    <div className="bg-base-300 text-base-content font-sans min-h-screen overflow-hidden relative">
      {/* 1. Global Background Grid & Highlights (Matches Problems Page) */}
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
        {/* Reusing your GridHighlights component */}
        <GridHighlights />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 2. Header with "Developer Page Style" Glow */}
        <header className="relative z-10 py-12 md:py-24 text-center">
          {/* THE CONSTANT BACKGROUND GLOW (Title Aura) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-primary/60 blur-[100px] rounded-full animate-pulse pointer-events-none" />

          <div className="flex flex-col items-center relative z-5">
            {/* THE TITLE */}
            <h1 className="relative text-5xl md:text-7xl font-black tracking-tighter mb-4">
              <span className="relative inline-block mx-2">
                <span className="text-base-content">Contests</span>

                {/* ANIMATED ICON NESTED IN THE X */}
                <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-primary/60 mx-2 animate-pulse">
                  X
                  {/* Positioned Icon Container */}
                  <div className="absolute -top-2 -right-5 md:-top-7 md:-right-6 flex items-end gap-4 pointer-events-none">
                    <div className="relative p-2 bg-base-200 border-2 border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(var(--p),0.5)] animate-bounce">
                      {/* Internal Pulsing Glow */}
                      <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full animate-pulse" />
                      {/* Rotating Dashed Orbit */}
                      <div className="absolute inset-[-8px] border border-dashed border-primary/40 rounded-full animate-[spin_10s_linear_infinite] opacity-50" />

                      {/* The Swords Icon for Contests */}
                      <Swords className="text-primary w-6 h-6 md:w-6 md:h-6 relative z-10 drop-shadow-[0_0_8px_rgba(var(--p),0.8)]" />
                    </div>
                  </div>
                </span>
              </span>
            </h1>

            <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mt-2">
              The arena where logic meets speed.
            </p>

            {/* NEON UNDERLINE */}
            <div className="h-1.5 w-24 bg-primary mt-6 rounded-full shadow-[0_0_20px_rgba(var(--p),0.6)] mx-auto" />
          </div>
        </header>

        {/* 3. Controls Section (Tabs + Admin Buttons) */}
        <div className="mb-10 relative z-20 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Tabs - Styled like filters */}
          <div className="flex p-1 bg-base-200/80 backdrop-blur-md rounded-full border border-base-content/10 shadow-lg">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${isActive
                      ? "bg-primary text-primary-content shadow-[0_0_20px_rgba(var(--p),0.4)]"
                      : "text-base-content/40 hover:text-base-content hover:bg-base-content/5"
                    }`}
                >
                  <Icon size={14} className={isActive ? "animate-pulse" : ""} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex gap-3">
              <button
                onClick={() => setOpenCreate(true)}
                className="btn btn-sm btn-circle btn-ghost border border-base-content/10 bg-base-200 hover:bg-base-300 text-primary"
                title="Create Contest"
              >
                <Plus className="w-5 h-5" />
              </button>
              {openCreate && <CreateContestDialog setOpen={setOpenCreate} />}

              <div className="scale-90 origin-right">
                <ManageContestsButton />
              </div>
            </div>
          )}
        </div>

        {/* 4. Contest Grid Section (Glassmorphism Container) */}
        <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2.5rem] overflow-hidden shadow-2xl mb-24 p-8 min-h-[400px]">

          {/* Grid Header / Status Line */}
          <div className="flex items-center gap-4 mb-8 opacity-40">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-content/20 to-transparent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Displaying {filteredContests.length} {activeTab.toLowerCase()} Events
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-content/20 to-transparent" />
          </div>

          {/* The Actual Grid */}
          {filteredContests.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ContestGrid items={filteredContests} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="opacity-10 mb-6 scale-150 animate-pulse">
                <Trophy size={64} />
              </div>
              <p className="text-xl opacity-20 font-black uppercase tracking-widest italic">
                No challenges available in this sector.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}