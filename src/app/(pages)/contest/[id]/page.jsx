// src/app/(pages)/contest/[id]/page.jsx
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSocket } from "@/app/lib/socket";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useContestStore } from "@/app/store/useContestStore";
import { useBundleStore } from "@/app/store/useBundleStore";

import ContestHeader from "@/app/components/contest/ContestHeader";
import ContestRules from "@/app/components/contest/ContestRules";
import ContestPrizes from "@/app/components/contest/ContestPrizes";
import ContestAchievements from "@/app/components/contest/ContestAchievments";
import AdminAttachProblemsDialog from "@/app/components/contest/AdminAttachProblemDialog";

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = params?.id;
  const { authUser } = useAuthStore();

  const { contest, fetchContestById, isLoading } = useContestStore();
  const { bundle, fetchBundle } = useBundleStore();

  useEffect(() => {
    if (contestId) fetchContestById(contestId);
  }, [contestId, fetchContestById]);

  useEffect(() => {
    if (contestId && authUser?.id) {
      fetchBundle({ contestId, userId: authUser.id });
    }
  }, [contestId, authUser?.id, fetchBundle]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join:contest", { contestId });

    socket.on("contestStatusUpdated", ({ contestId: changedId, newStatus }) => {
      if (changedId === contestId) {
        console.log(`[socket] contest ${contestId} updated → ${newStatus}`);
        fetchContestById(contestId);
      }
    });

    return () => socket.off("contestStatusUpdated");
  }, [contestId, fetchContestById]);

  if (isLoading || !contest) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  const isAdmin = authUser?.role === "ADMIN";
  const problems = bundle?.problems || [];


  return (
    <div className="min-h-screen bg-black text-gray-200">
      <ContestHeader contest={contest} />

      <div className="md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <h2 className="text-2xl md:text-2xl font-semibold text-white">
              Contest Overview
            </h2>
          </div>

          <div className="flex items-center justify-center gap-2">
            {isAdmin && <AdminAttachProblemsDialog contestId={contest.id} />}
            <Link href={`/Leaderboard/${contestId}`}>
              <button className="font-semibold text-white p-2 hover:text-blue-400 border border-white rounded-full hover:border-blue-400 cursor-pointer">
                🏆 Leaderboard
              </button>
            </Link>
          </div>
        </div>

        {/* Problems / Enter Contest section */}
        {problems?.length > 0 ? (
          isAdmin ? (
            // Admin sees the problems grid
            <div className="max-w-6xl mx-auto mt-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {problems
                  .slice()
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((p) => {
                    const idx = p.order ?? 0;
                    const label = String.fromCharCode(65 + idx); // A, B, C, ...
                    const title = p.snapshot?.title ?? "Untitled";
                    const slug = p.snapshot?.slug;
                    const pts = p.points ?? 0;
                    const key = p.contentHash || `${contest.id}-${idx}-${pts}`;

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
            // Participant sees Enter Contest button
            <div className="flex-col mt-6">
              <p className="mb-2 font-semibold text-lg">Click below 👇 to enter the contest</p>
              <Link href={`/Contest_ProblemPage/${contestId}`}>
                <button className="p-2 bg-gradient-to-t from-blue-900 via-black to-blue-900 text-white cursor-pointer hover:text-white border border-white hover:border-blue-400 rounded-full font-semibold">
                  Enter Contest
                </button>
              </Link>
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
