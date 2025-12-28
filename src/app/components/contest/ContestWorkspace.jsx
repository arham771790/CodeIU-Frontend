"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useBundleStore } from "@/app/store/useBundleStore";
import { useSubmissionStore } from "@/app/store/useSubmissionStore";
import { getSocket, joinContestRoom } from "@/app/lib/socket";

import Contest_Problem_CodeEditor from "../contest_Problem/Contest_Problem_CodeEditor";
import Contest_problem_Description from "../contest_Problem/Contest_problem_Description";
import Contest_Problem_TopNav from "../contest_Problem/Contest_Problem_TopNav";

export default function ContestWorkspace({ contest }) {
  const { authUser } = useAuthStore();
  const { bundle, fetchBundle, isLoading } = useBundleStore();
  const { intializeSocket, closeSocketConnection } = useSubmissionStore();

  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Fetch Bundle (Problems) on Mount
  useEffect(() => {
    if (contest?.id && authUser?.id) {
      fetchBundle({ contestId: contest.id, userId: authUser.id });
    }
  }, [contest?.id, authUser?.id, fetchBundle]);

  // 2. Initialize Socket (Persistent for the whole session)
  useEffect(() => {
    if (authUser?.id && contest?.id) {
      // Connect to Submission Service
      intializeSocket(authUser.id);
      // Join Contest Room for Notifications
      joinContestRoom(contest.id);
    }
    // Cleanup on unmount (leaving the page)
    return () => {
      closeSocketConnection();
    };
  }, [authUser?.id, contest?.id, intializeSocket, closeSocketConnection]);

  // Handle Loading State
  if (isLoading || !bundle) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-gray-400 font-mono animate-pulse">
        Loading Contest Environment...
      </div>
    );
  }

  const problems = bundle.problems || [];
  const activeProblem = problems[activeIndex];

  // Safety check if bundle is empty
  if (!activeProblem) return <div className="text-white p-10">No problems found in this contest.</div>;

  const snapshot = activeProblem.snapshot;

  return (
    <div className="bg-[#080808] flex flex-col h-screen font-sans text-white overflow-hidden">
      {/* 3. Navigation Bar */}
      <Contest_Problem_TopNav
        problems={problems}
        activeIndex={activeIndex}
        onProblemChange={setActiveIndex}
        contestId={contest.id}
        startsAt={contest.startsAt}
        endsAt={contest.endsAt}
      />

      {/* 4. Main Content (Description + Editor) */}
      <main className="flex-1 overflow-hidden p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Panel: Description */}
        <Contest_problem_Description
          title={snapshot.title}
          description={snapshot.description}
          testcases={snapshot.visibleTestcases || snapshot.testcases}
          constraints={snapshot.constraints}
        />

        {/* Right Panel: Editor */}
        <Contest_Problem_CodeEditor
          key={snapshot.id} // Forces reset when switching problems
          problemId={snapshot.id}
          description={snapshot.description}
          codeSnippets={snapshot.codeSnippets}
          testcases={snapshot.visibleTestcases || snapshot.testcases}
        />
      </main>
    </div>
  );
}