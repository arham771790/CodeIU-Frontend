"use client";
import { useEffect, useMemo } from "react";
import { useParticipantStore } from "@/app/store/useParticipantStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import { Calendar, UserPlus, UserMinus } from "lucide-react";

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
  }, [authUser?.id, contest?.id, checkRegistration]);

  const startsAtText = useMemo(() => {
    if (!contest?.startsAt) return "";
    const d = new Date(contest?.startsAt);
    return d.toLocaleString(undefined, {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  }, [contest?.startsAt]);

  const onRegister = async () => {
    if (!authUser?.id) return;
    await register({ contestId: contest.id, userId: authUser.id, username: authUser.username });
  };

  const onUnregister = async () => {
    if (!authUser?.id) return;
    await unregister({ contestId: contest.id, userId: authUser.id });
  };

  return (
    <div className="relative border-b border-base-content/5 overflow-hidden bg-base-100">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-5 max-w-7xl mx-auto px-6 py-5 md:py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            {/* Continuous Gapless Underline Title Container */}
            <div className="relative inline-block mb-4">
              <h1 className="text-3xl md:text-3xl font-black tracking-tighter flex items-baseline justify-center md:justify-start pb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-400">
                  {contest?.title}
                </span>
              </h1>
              {/* The gapless continuous line */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary/10 rounded-full shadow-[0_0_20px_rgba(var(--p),0.8)]" />
            </div>

            <p className="flex items-center justify-center md:justify-start gap-2 text-lg text-base-content/60 font-medium">
              <Calendar size={18} className="text-primary" /> {startsAtText}
            </p>
          </div>

          <div className="flex shrink-0">
            {isRegistered ? (
              <button
                onClick={onUnregister}
                disabled={isUnregistering}
                className="btn btn-outline border-error/30 text-error hover:bg-error hover:text-white hover:border-error rounded-2xl px-8 h-12 shadow-lg shadow-error/10"
              >
                <UserMinus size={18} /> {isUnregistering ? "Unregistering…" : "Unregister"}
              </button>
            ) : (
              <button
                id="register-contest-btn"
                onClick={onRegister}
                disabled={isRegistering}
                className="btn btn-primary rounded-2xl px-8 h-10 shadow-xl shadow-primary/20 text-white font-black uppercase tracking-widest hover:scale-105 transition-all"
              >
                <UserPlus size={18} /> {isRegistering ? "Registering…" : "Register"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}