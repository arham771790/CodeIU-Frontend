"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Code, Trophy, Calendar, ExternalLink, ChevronRight, User as UserIcon } from "lucide-react";
import Link from "next/link";

export default function UserProfilePage() {
    const { userId } = useParams();
    const router = useRouter();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfileData() {
            try {
                const subRes = await fetch(`/api/v1/users/${userId}/submissions`);
                const subData = await subRes.json();
                setSubmissions(subData.submissions || []);
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
            } finally {
                setLoading(false);
            }
        }
        if (userId) fetchProfileData();
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 p-6 md:p-12 text-base-content font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Profile Header Block */}
                <section className="bg-base-200 rounded-[3rem] p-10 md:p-16 mb-10 border-2 border-base-content/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative flex flex-col md:flex-row items-center gap-10">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-base-300 border-4 border-primary/20 flex items-center justify-center text-5xl font-black text-primary shadow-2xl">
                            {userId.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{userId}</h1>
                                <div className="badge badge-primary font-black uppercase tracking-widest text-[10px] h-6 px-3">Elite Tier</div>
                            </div>
                            <p className="text-base-content/40 font-medium flex items-center justify-center md:justify-start gap-2 mb-8">
                                <Calendar size={14} className="text-primary" /> Member Since Node 2024.0.1
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <div className="px-6 py-3 bg-base-300 rounded-2xl border border-base-content/5 flex flex-col items-center md:items-start min-w-[120px]">
                                    <span className="text-[10px] font-black uppercase opacity-30 mb-1">Total Solves</span>
                                    <span className="text-xl font-bold">{submissions.filter(s => s.status === "Accepted").length}</span>
                                </div>
                                <div className="px-6 py-3 bg-base-300 rounded-2xl border border-base-content/5 flex flex-col items-center md:items-start min-w-[120px]">
                                    <span className="text-[10px] font-black uppercase opacity-30 mb-1">Submissions</span>
                                    <span className="text-xl font-bold">{submissions.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Sidebar Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-base-200 rounded-[2.5rem] p-8 border border-base-content/10">
                            <h2 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                <Trophy size={20} className="text-primary" /> Performance
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-base-300/50 p-4 rounded-2xl border border-base-content/5 flex justify-between items-center">
                                    <span className="text-xs font-bold opacity-40">Language Preference</span>
                                    <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-lg font-black">C++</span>
                                </div>
                                <div className="bg-base-300/50 p-4 rounded-2xl border border-base-content/5 flex justify-between items-center">
                                    <span className="text-xs font-bold opacity-40">Submission Frequency</span>
                                    <span className="text-xs font-bold">12.4 / week</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submissions List */}
                    <div className="lg:col-span-2">
                        <div className="bg-base-200 rounded-[2.5rem] p-10 border border-base-content/10 shadow-xl">
                            <header className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                                    <Code size={24} className="text-primary" /> Activity <span className="opacity-20">Log</span>
                                </h2>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Sorted by newest</div>
                            </header>

                            <div className="space-y-4">
                                {submissions.map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => router.push(`/submissions/${sub.id}`)}
                                        className="w-full bg-base-300/40 hover:bg-base-300/80 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center gap-6 transition-all border-2 border-transparent hover:border-primary/20 group relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-6 flex-1 w-full sm:w-auto">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${sub.status === "Accepted" ? "bg-success/20 text-success" : "bg-error/20 text-error"
                                                }`}>
                                                <Code size={24} />
                                            </div>
                                            <div className="text-left w-full">
                                                <p className="font-black text-lg tracking-tight mb-1 group-hover:text-primary transition-colors">{sub.problemId}</p>
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-40">
                                                    <span>{sub.language}</span>
                                                    <span className="w-1 h-1 bg-current rounded-full" />
                                                    <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 border-t sm:border-t-0 border-base-content/5 pt-4 sm:pt-0">
                                            <div className="flex flex-col items-end">
                                                <span className={`badge border-none font-black uppercase tracking-[0.15em] text-[9px] h-6 px-3 shadow-sm ${sub.status === "Accepted" ? "bg-success text-success-content" : "bg-error text-error-content"
                                                    }`}>
                                                    {sub.status}
                                                </span>
                                                <span className="text-[10px] font-mono opacity-30 mt-1">{sub.time || "0ms"} • {sub.memory || "0KB"}</span>
                                            </div>
                                            <div className="bg-base-content/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-primary-content transition-all">
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </button>
                                ))}

                                {submissions.length === 0 && (
                                    <div className="text-center py-20 opacity-20 border-2 border-dashed border-base-content/10 rounded-[2.5rem]">
                                        <Code size={48} className="mx-auto mb-4" />
                                        <p className="font-black uppercase tracking-widest text-xs">No active nodes detected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
