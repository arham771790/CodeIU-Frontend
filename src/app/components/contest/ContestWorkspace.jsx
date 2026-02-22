"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useBundleStore } from "@/app/store/useBundleStore";
import { useSubmissionStore } from "@/app/store/useSubmissionStore";
import { useProblemStore } from "@/app/store/useProblemStore";
import { joinContestRoom } from "@/app/lib/socket"; 
import { useAntiCheat } from "@/app/hooks/useAntiCheat"; 
import { Loader2, AlertCircle } from "lucide-react";

import Contest_Problem_CodeEditor from "../contest_Problem/Contest_Problem_CodeEditor";
import Contest_problem_Description from "../contest_Problem/Contest_problem_Description";
import Contest_Problem_TopNav from "../contest_Problem/Contest_Problem_TopNav";

export default function ContestWorkspace({ contest }) {
  const { authUser } = useAuthStore();
  const { bundle, fetchBundle, isLoading } = useBundleStore();
  const { intializeSocket, closeSocketConnection } = useSubmissionStore();
  
  // ✅ Extract fetch function for solved problems
  const { fetchUserSolvedProblems } = useProblemStore(); 
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Fetch Bundle & Solved Problems
  useEffect(() => {
    if (contest?.id && authUser?.id) {
      fetchBundle({ contestId: contest.id, userId: authUser.id });
      fetchUserSolvedProblems(); // ✅ Fetch solved data from DB (survives refresh)
    }
  }, [contest?.id, authUser?.id, fetchBundle, fetchUserSolvedProblems]);

  // 2. Initialize Submission Socket & Join Public Contest Room
  useEffect(() => {
    if (authUser?.id && contest?.id) {
      intializeSocket(authUser.id); 
      joinContestRoom(contest.id);  
    }
    return () => { closeSocketConnection(); };
  }, [authUser?.id, contest?.id, intializeSocket, closeSocketConnection]);

  // 3. ACTIVATE ANTI-CHEAT
  useAntiCheat(contest?.id, authUser?.id);


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