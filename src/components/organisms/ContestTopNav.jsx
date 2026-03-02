"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, List, Play, CloudDownload, Timer, Loader2, CheckCircle2 } from "lucide-react"; // ✅ Imported CheckCircle2
import { useSubmissionStore } from "@/store/useSubmissionStore";
import { useProblemStore } from "@/store/useProblemStore"; // ✅ Import Problem Store
import { useParticipantStore } from "@/store/useParticipantStore"; // ✅ Import Participant Store
import { useContestTimer } from "@/hooks/useContestTimer";
import { useAuthStore } from "@/store/useAuthStore";

const Contest_Problem_TopNav = ({ problems = [], activeIndex = 0, onProblemChange, contestId, startsAt, endsAt }) => {
  const [isProblemListOpen, setIsProblemListOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Updated store hooks
  const {
    getCodeForProblem,
    runCode,
    isexecuting,
    languageId,
    submitCode,
    isSubmittingCode,
    submissions,
    operationCooldowns,
    selectedLanguage
  } = useSubmissionStore();

  // ✅ Get the solved IDs from the database
  const { solvedProblemsIds } = useProblemStore();
  const { finishContest } = useParticipantStore();
  const { authUser } = useAuthStore();

  const currentProblem = problems?.[activeIndex];
  const problemId = currentProblem?.snapshot?.id;
  const visibleTestCase = currentProblem?.snapshot?.testcases;
  const { label, value, phase } = useContestTimer({ startsAt, endsAt });

  // Reactive tick to unlock buttons when cooldown expires
  const [, setTick] = useState(0);
  useEffect(() => {
    const hasCooldown = operationCooldowns.run > Date.now() || operationCooldowns.submit > Date.now();
    if (!hasCooldown) return;
    const interval = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(interval);
  }, [operationCooldowns]);

  // Deriving Lock State (now re-evaluated live every 500ms during cooldown)
  const now = Date.now();
  const isRunLocked = operationCooldowns.run > now || isexecuting;
  const isSubmitLocked = operationCooldowns.submit > now || isSubmittingCode;

  useEffect(() => {
    const onDocClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProblemListOpen(false); };
    if (isProblemListOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isProblemListOpen]);

  const handleRunCode = async (e) => {
    e.preventDefault();
    if (isRunLocked || !currentProblem) return;

    const code = getCodeForProblem(problemId, selectedLanguage);
    const stdin = visibleTestCase?.map((t) => t.input) || [];
    const expected_output = visibleTestCase?.map((t) => t.output) || [];

    await runCode(code, stdin, languageId, expected_output);
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (isSubmitLocked || !currentProblem) return;

    const code = getCodeForProblem(problemId, selectedLanguage);
    await submitCode(code, languageId, problemId, contestId);
  };

  const handleFinishContest = async () => {
    if (confirm("Are you sure you want to finish the contest? You will not be able to return.")) {
      await finishContest({ contestId, userId: authUser?.id });
    }
  };

  return (
    <nav className="bg-base-200 text-base-content px-3 sm:px-6 py-3 flex items-center justify-between border-b border-base-content/10 backdrop-blur-md gap-2">
      {/* Brand + Navigation */}
      <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
        {/* Logo — hidden on very small screens */}
        <div className="relative hidden sm:inline-block mr-1 sm:mr-4">
          <h1 className="text-2xl font-bold text-blue-400 ml-3">
            🌊ode<span className="font-bold text-base-content">IU</span>
          </h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsProblemListOpen(!isProblemListOpen)} className="flex items-center gap-1 sm:gap-2 bg-base-300 hover:bg-base-content/10 px-2 sm:px-4 py-1.5 rounded-xl transition-all text-xs font-bold uppercase tracking-widest border border-base-content/5">
            <List className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="hidden sm:inline">Problem List</span>
          </button>
          {isProblemListOpen && (
            <div className="absolute top-full left-0 mt-3 w-72 bg-base-200 border border-base-content/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
              <div className="p-4 space-y-1 max-h-80 overflow-auto custom-scrollbar">
                {problems.map((problem, index) => {
                  const probId = problem.snapshot?.id;
                  const isPreviouslySolved = solvedProblemsIds?.includes(probId);
                  const isLiveSolved = submissions?.some(sub => sub.problemId === probId && sub.status === "Accepted");
                  const isSolved = isPreviouslySolved || isLiveSolved;

                  return (
                    <button key={index} onClick={() => { onProblemChange?.(index); setIsProblemListOpen(false); }}
                      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all ${index === activeIndex ? "bg-primary text-primary-content font-bold shadow-lg" : "hover:bg-base-content/5 opacity-80"}`}>
                      <span className="text-[10px] font-black opacity-50">{String.fromCharCode(65 + index)}</span>
                      <span className="text-sm truncate flex-1">{problem.snapshot?.title}</span>
                      {isSolved && <CheckCircle2 size={16} className={index === activeIndex ? "text-primary-content" : "text-success"} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-1">
          <button disabled={activeIndex === 0} onClick={() => onProblemChange(activeIndex - 1)} className="p-1.5 sm:p-2 hover:bg-base-content/10 rounded-xl disabled:opacity-20"><ChevronLeft size={18} /></button>
          <button disabled={activeIndex === problems.length - 1} onClick={() => onProblemChange(activeIndex + 1)} className="p-1.5 sm:p-2 hover:bg-base-content/10 rounded-xl disabled:opacity-20"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Actions + Timer */}
      <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
        <button onClick={handleRunCode} disabled={isRunLocked} className={`btn btn-sm bg-base-300 hover:bg-base-content/10 rounded-xl px-2 sm:px-4 flex items-center gap-1 sm:gap-2 ${isRunLocked ? 'opacity-50 grayscale' : ''}`}>
          {isexecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={14} className="fill-current" />}
          <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Run</span>
        </button>

        <button onClick={handleSubmitCode} disabled={isSubmitLocked} className={`btn btn-primary btn-sm rounded-xl px-2 sm:px-5 flex items-center gap-1 sm:gap-2 shadow-lg shadow-primary/20 ${isSubmitLocked ? 'opacity-50 grayscale' : ''}`}>
          {isSubmittingCode ? <Loader2 size={16} className="animate-spin" /> : <CloudDownload size={14} />}
          <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Submit</span>
        </button>

        {/* Timer — icon only on mobile */}
        <div className={`hidden xs:flex items-center gap-1 sm:gap-3 px-2 sm:px-4 py-1 rounded-xl border border-base-content/10 ${phase === "running" ? "bg-success/5 text-success border-success/20" : "bg-base-300"}`}>
          <Timer size={16} className={phase === "running" ? "animate-pulse" : ""} />
          <div className="hidden sm:flex flex-col">
            <span className="text-[8px] font-black uppercase opacity-60 leading-none">{label}</span>
            <span className="text-sm font-mono font-bold leading-none">{value}</span>
          </div>
          <span className="sm:hidden text-xs font-mono font-bold">{value}</span>
        </div>

        <button onClick={handleFinishContest} className="btn btn-error btn-sm btn-outline rounded-xl px-2 sm:px-4 flex items-center gap-1 sm:gap-2 border-error/30 hover:bg-error hover:text-white hover:border-error">
          <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest leading-none">Finish</span>
          <span className="sm:hidden text-[10px] font-black">✕</span>
        </button>
      </div>
    </nav>
  );
};
export default Contest_Problem_TopNav;