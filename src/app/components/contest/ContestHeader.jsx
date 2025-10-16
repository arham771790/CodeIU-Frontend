"use client";
import { useEffect, useMemo } from "react";
import { useParticipantStore } from "@/app/store/useParticipantStore";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function ContestHeader({ contest }) {
  const { authUser } = useAuthStore();
  const {
    isRegistered,
    isRegistering,
    isUnregistering,
    register,
    unregister,
    checkRegistration,
  } = useParticipantStore();

  useEffect(() => {
    if (authUser?.id && contest?.id) {
      checkRegistration({ contestId: contest.id, userId: authUser.id });
    }
  }, [authUser?.id, contest?.id]);

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

  const onUnregister = async () => {
    if (!authUser?.id) return;
    await unregister({ contestId: contest.id, userId: authUser.id });
  };

  return (
    <div className="px-4 md:px-8 py-8 md:py-12 bg-gradient-to-b from-[#020d2e]  to-black">
      
      <div className="max-w-6xl mx-auto flex items-start md:items-center justify-between  border-b border-white/10 pb-4  ">
        
        <div >
          {/* fix invalid sizes: use arbitrary values */}

          <h1 className="text-2xl md:text-4xl font-semibold text-white">
            {contest?.title || "Contest"}
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-2">{startsAtText}</p>
        </div>

        {isRegistered ? (
          <button
            onClick={onUnregister}
            disabled={isUnregistering}
            className="rounded-full px-4 py-2 text-sm font-medium transition bg-emerald-800/40 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900"
          >
            {isUnregistering ? "Unregistering…" : "Unregister"}
          </button>
        ) : (
          <button
            onClick={onRegister}
            disabled={isRegistering}
            className="rounded-full px-4 py-2 text-sm font-medium transition bg-white text-black hover:bg-gray-200 cursor-pointer"
          >
            {isRegistering ? "Registering…" : "Register"}
          </button>
        )}
      </div>
    </div>
  );
}
