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
            <h2 className="text-lg md:text-xl font-semibold text-white">
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

        {/* Problems grid */}
        {problems.length > 0 ? (
          <div className="max-w-6xl mx-auto mt-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {problems
                .slice() // avoid mutating original
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
                      key={key} // ✅ stable unique key
                      className="bg-[#121212] border border-gray-800 rounded-xl p-4"
                    >
                      <div className="text-sm text-gray-400">Problem {label}</div>
                      <div className="text-white font-semibold mt-1 truncate">
                        {title}
                      </div>
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
