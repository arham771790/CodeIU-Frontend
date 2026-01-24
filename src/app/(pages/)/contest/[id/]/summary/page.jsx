"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, Trophy, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ContestSummaryPage() {
    const params = useParams();
    const contestId = params.id;
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContest() {
            try {
                const res = await fetch(`/api/v1/contests/${contestId}`);
                const data = await res.json();
                setContest(data.contest);
            } catch (err) {
                console.error("Failed to fetch contest summary:", err);
            } finally {
                setLoading(false);
            }
        }
        if (contestId) fetchContest();
    }, [contestId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <span className="loading loading-ring loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-6 text-base-content font-sans">
            <div className="max-w-2xl w-full bg-base-200 rounded-[3rem] p-12 text-center border-2 border-base-content/5 shadow-2xl relative overflow-hidden backdrop-blur-md">
                {/* Abstract Background Effects */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-sky-400 to-primary" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-400/10 blur-[100px] rounded-full" />

                <div className="relative">
                    <div className="bg-success/20 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle size={48} className="text-success" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        Contest <span className="text-primary">Finished</span>
                    </h1>

                    <p className="text-base-content/60 mb-10 text-lg font-medium max-w-md mx-auto leading-relaxed">
                        Congratulations! You've successfully completed the arena challenge. Your final score has been locked in.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        <div className="bg-base-300/50 rounded-3xl p-6 border border-base-content/5 text-left group hover:bg-base-300 transition-colors">
                            <p className="text-[10px] uppercase tracking-widest font-black opacity-30 mb-2 flex items-center gap-2">
                                <Trophy size={12} className="text-primary" /> Standing Reveal
                            </p>
                            <p className="text-xl font-bold font-mono">
                                {contest?.endsAt ? new Date(contest.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "..."}
                            </p>
                        </div>
                        <div className="bg-base-300/50 rounded-3xl p-6 border border-base-content/5 text-left group hover:bg-base-300 transition-colors">
                            <p className="text-[10px] uppercase tracking-widest font-black opacity-30 mb-2 flex items-center gap-2">
                                <Clock size={12} className="text-primary" /> Arena Node
                            </p>
                            <p className="text-xl font-bold font-mono truncate">{contestId}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={`/contest/${contestId}/leaderboard`}
                            className="btn btn-primary rounded-[1.5rem] px-8 py-4 h-auto font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primary/20"
                        >
                            Live Standings <ChevronRight size={16} />
                        </Link>
                        <Link
                            href="/"
                            className="btn btn-ghost rounded-[1.5rem] px-8 py-4 h-auto font-black uppercase tracking-widest text-xs gap-3 border border-base-content/10"
                        >
                            <Home size={16} /> Return Home
                        </Link>
                    </div>

                    <p className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] opacity-20">
                        Final results determined after all node calculations terminate
                    </p>
                </div>
            </div>
        </div>
    );
}
