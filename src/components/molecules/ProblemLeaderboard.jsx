"use client";
import React, { useEffect, useState } from "react";
import { axiosInstanceSubmissionService } from "@/lib/axios";
import { Loader2, Trophy, Clock, Cpu, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ProblemLeaderboard({ problemId }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!problemId) return;
            setLoading(true);
            try {
                const res = await axiosInstanceSubmissionService.get(`/submission/leaderboard/${problemId}`);
                if (res.data?.success) {
                    setLeaderboard(res.data.leaderboard || []);
                }
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                setError("Failed to load leaderboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [problemId]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-primary opacity-50" size={24} />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-error opacity-70 text-xs font-bold">{error}</div>;
    }

    if (!leaderboard.length) {
        return (
            <div className="text-center py-10 text-xs font-bold opacity-30 italic">
                No record-breaking solutions yet. Be the first!
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-base-300/20 rounded-[2rem] border border-base-content/5">
            <table className="table table-zebra w-full text-xs">
                <thead>
                    <tr className="border-b border-base-content/10 bg-base-300/50">
                        <th className="text-[10px] font-black uppercase opacity-40">Rank</th>
                        <th className="text-[10px] font-black uppercase opacity-40">User</th>
                        <th className="text-[10px] font-black uppercase opacity-40">Time</th>
                        <th className="text-[10px] font-black uppercase opacity-40">Mem</th>
                        <th className="text-[10px] font-black uppercase opacity-40">Lang</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((entry, idx) => (
                        <tr key={entry.id} className="hover:bg-primary/5 transition-colors border-none group">
                            <td className="font-black opacity-30">
                                {idx === 0 ? <Trophy size={14} className="text-warning" /> : idx + 1}
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="font-bold truncate max-w-[80px]">User {entry.userId.slice(0, 5)}</span>
                                    <span className="text-[9px] opacity-30">
                                        {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </td>
                            <td className="font-mono text-success font-bold">{entry.time || 'N/A'}s</td>
                            <td className="font-mono opacity-60 italic">{entry.memory || 'N/A'}</td>
                            <td>
                                <span className="badge badge-outline border-base-content/10 text-[9px] font-bold uppercase py-0 px-2 h-4 scale-90">
                                    {entry.language}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
