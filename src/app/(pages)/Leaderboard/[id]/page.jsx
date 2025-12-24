"use client";

import React, { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { RefreshCcw, Trophy } from "lucide-react";
import { useLeaderboardStore } from "@/app/store/useLeaderboardStore";

/* ----- Helpers ----- */
function initials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return "—";
  }
}

function medal(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

export default function LeaderboardPage() {
  const params = useParams();
  const contestId = params?.id;

  const {
    rows,
    isLoading,
    updatedAt,
    source,
    fetchLeaderboard,
    bindRealtime,
    unbindRealtime,
  } = useLeaderboardStore();

  useEffect(() => {
    if (!contestId) return;

    fetchLeaderboard(contestId, 1000);
    bindRealtime(contestId);

    return () => {
      unbindRealtime();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestId]);

  const top3 = useMemo(() => rows.slice(0, 3), [rows]);
  const rest = useMemo(() => rows.slice(3), [rows]);

  return (
    <div className="min-h-screen bg-black text-white font-sans px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Leaderboard
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Contest ID:{" "}
                <span className="font-mono text-gray-300">{contestId}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-800 bg-gray-900/60 text-xs">
                <span className="text-gray-400">Source:</span>
                <span className="font-semibold">
                  {source ? source.toUpperCase() : "—"}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">
                  {updatedAt ? `Updated ${formatTime(updatedAt)}` : "Live"}
                </span>
              </div>

              <button
                onClick={() => fetchLeaderboard(contestId, 1000)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 border border-gray-800 text-sm"
                title="Refresh"
              >
                <RefreshCcw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="mt-3 text-sm text-gray-400">
              Loading leaderboard…
            </div>
          )}
        </header>

        {/* Top 3 */}
        {top3.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold">Top performers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3.map((u, idx) => {
                const rank = u.rank ?? idx + 1;
                return (
                  <div
                    key={(u.userId || u.username || idx) + "-top"}
                    className="rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">{medal(rank) || "🏅"}</div>
                      <div className="text-xs text-gray-400">
                        Rank{" "}
                        <span className="font-semibold text-gray-200">
                          {rank}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold">
                        {initials(u.username)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold truncate">
                          {u.username || "User"}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          Solved:{" "}
                          <span className="text-gray-200 font-semibold">
                            {u.solvedCount ?? 0}
                          </span>
                          {"  "}•{"  "}
                          Penalty:{" "}
                          <span className="text-gray-200 font-semibold">
                            {u.penalty ?? 0}m
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div className="text-xs text-gray-400">Score</div>
                      <div className="text-2xl font-extrabold text-green-400">
                        {u.score ?? 0}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Table */}
        <div className="rounded-xl border border-gray-800 bg-gray-950 overflow-hidden shadow-lg">
          <div className="px-4 py-3 bg-black/40 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-bold">Participants</h3>
            <div className="text-xs text-gray-400">{rows.length} total</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-900/70 sticky top-0 z-10">
                <tr>
                  <th className="p-4 font-semibold text-left w-[10%]">Rank</th>
                  <th className="p-4 font-semibold text-left w-[45%]">User</th>
                  <th className="p-4 font-semibold text-center w-[15%]">Solved</th>
                  <th className="p-4 font-semibold text-right w-[15%]">Score</th>
                  <th className="p-4 font-semibold text-right w-[15%]">Penalty</th>
                </tr>
              </thead>

              <tbody>
                {rest.map((u, i) => {
                  const r = u.rank ?? i + 4;
                  return (
                    <tr
                      key={(u.userId || u.username || i) + "-row"}
                      className="border-t border-gray-900 hover:bg-gray-900/40 transition-colors"
                    >
                      <td className="p-4 font-semibold">{r}</td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-xs">
                            {initials(u.username)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">
                              {u.username || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate font-mono">
                              {u.userId || ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-center font-semibold">
                        {u.solvedCount ?? 0}
                      </td>

                      <td className="p-4 text-right font-extrabold text-green-400">
                        {u.score ?? 0}
                      </td>

                      <td className="p-4 text-right font-semibold text-red-300">
                        +{u.penalty ?? 0}m
                      </td>
                    </tr>
                  );
                })}

                {rows.length === 0 && !isLoading && (
                  <tr>
                    <td className="p-10 text-center text-gray-400" colSpan={5}>
                      No participants yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-800 bg-black/30 text-xs text-gray-500">
            Live updates are pushed automatically (Socket.IO).
          </div>
        </div>
      </div>
    </div>
  );
}
