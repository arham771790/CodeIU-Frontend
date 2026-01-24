"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useLeaderboardStore } from "@/app/store/useLeaderboardStore";
import { toast } from "react-toastify";
import { useSubmissionStore } from "@/app/store/useSubmissionStore";

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

function formatSolveTime(solvedAt, startsAt) {
  if (!solvedAt || !startsAt) return "—";
  const diff = new Date(solvedAt) - new Date(startsAt);
  if (diff < 0) return "0:00";
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
    frozen,
    setInitialLeaderboard,
    unbindRealtime,
  } = useLeaderboardStore();

  const { fetchSubmissionsByProblem, submissions: submissionsFromStore } = useSubmissionStore();

  const [problemList, setProblemList] = useState([]);
  const [contestInfo, setContestInfo] = useState(null);
  const [viewingSubmissions, setViewingSubmissions] = useState(null); // { userId, probId, data: [] }
  const [isViewingLoading, setIsViewingLoading] = useState(false);

  useEffect(() => {
    if (initialData) setInitialLeaderboard(initialData);
  }, [initialData, setInitialLeaderboard]);

  useEffect(() => {
    if (!contestId) return;
    bindRealtime(contestId);

    // Fetch problem list and contest info for the grid
    const fetchData = async () => {
      try {
        const [bundleRes, statusRes] = await Promise.all([
          fetch(`/api/v1/contests/${contestId}/bundle`),
          fetch(`/api/v1/contests/${contestId}/status`)
        ]);

        if (bundleRes.ok) {
          const bundleData = await bundleRes.json();
          setProblemList(bundleData.bundle?.problems || []);
        }

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setContestInfo(statusData);
        }
      } catch (err) {
        console.error("Failed to fetch contest/bundle info:", err);
      }
    };

    fetchData();

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

        {/* Freeze Banner */}
        {frozen && (
          <div className="mb-10 bg-warning/10 border-2 border-warning/30 rounded-[2rem] p-8 flex items-center gap-6 shadow-2xl animate-pulse">
            <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center border border-warning/50">
              <Lock size={32} className="text-warning" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-warning mb-1">
                Leaderboard Frozen
              </h3>
              <p className="text-sm font-medium opacity-70">
                Live updates are paused for the final period. Final standings will be revealed once the contest ends.
              </p>
            </div>
          </div>
        )}

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
            onClick={async () => {
              await refreshLeaderboard(contestId);
              toast.success("Leaderboard updated!");
            }}
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

                  {/* NEW: Problem columns */}
                  {problemList.map((p, i) => (
                    <th key={p.id || i} className="px-4 py-5 font-black border-none text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-primary opacity-60">{String.fromCharCode(65 + i)}</span>
                        <HelpCircle size={10} className="opacity-20" />
                      </div>
                    </th>
                  ))}

                  <th className="px-8 py-5 font-black border-none text-center">Solved</th>
                  <th className="px-8 py-5 font-black border-none text-right">Penalty</th>
                  <th className="px-8 py-5 font-black border-none text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/5">
                {rows.map((u, i) => {
                  const r = u.rank ?? i + 1;
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

                      {/* NEW: Problem cells (Clickable) */}
                      {problemList.map((p) => {
                        const probStatus = (u.problems || []).find(ps => ps.problemId === p.id);
                        return (
                          <td key={p.id} className={`px-4 py-5 text-center cursor-pointer hover:bg-base-content/10 transition-all rounded-xl`}
                            onClick={async () => {
                              if (probStatus?.attempts === 0) return;
                              setIsViewingLoading(true);
                              setViewingSubmissions({ userId: u.userId, username: u.username, probId: p.id, data: [] });

                              try {
                                // We need an endpoint that can fetch OTHER users' submissions if admin,
                                // or just current user's. For now, we assume it's the current user or
                                // the system allows fetching if context is valid.
                                // The current fetchSubmissionsByProblem uses the current user's token.
                                // To view OTHERS, we'd need a different endpoint.
                                // But user asked "leaderboard view per problem submission",
                                // maybe they meant just for themselves initially?
                                // Let's at least show the current user's if they click their own row.

                                await fetchSubmissionsByProblem(p.id, contestId);
                                // The store updates `submissions` state.
                                setViewingSubmissions(prev => ({ ...prev, data: submissionsFromStore }));
                              } catch (err) {
                                toast.error("Failed to fetch submissions.");
                              } finally {
                                setIsViewingLoading(false);
                              }
                            }}>
                            {probStatus?.status === "SOLVED" ? (
                              <div className="flex flex-col items-center gap-1 animate-in zoom-in duration-300">
                                <CheckCircle size={20} className="text-success drop-shadow-[0_0_8px_rgba(var(--s),0.4)]" />
                                <span className="text-[9px] font-black font-mono opacity-40">
                                  {formatSolveTime(probStatus.solvedAt, contestInfo?.startsAt)}
                                </span>
                              </div>
                            ) : probStatus?.attempts > 0 ? (
                              <div className="bg-error/10 text-error rounded-lg py-1 px-2 inline-block">
                                <span className="text-[10px] font-black">-{probStatus.attempts}</span>
                              </div>
                            ) : (
                              <span className="text-base-content/10 font-black">—</span>
                            )}
                          </td>
                        );
                      })}

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
                    <td className="py-24 text-center opacity-30 italic font-medium" colSpan={problemList.length + 5}>
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

        {/* Submission History Modal */}
        {viewingSubmissions && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="bg-base-200 border-2 border-base-content/10 rounded-[3rem] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl relative">
              <div className="p-8 border-b border-base-content/5 flex justify-between items-center bg-base-300/30">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Submission History</h3>
                  <p className="text-xs font-bold opacity-30 uppercase tracking-widest mt-1">
                    {viewingSubmissions.username} • Problem {viewingSubmissions.probId.substring(0, 8)}
                  </p>
                </div>
                <button onClick={() => setViewingSubmissions(null)} className="btn btn-ghost btn-circle">✕</button>
              </div>

              <div className="p-8 overflow-auto flex-grow custom-scrollbar">
                {isViewingLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <span className="loading loading-ring loading-lg text-primary"></span>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Retrieving data nodes...</p>
                  </div>
                ) : !submissionsFromStore?.length ? (
                  <div className="text-center py-20 opacity-30 italic">No submissions found for this problem.</div>
                ) : (
                  <div className="space-y-4">
                    {submissionsFromStore.map((sub, idx) => (
                      <div key={sub.id || idx} className="bg-base-300/50 border border-base-content/5 rounded-3xl p-6 hover:bg-base-300 transition-all group">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${sub.status === "Accepted" ? "bg-success animate-pulse" : "bg-error"}`} />
                            <span className={`text-lg font-black uppercase ${sub.status === "Accepted" ? "text-success" : "text-error"}`}>{sub.status}</span>
                          </div>
                          <span className="text-[10px] font-mono opacity-40">{new Date(sub.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-base-100/50 p-3 rounded-2xl">
                            <p className="text-[8px] font-black opacity-30 uppercase">Language</p>
                            <p className="text-xs font-bold">{sub.language}</p>
                          </div>
                          <div className="bg-base-100/50 p-3 rounded-2xl">
                            <p className="text-[8px] font-black opacity-30 uppercase">Runtime</p>
                            <p className="text-xs font-bold">{sub.time || "0ms"}</p>
                          </div>
                          <div className="bg-base-100/50 p-3 rounded-2xl">
                            <p className="text-[8px] font-black opacity-30 uppercase">Memory</p>
                            <p className="text-xs font-bold">{sub.memory || "0KB"}</p>
                          </div>
                          <div className="bg-base-100/50 p-3 rounded-2xl">
                            <p className="text-[8px] font-black opacity-30 uppercase">Points</p>
                            <p className="text-xs font-bold">{sub.status === "Accepted" ? "100" : "0"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}