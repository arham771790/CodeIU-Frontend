"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight } from "lucide-react";

export default function ContestEndModal({ contestId, show }) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!show) return;

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    router.push(`/contest/${contestId}/summary`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [show, router, contestId]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center">
            <div className="bg-base-200 border-2 border-primary rounded-3xl p-12 max-w-md text-center shadow-2xl">
                <Trophy size={64} className="mx-auto mb-6 text-primary animate-bounce" />
                <h2 className="text-3xl font-black uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-400">
                    Contest Ended
                </h2>
                <p className="text-base-content/60 mb-8 font-medium">
                    Time's up! Redirecting to results in <span className="text-2xl font-bold text-primary">{countdown}</span>s
                </p>
                <button
                    onClick={() => router.push(`/contest/${contestId}/summary`)}
                    className="btn btn-primary btn-lg rounded-2xl gap-2 w-full font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                    View Results Now <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
