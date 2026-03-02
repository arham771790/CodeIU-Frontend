"use client";

import React, { useEffect, useMemo } from "react";
import { RefreshCcw, Trophy, Zap, Clock, User, Award, History } from "lucide-react";
import { useLeaderboardStore } from "@/store/useLeaderboardStore";

/* ----- Helpers (Preserved) ----- */
function initials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return "—";
  }
}

const getRankStyles = (rank) => {
  if (rank === 1) return "border-yellow-500/50 shadow-yellow-500/10 text-yellow-500";
  if (rank === 2) return "border-slate-400/50 shadow-slate-400/10 text-slate-400";
  if (rank === 3) return "border-orange-500/50 shadow-orange-500/10 text-orange-500";
  return "border-base-content/10 shadow-transparent text-base-content/40";
};

export default function LeaderboardClientView({ contestId, initialData }) {
  const {
    rows,
    isLoading,
    updatedAt,
    source,
    setInitialLeaderboard,
    refreshLeaderboard,
    bindRealtime,
    unbindRealtime,
  } = useLeaderboardStore();

  useEffect(() => {
    if (initialData) setInitialLeaderboard(initialData);
  }, [initialData, setInitialLeaderboard]);

  useEffect(() => {
    if (!contestId) return;
    bindRealtime(contestId);
    return () => unbindRealtime();
  }, [contestId, bindRealtime, unbindRealtime]);

  const top3 = useMemo(() => rows.slice(0, 3), [rows]);
  const rest = useMemo(() => rows.slice(3), [rows]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans px-4 sm:px-6 lg:px-10 py-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Signature CodeIU X Header */}
        <header className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block mb-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter flex items-baseline justify-center pb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-400">
                Leaderboard
              </span>
              <span className="relative mx-4">
                <span className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-[2.5] animate-pulse" />
                <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-sky-400">
                  X
                </span>
              </span>
            </h1>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full shadow-[0_0_20px_rgba(var(--p),0.8)]" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-30">
            Contest Node: <span className="font-mono text-primary">{contestId}</span>
          </p>
        </header>

        {/* Toolbar & Meta info */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="flex p-1 bg-base-300/50 backdrop-blur-xl rounded-2xl border border-base-content/10 shadow-xl">
            <div className="flex items-center gap-3 px-4 py-2 border-r border-base-content/5">
              <Zap size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Source</span>
              <span className="text-xs font-bold text-primary">{source?.toUpperCase() || "LIVE"}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2">
              <History size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Last Sync</span>
              <span className="text-xs font-bold opacity-80">{updatedAt ? formatTime(updatedAt) : "Realtime"}</span>
            </div>
          </div>

          <button
            onClick={() => refreshLeaderboard(contestId)}
            className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20 gap-2 h-12 text-white font-black uppercase tracking-widest text-xs"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Force Refresh
          </button>
        </div>

        {/* Elite Top 3 Podium */}
        {top3.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--p),0.5)]" />
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <Trophy className="text-yellow-500" size={24} /> 
                Elite <span className="opacity-20">Performers</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {top3.map((u, idx) => {
                const rank = u.rank ?? idx + 1;
                const style = getRankStyles(rank);
                return (
                  <div
                    key={(u.userId || idx) + "-top"}
                    className={`relative group bg-base-200 border-2 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 ${style}`}
                  >
                    <div className="absolute top-6 right-8">
                       <span className="text-5xl font-black opacity-10">#{rank}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-3xl bg-base-300 border-2 border-current flex items-center justify-center text-3xl font-black shadow-lg">
                          {initials(u.username)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-base-100 rounded-full flex items-center justify-center border-2 border-current">
                           <Award size={16} />
                        </div>
                      </div>

                      <h3 className="text-xl font-black tracking-tight text-base-content mb-1 truncate max-w-full">
                        {u.username || "User"}
                      </h3>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-6">
                         Solved {u.solvedCount ?? 0} Problems
                      </div>

                      <div className="grid grid-cols-2 gap-4 w-full mb-6">
                        <div className="bg-base-300/50 p-3 rounded-2xl text-center border border-base-content/5">
                           <p className="text-[9px] font-black uppercase opacity-40">Penalty</p>
                           <p className="text-sm font-bold text-base-content">{u.penalty ?? 0}m</p>
                        </div>
                        <div className="bg-base-300/50 p-3 rounded-2xl text-center border border-base-content/5">
                           <p className="text-[9px] font-black uppercase opacity-40">Efficiency</p>
                           <p className="text-sm font-bold text-base-content">94%</p>
                        </div>
                      </div>

                      <div className="w-full pt-6 border-t border-base-content/5 flex items-end justify-between">
                         <span className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">Total Score</span>
                         <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-primary">
                            {u.score ?? 0}
                         </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Professional Rankings Table */}
        <div className="bg-base-200 border border-base-content/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="px-8 py-6 bg-base-300/30 border-b border-base-content/5 flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
               <User className="text-primary/50" size={18} /> Participants Queue
            </h3>
            <span className="badge badge-outline border-base-content/10 text-[10px] font-black uppercase">{rows.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-base-300/10 text-base-content/40 uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="px-8 py-5 font-black border-none">Rank</th>
                  <th className="px-8 py-5 font-black border-none text-left">Contender</th>
                  <th className="px-8 py-5 font-black border-none text-center">Solved</th>
                  <th className="px-8 py-5 font-black border-none text-right">Penalty</th>
                  <th className="px-8 py-5 font-black border-none text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/5">
                {rest.map((u, i) => {
                  const r = u.rank ?? i + 4;
                  return (
                    <tr key={(u.userId || i) + "-row"} className="hover:bg-base-content/5 transition-colors group">
                      <td className="px-8 py-5">
                         <span className="text-lg font-black opacity-20 group-hover:opacity-100 transition-opacity">#{r}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-base-300 flex items-center justify-center font-bold text-xs text-primary/40 group-hover:bg-primary group-hover:text-white transition-all">
                            {initials(u.username)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-base-content group-hover:text-primary transition-colors truncate">{u.username || "User"}</p>
                            <p className="text-[10px] font-mono opacity-30 truncate tracking-tighter uppercase">{u.userId || "GUEST_USER"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-sm font-bold opacity-60 group-hover:opacity-100">{u.solvedCount ?? 0}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="text-sm font-bold text-error/60 group-hover:text-error transition-colors">+{u.penalty ?? 0}m</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="text-xl font-black text-primary font-mono">{u.score ?? 0}</span>
                      </td>
                    </tr>
                  );
                })}

                {rows.length === 0 && !isLoading && (
                  <tr>
                    <td className="py-24 text-center opacity-30 italic font-medium" colSpan={5}>
                      <Trophy className="mx-auto mb-4 opacity-10" size={48} />
                      No participants have entered the arena yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-4 bg-base-300/20 text-[10px] font-black uppercase tracking-widest opacity-30 flex items-center gap-2">
            <Zap size={10} className="animate-pulse" /> Live Socket Tunnel Active
          </div>
        </div>
      </div>
    </div>
  );
}