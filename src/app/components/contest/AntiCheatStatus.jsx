"use client";
import React, { useEffect, useState } from "react";
import { Shield, AlertTriangle, Ban } from "lucide-react";
import { getContestSocket } from "@/app/lib/socket";

export default function AntiCheatStatus({ userId }) {
    const [warnings, setWarnings] = useState(0);
    const [disqualified, setDisqualified] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const contestSocket = getContestSocket();

        // Listen for warnings/disqualification
        const handleParticipantWarning = ({ warnings: w, state }) => {
            setWarnings(w);
            if (state === "DISQUALIFIED") {
                setDisqualified(true);
            }
        };

        contestSocket.on("participant:warning", handleParticipantWarning);

        return () => {
            contestSocket.off("participant:warning", handleParticipantWarning);
        };
    }, [userId]);

    if (disqualified) {
        return (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[150] flex items-center justify-center">
                <div className="bg-error/10 border-2 border-error rounded-3xl p-12 max-w-md text-center shadow-[0_0_50px_rgba(var(--er),0.3)]">
                    <Ban size={80} className="mx-auto mb-6 text-error animate-pulse" />
                    <h2 className="text-3xl font-black uppercase mb-4 text-error">
                        Disqualified
                    </h2>
                    <p className="text-base-content/80 mb-6 font-medium leading-relaxed">
                        You have been disqualified from this contest due to policy violations (Tab switching, etc).
                    </p>
                    <div className="bg-error/20 rounded-2xl p-4 mb-2">
                        <p className="text-xs font-black uppercase tracking-widest text-error">
                            Status Terminated
                        </p>
                    </div>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest mt-4">
                        Total warnings: {warnings}/2
                    </p>
                </div>
            </div>
        );
    }

    if (warnings > 0) {
        return (
            <div className="fixed bottom-6 right-6 bg-warning/10 border-2 border-warning rounded-2xl p-6 max-w-sm z-[90] shadow-2xl animate-in slide-in-from-right-10 duration-500">
                <div className="flex items-start gap-4">
                    <div className="bg-warning/20 p-3 rounded-xl">
                        <AlertTriangle size={24} className="text-warning animate-pulse" />
                    </div>
                    <div>
                        <h4 className="font-black text-warning uppercase text-sm tracking-tighter mb-1">
                            Warning {warnings}/2
                        </h4>
                        <p className="text-xs opacity-80 leading-relaxed font-medium">
                            {warnings === 1
                                ? "Switching tabs or exiting fullscreen again will result in disqualification."
                                : "You are currently being monitored. Next violation is final."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
