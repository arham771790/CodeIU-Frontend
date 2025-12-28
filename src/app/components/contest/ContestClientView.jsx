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
  const startTime = activeContest?.startsAt ? new Date(activeContest.startsAt) : null;

  const isAdmin = authUser?.role === "ADMIN";
  const problems = bundle?.problems || [];

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <ContestHeader contest={activeContest} />

      <div className="px-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <h2 className="text-2xl md:text-2xl font-semibold text-white">
              Contest Overview
            </h2>
          </div>

          <div className="flex items-center justify-center gap-2">
            {isAdmin && <AdminAttachProblemsDialog contestId={activeContest.id} />}
            <Link href={`/Leaderboard/${activeContest.id}`}>
              <button className="font-semibold text-white p-2 hover:text-blue-400 border border-white rounded-full hover:border-blue-400 cursor-pointer transition-colors">
                🏆 Leaderboard
              </button>
            </Link>
          </div>
        </div>

        {/* Problems / Enter Contest section */}
        {problems?.length > 0 ? (
          isAdmin ? (
            // ADMIN VIEW: Grid of Problems
            <div className="max-w-6xl mx-auto mt-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {problems
                  .slice()
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((p) => {
                    const idx = p.order ?? 0;
                    const label = String.fromCharCode(65 + idx);
                    const title = p.snapshot?.title ?? "Untitled";
                    const slug = p.snapshot?.slug;
                    const pts = p.points ?? 0;
                    const key = p.contentHash || `${activeContest.id}-${idx}-${pts}`;

                    return (
                      <div
                        key={key}
                        className="bg-[#121212] border border-gray-800 rounded-xl p-4"
                      >
                        <div className="text-sm text-gray-400">Problem {label}</div>
                        <div className="text-white font-semibold mt-1 truncate">{title}</div>
                        <div className="text-gray-400 text-sm mt-1">{pts} pts</div>
                        {slug && (
                          <div className="text-xs text-gray-500 mt-2 truncate">/{slug}</div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            // PARTICIPANT VIEW: Enter Button
            <div className="flex-col mt-6">
              {isContestRunning ? (
                <>
                  <p className="mb-2 font-semibold text-lg">Click below 👇 to enter the contest</p>
                  <Link href={`/Contest_ProblemPage/${contestId}`}>
                    <button className="p-2 bg-gradient-to-t from-blue-900 via-black to-blue-900 text-white cursor-pointer hover:text-white border border-white hover:border-blue-400 rounded-full font-semibold transition-transform hover:scale-105">
                      Enter Contest
                    </button>
                  </Link>
                </>
              ) : hasContestEnded ? (
                <p className="mb-2 font-semibold text-lg text-yellow-500">
                  The contest has ended.
                </p>
              ) : !hasContestStarted ? (
                <p className="mb-2 font-semibold text-lg text-cyan-400">
                  The contest has not started yet.
                  {startTime && (
                    <span className="block text-sm font-normal text-gray-400 mt-1">
                      Starts at: {startTime.toLocaleString()}
                    </span>
                  )}
                </p>
              ) : (
                <p className="mb-2 font-semibold text-lg text-gray-500">
                  Please wait...
                </p>
              )}
            </div>
          )
        ) : (
          <div className="max-w-6xl mx-auto mt-4 text-gray-400">
            {isAdmin
              ? "No problems attached yet."
              : "Register to see problems when the contest starts."}
          </div>
        )}
      </div>

      <ContestRules />
      <ContestPrizes />
      <ContestAchievements />
    </div>
  );
}