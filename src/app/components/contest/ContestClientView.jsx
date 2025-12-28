"use client";

import { useEffect } from "react";
import Link from "next/link";
import { getSocket } from "@/app/lib/socket";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useContestStore } from "@/app/store/useContestStore";
import { useBundleStore } from "@/app/store/useBundleStore";
import { useContestTimer } from "@/app/hooks/useContestTimer";

import ContestHeader from "./ContestHeader";
import ContestRules from "./ContestRules";
import ContestPrizes from "./ContestPrizes";
import ContestAchievements from "./ContestAchievments";
import AdminAttachProblemsDialog from "./AdminAttachProblemDialog";
import { Zap } from "lucide-react";

export default function ContestClientView({ initialContest }) {
  const { authUser } = useAuthStore();
  const { contest, setContest, fetchContestById } = useContestStore();
  const { bundle, fetchBundle } = useBundleStore();

  const contestId = initialContest.id;

  // 1. Hydrate Store immediately with Server Data
  // This prevents the "Loading..." spinner on initial load
  if (initialContest && !contest) {
    setContest(initialContest);
  }

  // Keep local reference in sync if switching between contests
  useEffect(() => {
    if (initialContest) setContest(initialContest);
  }, [initialContest, setContest]);

  // 2. Fetch User-Specific Bundle (Problems/Registration)
  // This MUST be client-side because it depends on the specific user's auth
  useEffect(() => {
    if (contestId && authUser?.id) {
      fetchBundle({ contestId, userId: authUser.id });
    }
  }, [contestId, authUser?.id, fetchBundle]);

  // 3. Socket Connection
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join:contest", { contestId });

    const onUpdate = ({ contestId: changedId, newStatus }) => {
      if (changedId === contestId) {
        console.log(`[socket] contest ${contestId} updated → ${newStatus}`);
        fetchContestById(contestId); // Refresh details if status changes
      }
    };

    socket.on("contestStatusUpdated", onUpdate);
    return () => socket.off("contestStatusUpdated", onUpdate);
  }, [contestId, fetchContestById]);

  // 4. Timer Logic
  const activeContest = contest || initialContest; // Fallback
  const { phase } = useContestTimer(activeContest);

  const hasContestStarted = phase === "running" || phase === "ended";
  const hasContestEnded = phase === "ended";
  const isContestRunning = phase === "running";
  const startTime = activeContest?.startsAt
    ? new Date(activeContest.startsAt)
    : null;

  const isAdmin = authUser?.role === "ADMIN";
  const problems = bundle?.problems || [];

  return (
    // Inside ContestClientView.jsx return
    <div className="min-h-screen bg-base-100 text-base-content">
      <ContestHeader contest={activeContest} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--p),0.5)]" />
            <h2 className="text-3xl font-black tracking-tight uppercase">
              Contest <span className="opacity-30 not-italic">Overview</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <AdminAttachProblemsDialog contestId={activeContest.id} />
            )}
            <Link href={`/Leaderboard/${activeContest.id}`}>
              <button className="btn btn-ghost border-base-content/10 bg-base-200/50 hover:bg-primary hover:text-white rounded-2xl px-6">
                🏆 Leaderboard
              </button>
            </Link>
          </div>
        </div>

        {/* Problems Section */}
        <div className="mb-20">
          {problems?.length > 0 ? (
            isAdmin ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {problems
                  .slice()
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((p) => {
                    const idx = p.order ?? 0;
                    const label = String.fromCharCode(65 + idx);
                    return (
                      <div
                        key={p.id || idx}
                        className="group bg-base-200 border border-base-content/10 rounded-2xl p-6 hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded">
                            Problem {label}
                          </span>
                          <span className="text-xs font-mono opacity-50">
                            {p.points ?? 0} PTS
                          </span>
                        </div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                          {p.snapshot?.title}
                        </h3>
                        <p className="text-xs opacity-40 mt-1 font-mono">
                          /{p.snapshot?.slug}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-base-200/50 rounded-3xl border border-base-content/10">
                {isContestRunning ? (
                  <div className="text-center">
                    <p className="mb-6 font-bold text-2xl uppercase tracking-tight italic opacity-70 italic">
                      Battle is Live
                    </p>
                    <Link href={`/Contest_ProblemPage/${contestId}`}>
                      <button className="btn btn-primary rounded-2xl px-12 h-14 text-lg font-black uppercase shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                        Enter Arena
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6 opacity-60 flex flex-col items-center gap-2">
                    <Zap size={32} />
                    <p className="font-bold">
                      Waiting for contest phase change...
                    </p>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="text-center py-20 bg-base-200/20 rounded-3xl border border-dashed border-base-content/10 italic opacity-40">
              {isAdmin
                ? "No problems attached yet."
                : "Register to see problems when the contest starts."}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <ContestRules />
          <div className="space-y-12">
            <ContestPrizes />
            <ContestAchievements />
          </div>
        </div>
      </div>
    </div>
  );
}
