"use client";

import { useEffect } from "react";
import Link from "next/link";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { useContestStore } from "@/store/useContestStore";
import { useBundleStore } from "@/store/useBundleStore";
import { useContestTimer } from "@/hooks/useContestTimer";
import { useParticipantStore } from "@/store/useParticipantStore"; // ✅ Import Participant Store

import ContestHeader from "@/components/organisms/ContestHeader";
import ContestRules from "@/components/molecules/ContestRules";
import ContestPrizes from "@/components/molecules/ContestPrizes";
import ContestAchievements from "@/components/molecules/ContestAchievments";
import AdminAttachProblemsDialog from "@/components/organisms/AdminAttachProblemDialog";
import { Zap, AlertTriangle, Lock } from "lucide-react"; // ✅ Icons

export default function ContestClientView({ initialContest }) {
  const { authUser } = useAuthStore();
  const { contest, setContest, fetchContestById } = useContestStore();
  const { bundle, fetchBundle } = useBundleStore();

  // ✅ Get Warning Data
  const { checkRegistration, myWarnings, myStatus, isRegistered } = useParticipantStore();

  const contestId = initialContest.id;

  if (initialContest && !contest) { setContest(initialContest); }

  useEffect(() => { if (initialContest) setContest(initialContest); }, [initialContest, setContest]);

  useEffect(() => {
    if (contestId && authUser?.id) {
      fetchBundle({ contestId, userId: authUser.id });
      // ✅ Fetch latest warning count on load
      checkRegistration({ contestId, userId: authUser.id });
    }
  }, [contestId, authUser?.id, fetchBundle, checkRegistration]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join:contest", { contestId });

    const onUpdate = ({ contestId: changedId, newStatus }) => {
      if (changedId === contestId) fetchContestById(contestId);
    };

    socket.on("contestStatusUpdated", onUpdate);
    return () => socket.off("contestStatusUpdated", onUpdate);
  }, [contestId, fetchContestById]);

  const activeContest = contest || initialContest;
  const { phase, value } = useContestTimer(activeContest);
  const isContestRunning = phase === "running";
  const isAdmin = authUser?.role === "ADMIN";
  const problems = bundle?.problems || [];

  // ✅ INTELLIGENT ENTER BUTTON
  const renderEnterButton = () => {
    // 1. Participant Status (Highest Priority)
    if (myStatus === "FINISHED") {
      return (
        <div className="flex flex-col items-center gap-2">
          <button disabled className="btn btn-success btn-outline rounded-2xl px-12 h-14 text-lg font-black uppercase opacity-50 cursor-not-allowed gap-2">
            <Lock size={18} /> Finished
          </button>
          <p className="text-success text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            Sector Evaluation Complete
          </p>
        </div>
      );
    }

    if (myStatus === "DISQUALIFIED" || myWarnings > 3) {
      return (
        <div className="flex flex-col items-center gap-2">
          <button disabled className="btn btn-error btn-outline rounded-2xl px-12 h-14 text-lg font-black uppercase opacity-50 cursor-not-allowed gap-2">
            <Lock size={18} /> Disqualified
          </button>
          <p className="text-error text-[10px] font-black uppercase tracking-[0.2em] mt-2 animate-pulse">
            Access Revoked: Integrity Breach
          </p>
        </div>
      );
    }

    // 2. PHASE BASED LOGIC
    // 0. UPCOMING PHASE
    if (phase === "upcoming") {
      if (!isRegistered) {
        return (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-black opacity-40 uppercase tracking-[0.2em] mb-2">Registration is Open</p>
            <button
              onClick={() => {
                const regBtn = document.getElementById("register-contest-btn");
                if (regBtn) regBtn.click();
              }}
              className="btn btn-primary rounded-2xl px-12 h-14 text-lg font-black uppercase shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
            >
              Secure My Spot
            </button>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center gap-2">
          <div className="px-6 py-2 bg-success/10 text-success rounded-full text-xs font-bold uppercase tracking-widest border border-success/20 flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" /> Registered & Ready
          </div>
          <p className="text-xs font-black opacity-40 uppercase tracking-[0.2em] mt-6">Initiating Sequence In</p>
          <p className="text-5xl font-black font-mono text-primary tracking-tighter">{value}</p>
        </div>
      );
    }

    // 1. ENDED PHASE
    if (phase === "ended") {
      return (
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-black opacity-40 uppercase tracking-[0.2em]">Contest has Terminated</p>
          <Link href={`/Leaderboard/${contestId}`}>
            <button className="btn btn-outline border-base-content/20 rounded-2xl px-12 h-14 text-lg font-black uppercase hover:bg-base-content hover:text-base-100 transition-all">
              View Final Standings
            </button>
          </Link>
        </div>
      );
    }

    // 2. RUNNING PHASE (But not registered)
    if (!isRegistered) {
      return (
        <div className="flex flex-col items-center gap-4">
          <p className="text-error text-[10px] font-black uppercase tracking-widest animate-pulse">
            Battle is Live! Final Call for Entry
          </p>
          <button
            onClick={() => {
              const regBtn = document.getElementById("register-contest-btn");
              if (regBtn) regBtn.click();
            }}
            className="btn btn-primary rounded-2xl px-12 h-14 text-lg font-black uppercase shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
          >
            Register & Enter
          </button>
        </div>
      );
    }

    // 3. RUNNING PHASE (Resume logic)
    if (myWarnings > 0) {
      return (
        <div className="flex flex-col items-center gap-4">
          <Link href={`/Contest_ProblemPage/${contestId}`}>
            <button className="btn btn-primary rounded-2xl px-12 h-14 text-lg font-black uppercase shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
              Resume Arena
            </button>
          </Link>
          <div className="flex items-center gap-3 px-5 py-2 bg-error/10 border border-error/20 text-error rounded-full text-[10px] font-black uppercase tracking-widest">
            <AlertTriangle size={14} className="animate-pulse" />
            <span>Violations: {myWarnings} / 3</span>
          </div>
        </div>
      );
    }

    // Active & Ready
    return (
      <Link href={`/Contest_ProblemPage/${contestId}`}>
        <button className="btn btn-primary rounded-2xl px-12 h-14 text-lg font-black uppercase shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
          Enter Arena
        </button>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <ContestHeader contest={activeContest} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* ... Header Content ... */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--p),0.5)]" />
            <h2 className="text-3xl font-black tracking-tight uppercase">
              Contest <span className="opacity-30 not-italic">Overview</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <AdminAttachProblemsDialog contestId={activeContest.id} />
            )}
            <Link href={`/Leaderboard/${activeContest.id}`}>
              {/* ADDED: flex items-center gap-2 whitespace-nowrap */}
              <button className="btn btn-ghost border-base-content/10 bg-base-200/50 hover:bg-primary hover:text-white rounded-2xl px-6 flex items-center gap-2 whitespace-nowrap">
                <span>🏆</span>
                <span>Leaderboard</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="mb-20">
          {problems?.length > 0 ? (
            isAdmin ? (
              // Admin View ...
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {problems
                  .slice()
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((p) => {
                    const idx = p.order ?? 0;
                    const label = String.fromCharCode(65 + idx);
                    return (
                      <div
                        key={p.id || idx}
                        className="group bg-base-200 border border-base-content/10 rounded-2xl p-6 hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded">
                            Problem {label}
                          </span>
                          <span className="text-xs font-mono opacity-50">
                            {p.points ?? 0} PTS
                          </span>
                        </div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                          {p.snapshot?.title}
                        </h3>
                        <p className="text-xs opacity-40 mt-1 font-mono">
                          /{p.snapshot?.slug}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-base-200/50 to-transparent rounded-3xl border border-base-content/5 shadow-inner">
                {renderEnterButton()}
              </div>
            )
          ) : (
            <div className="text-center py-20 bg-base-200/20 rounded-3xl border border-dashed border-base-content/10 italic opacity-40">
              No problems available.
            </div>
          )}
        </div>
        {/* Rules & Prizes Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          <ContestRules />
          <div className="space-y-12">
            <ContestPrizes />
            <ContestAchievements />
          </div>
        </div>
      </div>
    </div>
  );
}