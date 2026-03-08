"use client";

import { useEffect, useMemo, useState } from "react";
import {
    X, Plus, Search,
    Trash2, Database, ListChecks
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { toast } from "react-toastify";
import { fetchAllProblemsAction } from "@/actions/problemBridge";

export default function AdminPlaylistAttachProblemDialog({ playlistId, subdivisionId }) {
    const { authUser } = useAuthStore();
    const isAdmin = authUser?.role === "ADMIN";
    const { addProblemToSubdivision, currentPlaylist } = usePlaylistStore();

    const [open, setOpen] = useState(false);
    const [problems, setProblems] = useState([]);
    const [loadingProblems, setLoadingProblems] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && problems.length === 0) {
            setLoadingProblems(true);
            fetchAllProblemsAction()
                .then((data) => setProblems(data || []))
                .catch(() => toast.error("Failed to load problems"))
                .finally(() => setLoadingProblems(false));
        }
    }, [open, problems.length]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return problems;
        return problems.filter(p =>
            p.title?.toLowerCase().includes(q) ||
            p.slug?.toLowerCase().includes(q) ||
            String(p.problemNo).includes(q) ||
            p.tags?.some(t => t.toLowerCase().includes(q))
        );
    }, [problems, query]);

    const currentSubdivision = currentPlaylist?.subdivisions?.find(s => s.id === subdivisionId);
    const alreadyAttached = new Set(currentSubdivision?.problems?.map(p => p.problemId) || []);

    const attachProblem = async (problemId) => {
        try {
            setLoading(true);
            const order = currentSubdivision?.problems?.length || 0;
            await addProblemToSubdivision(playlistId, subdivisionId, problemId, order);
            setOpen(false);
        } catch (e) {
            // toast in store
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) return null;

    return (
        <>
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(true); }}
                className="btn btn-ghost btn-xs text-primary hover:bg-primary/10 gap-1 rounded-full px-3 h-7 flex items-center justify-center"
            >
                <Plus className="w-3 h-3" /> Add Problem
            </button>

            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-base-100/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

                    <div className="relative w-full max-w-2xl bg-base-200 border border-base-content/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-base-content/5 flex items-center justify-between bg-base-300/30">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Database size={16} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black tracking-tight">Attach Problem</h3>
                                    <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest">{currentSubdivision?.title}</p>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-2 hover:bg-base-content/10 rounded-full transition-colors opacity-50 hover:opacity-100">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="relative mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                                <input
                                    placeholder="Search problem library..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full bg-base-300/50 border border-base-content/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <div className="h-[300px] overflow-auto rounded-2xl border border-base-content/10 bg-base-300/20">
                                {loadingProblems ? (
                                    <div className="flex items-center justify-center h-full gap-3 text-sm opacity-40 italic">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        Syncing library...
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm opacity-40 italic">No matches found.</div>
                                ) : (
                                    <div className="divide-y divide-base-content/5">
                                        {filtered.map((p) => (
                                            <div key={p.id} className="flex items-center justify-between gap-4 p-3 hover:bg-base-content/5 transition-colors group">
                                                <div className="min-w-0">
                                                    <div className="text-sm font-bold group-hover:text-primary transition-colors truncate">{p.title}</div>
                                                    <div className="text-[10px] uppercase font-bold opacity-30 flex items-center gap-2 mt-0.5">
                                                        {p.difficulty}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={alreadyAttached.has(p.id) || loading}
                                                    onClick={() => attachProblem(p.id)}
                                                    className={`btn btn-xs rounded-lg px-4 ${alreadyAttached.has(p.id) ? 'btn-disabled opacity-30' : 'btn-primary shadow-lg shadow-primary/20'}`}
                                                >
                                                    {alreadyAttached.has(p.id) ? "Added" : "Add"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
