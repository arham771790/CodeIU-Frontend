// src/app/components/contest/ContestHeader.jsx
"use client";
import { useMemo } from "react";
import { useParticipantStore } from "@/app/store/useParticipantStore";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function ContestHeader({ contest }) {
  const { authUser } = useAuthStore();
  const { isRegistered, isRegistering, register } = useParticipantStore();

  const startsAtText = useMemo(() => {
    if (!contest?.startsAt) return "";
    const d = new Date(contest.startsAt);
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }, [contest?.startsAt]);

  const onRegister = async () => {
    if (!authUser?.id) return;
    await register({ contestId: contest.id, userId: authUser.id });
  };

  return (
    <div className="px-4 md:px-8 py-8 md:py-12 bg-[#0e0e0e]">
      <div className="max-w-6xl mx-auto flex items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-semibold text-white">
            {contest?.title || "Contest"}
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-2">
            {startsAtText}
          </p>
        </div>

        <button
          onClick={onRegister}
          disabled={isRegistering || isRegistered}
          className={`rounded-full px-4 py-2 text-sm font-medium transition
            ${isRegistered
              ? "bg-emerald-800/40 text-emerald-300 border border-emerald-700/50 cursor-default"
              : "bg-white text-black hover:bg-gray-200"}`}
        >
          {isRegistered ? "Registered" : isRegistering ? "Registering…" : "Register"}
        </button>
      </div>
    </div>
  );
}
