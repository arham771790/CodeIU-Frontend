// src/app/(pages)/contest/[id]/page.jsx
"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useContestStore } from "@/app/store/useContestStore";
import { useBundleStore } from "@/app/store/useBundleStore";
import ContestHeader from "@/app/components/contest/ContestHeader";
import ContestRules from "@/app/components/contest/ContestRules";
import ContestPrizes from "@/app/components/contest/ContestPrizes";
import ContestAchievements from "@/app/components/contest/ContestAchievments";
import AdminAttachProblemsDialog from "@/app/components/contest/AdminAttachProblemDialog";

import Link from "next/link";

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = params?.id;
  const { authUser } = useAuthStore();

  const { contest, fetchContest, isLoading } = useContestStore();
  const { bundle, fetchBundle } = useBundleStore();

  useEffect(() => {
    fetchContest(contestId);
  }, [contestId, fetchContest]);

  // If participant is registered, they can pull the bundle (problems)
  useEffect(() => {
    if (contestId && authUser?.id) {
      fetchBundle({ contestId, userId: authUser.id });
    }
  }, [contestId, authUser?.id, fetchBundle]);

  if (isLoading || !contest) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  const isAdmin = authUser?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <ContestHeader contest={contest} />

      <div className=" md:px-8 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <h2 className="text-lg md:text-xl font-semibold text-white">
              Contest Overview
            </h2> 
          </div>

          <div className="flex items-center justify-center gap-2">
            {isAdmin && <AdminAttachProblemsDialog contestId={contest.id} />}
            <Link href= {`/Leaderboard/${contestId}`}>
            <button className="bg-blue-600 p-2 hover:bg-blue-500 cursor pointer border border-white/10 rounded-lg">
              🏆 Leaderboard
            </button>
            </Link>
          </div>
        </div>
        {/* If participant has access, show attached problems */}
        {bundle?.problems?.length ? (
          <div className="max-w-6xl mx-auto mt-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bundle.problems.map((p) => (
                <div
                  key={p.index}
                  className="bg-[#121212] border border-gray-800 rounded-xl p-4"
                >
                  <div className="text-sm text-gray-400">Problem {p.index}</div>
                  <div className="text-white font-semibold mt-1">{p.title}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    {p.points} pts
                  </div>
                  {p.slug && (
                    <div className="text-xs text-gray-500 mt-2 truncate">
                      /{p.slug}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
