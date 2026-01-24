
"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useBundleStore } from "@/app/store/useBundleStore";
import { useSubmissionStore } from "@/app/store/useSubmissionStore";
import { joinContestRoom } from "@/app/lib/socket";
import { Loader2, AlertCircle } from "lucide-react";

import Contest_Problem_CodeEditor from "../contest_Problem/Contest_Problem_CodeEditor";
import Contest_problem_Description from "../contest_Problem/Contest_problem_Description";
import Contest_Problem_TopNav from "../contest_Problem/Contest_Problem_TopNav";

import AntiCheatStatus from "./AntiCheatStatus";
import ContestEndModal from "./ContestEndModal";
import { useAntiCheat } from "@/app/hooks/useAntiCheat";

export default function ContestWorkspace({ contest }) {
  const { authUser } = useAuthStore();
  const { bundle, fetchBundle, isLoading } = useBundleStore();
  const { intializeSocket, closeSocketConnection } = useSubmissionStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  // 1. Anti-cheat monitoring hook
  useAntiCheat({
    contestId: contest?.id,
    userId: authUser?.id,
    enabled: !!contest?.id && !!authUser?.id && !isEnded
  });

  useEffect(() => {
    if (contest?.id && authUser?.id) {
      fetchBundle({ contestId: contest.id, userId: authUser.id });
    }
  }, [contest?.id, authUser?.id, fetchBundle]);

  useEffect(() => {
    if (authUser?.id && contest?.id) {
      intializeSocket(authUser.id);
      joinContestRoom(contest.id);
    }
    return () => { closeSocketConnection(); };
  }, [authUser?.id, contest?.id, intializeSocket, closeSocketConnection]);

  // 2. Client-side end detection (fallback for socket)
  useEffect(() => {
    if (!contest?.endsAt) return;

    const checkEnd = () => {
      if (new Date() >= new Date(contest.endsAt)) {
        setIsEnded(true);
      }
    };

    const interval = setInterval(checkEnd, 5000);
    checkEnd();

    return () => clearInterval(interval);
  }, [contest?.endsAt]);

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
      <AntiCheatStatus userId={authUser?.id} />
      <ContestEndModal contestId={contest.id} show={isEnded} />

      <Contest_Problem_TopNav
        problems={problems}
        activeIndex={activeIndex}
        onProblemChange={setActiveIndex}
        contestId={contest.id}
        startsAt={contest.startsAt}
        endsAt={contest.endsAt}
      />

      <main className="flex-1 overflow-y-auto p-3 grid grid-cols-1 lg:grid-cols-2 gap-3 custom-scrollbar">
        {/* Left Panel: Description */}
        <Contest_problem_Description
          title={snapshot.title}
          description={snapshot.description}
          testcases={snapshot.visibleTestcases || snapshot.testcases}
          constraints={snapshot.constraints}
        />

        {/* Right Panel: Editor */}
        <Contest_Problem_CodeEditor
          key={snapshot.id}
          problemId={snapshot.id}
          description={snapshot.description}
          codeSnippets={snapshot.codeSnippets}
          testcases={snapshot.visibleTestcases || snapshot.testcases}
        />
      </main>
    </div>
  );
}
