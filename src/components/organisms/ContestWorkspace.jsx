"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useBundleStore } from "@/store/useBundleStore";
import { useSubmissionStore } from "@/store/useSubmissionStore";
import { useProblemStore } from "@/store/useProblemStore";
import { useParticipantStore } from "@/store/useParticipantStore";
import { joinContestRoom } from "@/lib/socket";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import { useContestTimer } from "@/hooks/useContestTimer";
import { toast } from "react-toastify";
import { Loader2, AlertCircle } from "lucide-react";

import Contest_Problem_CodeEditor from "@/components/organisms/ContestCodeEditor";
import Contest_problem_Description from "@/components/organisms/ContestProblemDescription";
import Contest_Problem_TopNav from "@/components/organisms/ContestTopNav";

export default function ContestWorkspace({ contest }) {
  const { authUser } = useAuthStore();
  const { bundle, fetchBundle, isLoading } = useBundleStore();
  const { intializeSocket, closeSocketConnection } = useSubmissionStore();

  // ✅ Extract fetch function for solved problems
  const { fetchUserSolvedProblems } = useProblemStore();
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Fetch Bundle, Solved Problems & Check Registration Status
  const { myStatus, myWarnings, checkRegistration } = useParticipantStore();

  useEffect(() => {
    if (contest?.id && authUser?.id) {
      fetchBundle({ contestId: contest.id, userId: authUser.id });
      fetchUserSolvedProblems(); // ✅ Fetch solved data from DB (survives refresh)
      checkRegistration({ contestId: contest.id, userId: authUser.id }); // ✅ Re-fetch warnings and status
    }
  }, [contest?.id, authUser?.id, fetchBundle, fetchUserSolvedProblems, checkRegistration]);

  // 2. Initialize Submission Socket & Join Public Contest Room
  useEffect(() => {
    if (authUser?.id && contest?.id) {
      intializeSocket(authUser.id);
      joinContestRoom(contest.id);
    }
    return () => { closeSocketConnection(); };
  }, [authUser?.id, contest?.id, intializeSocket, closeSocketConnection]);

  // 3. ACTIVATE ANTI-CHEAT (Arena Mode)
  useAntiCheat(contest?.id, authUser?.id, { isArena: true });

  // 4. CHECK END OR DISQUALIFICATION
  const { phase } = useContestTimer(contest);
  const isLockedOut = myStatus === "DISQUALIFIED" || myWarnings > 3 || myStatus === "FINISHED";
  const isEnded = phase === "ended";

  useEffect(() => {
    if (isEnded || isLockedOut) {
      if (isEnded) toast.info("Contest has ended!", { id: "contest-ended" });
      else if (myStatus === "FINISHED") toast.info("You already finished this contest.", { id: "contest-finished" });
      else toast.error("You have been disqualified.", { id: "contest-dq" });

      const timer = setTimeout(() => {
        window.location.href = `/leaderboard/${contest?.id}`;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, myStatus, myWarnings, contest?.id, isEnded, isLockedOut]);

  if (isLockedOut) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mb-6 animate-pulse">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Arena Access Revoked</h1>
        <p className="text-error font-bold uppercase tracking-widest text-xs opacity-70">
          {myStatus === "DISQUALIFIED" ? "Integrity Breach Detected: User Disqualified" : "Session Concluded"}
        </p>
        <p className="mt-8 text-xs opacity-40 italic">Redirecting to standings...</p>
      </div>
    );
  }

  if (isLoading || !bundle) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 animate-pulse">
          Syncing Arena Environment...
        </p>
      </div>
    );
  }

  const problems = bundle.problems || [];
  const activeProblem = problems[activeIndex];

  if (!activeProblem) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="flex items-center gap-3 bg-error/10 border border-error/20 p-6 rounded-3xl text-error">
          <AlertCircle size={24} />
          <span className="font-bold uppercase tracking-tight">No problems assigned to this sector.</span>
        </div>
      </div>
    );
  }

  const snapshot = activeProblem.snapshot;

  return (
    <div className="bg-base-100 flex flex-col h-screen font-sans text-base-content overflow-hidden">
      <Contest_Problem_TopNav
        problems={problems}
        activeIndex={activeIndex}
        onProblemChange={setActiveIndex}
        contestId={contest.id}
        startsAt={contest.startsAt}
        endsAt={contest.endsAt}
      />

      <main className="flex-1 overflow-y-auto p-3 grid grid-cols-1 lg:grid-cols-2 gap-3 custom-scrollbar">
        <Contest_problem_Description
          title={snapshot?.title}
          description={snapshot?.description}
          examples={snapshot?.examples}
          testcases={snapshot?.visibleTestcases || snapshot?.testcases}
          constraints={snapshot?.constraints}
        />
        <Contest_Problem_CodeEditor
          key={snapshot.id}
          problemId={snapshot?.id}
          description={snapshot?.description}
          codeSnippets={snapshot?.codeSnippets}
          testcases={snapshot?.visibleTestcases || snapshot?.testcases}
        />
      </main>
    </div>
  );
}