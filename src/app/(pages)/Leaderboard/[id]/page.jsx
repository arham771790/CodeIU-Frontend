"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useLeaderboardStore } from "@/app/store/useLeaderboardStore";
import { ChevronDown } from "lucide-react";

/* ----- Helpers ----- */
function initials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

/* ----- Page Component ----- */
export default function LeaderboardPage() {
  const params = useParams();
  const contestId = params?.id;

  const { rows, isLoading, updatedAt, fetchLeaderboard, initializeSocket, disconnectSocket } =
    useLeaderboardStore();

  // Fetch leaderboard on mount and initialize socket
  useEffect(() => {
    if (!contestId) return;
    fetchLeaderboard(contestId, 1000); // fetch up to 1000 participants
    initializeSocket(contestId);
    return () => disconnectSocket();
  }, [contestId]);

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{`Leaderboard`}</h1>
          <p className="text-green-500 text-lg mt-2">{`Contest: ${contestId}`}</p>
          <div className="inline-flex items-center gap-2 bg-gray-900/50 border border-green-600/30 text-yellow-500 px-4 py-2 rounded-full mt-4 text-sm font-semibold">
            <span>
              {updatedAt
                ? `Updated ${new Date(updatedAt).toLocaleTimeString()}`
                : "Live"}
            </span>
          </div>
          {isLoading && (
            <div className="mt-3 text-sm text-gray-400">Loading leaderboard…</div>
          )}
        </header>

        {/* Leaderboard Table */}
        <div className="bg-gray-900 border border-green-600/30 rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 flex justify-between items-center bg-black/50">
            <h2 className="text-xl font-bold">Participants</h2>
            <button
              onClick={() => fetchLeaderboard(contestId, 1000)}
              className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-md hover:bg-gray-800 border border-gray-700"
              title="Refresh"
            >
              Refresh
              <ChevronDown className="w-4 h-4 rotate-180" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-900/70">
                <tr>
                  <th className="p-4 font-semibold w-[10%] text-left">Rank</th>
                  <th className="p-4 font-semibold w-[45%] text-left">User</th>
                  <th className="p-4 font-semibold w-[20%] text-center">Solved</th>
                  <th className="p-4 font-semibold w-[25%] text-right">Score</th>
                  <th className="p-4 font-semibold w-[20%] text-right">Penalty</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u, i) => (
                  <tr
                    key={(u.userId || u.username || i) + "-row"}
                    className="border-t border-green-600/20 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-4 font-semibold">{u.rank ?? "-"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm">
                          {initials(u.displayName || u.username)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate">{u.displayName || u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-semibold">
                      {u.solvedCount ?? 0}
                    </td>
                    <td className="p-4 text-right font-bold text-green-500">
                      {u.score ?? 0}
                    </td>
                    <td className="p-4 text-right font-bold text-red-400">
                      +{u.penalty ?? 0} min
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && !isLoading && (
                  <tr>
                    <td className="p-6 text-center text-gray-400" colSpan={5}>
                      No participants yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
