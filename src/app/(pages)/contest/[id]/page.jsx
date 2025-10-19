// src/app/(pages)/contest/[id]/page.jsx
"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { getSocket } from "@/app/lib/socket";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useContestStore } from "@/app/store/useContestStore";
import { useBundleStore } from "@/app/store/useBundleStore";
import ContestHeader from "@/app/components/contest/ContestHeader";
import ContestRules from "@/app/components/contest/ContestRules";
import ContestPrizes from "@/app/components/contest/ContestPrizes";
import ContestAchievements from "@/app/components/contest/ContestAchievments";
import AdminAttachProblemsDialog from "@/app/components/contest/AdminAttachProblemDialog"; // ✅ keep name consistent
import Link from "next/link";

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = params?.id;
  const { authUser } = useAuthStore();

  const { contest, fetchContest, isLoading } = useContestStore();
  const { bundle, fetchBundle } = useBundleStore();

  useEffect(() => {
    if (contestId) fetchContest(contestId);
  }, [contestId, fetchContest]);

  // If participant is registered (or admin preview), fetch bundle
  useEffect(() => {
    if (contestId && authUser?.id) {
      fetchBundle({ contestId, userId: authUser.id });
    }
  }, [contestId, authUser?.id, fetchBundle]);
  useEffect(() => {
  const socket = getSocket();
  socket.emit("join:contest", { contestId }); // optional: room-based listening

  socket.on("contestStatusUpdated", ({ contestId: changedId, newStatus }) => {
    if (changedId === contestId) {
      console.log(`[socket] contest ${contestId} updated → ${newStatus}`);
      fetchContest(contestId);
    }
  });

  return () => socket.off("contestStatusUpdated");
}, [contestId, fetchContest]);


  if (isLoading || !contest) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  const isAdmin = authUser?.role === "ADMIN";
  const problems = bundle?.problems || [];

  console.log("........................Problems of the contest ...........................:");
  console.log(problems);

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
              <button className="bg-blue-600 p-2 hover:bg-blue-500 border border-white/10 rounded-lg">
                🏆 Leaderboard
              </button>
            </Link>
          </div>
        </div>

        {
          problems?.length > 0 ? (
            <div className="flex-col mt-6 ">
              <p className="mb-2 font-semibold text-lg">Click below 👇 to enter the contest</p>
              <Link href="/contestPage">
              <button className="p-2 text-blue-600  cursor-pointer hover:text-blue-400 border border-blue-600 hover:border-blue-400 rounded-lg ">
                Enter Contest 
              </button>
               </Link>
            </div>
          ) : (
             <div className="max-w-6xl mx-auto mt-4 text-gray-400">
            {isAdmin
              ? "No problems attached yet."
              : "Register to see problems when the contest starts."}
          </div>
          )
        }
      
      </div>

         

      <ContestRules />
      <ContestPrizes />
      <ContestAchievements />
    </div>
  );
}
