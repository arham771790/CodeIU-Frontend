"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, List, Play, CloudDownload, Timer, Loader2 , SendHorizonal} from "lucide-react";
import { useSubmissionStore } from "@/app/store/useSubmissionStore";
import { useContestTimer } from "@/app/hooks/useContestTimer";
import { useRouter } from "next/navigation";

const Contest_Problem_TopNav = ({ problems = [], activeIndex = 0, onProblemChange, contestId, startsAt, endsAt }) => {
  const [isProblemListOpen, setIsProblemListOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { userCode, runCode, isexecuting, languageId, submitCode, isSubmittingCode } = useSubmissionStore();

  const currentProblem = problems?.[activeIndex];
  const visibleTestCase = currentProblem?.snapshot?.testcases;
  const { label, value, phase } = useContestTimer({ startsAt, endsAt });

  const navigate = useRouter();


  useEffect(() => {
    const onDocClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProblemListOpen(false); };
    if (isProblemListOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isProblemListOpen]);

  const handleRunCode = async (e) => {
    e.preventDefault();
    if (!currentProblem) return;
    const stdin = visibleTestCase?.map((t) => t.input) || [];
    const expected_output = visibleTestCase?.map((t) => t.output) || [];
    await runCode(userCode || "", stdin, languageId, expected_output);
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (!currentProblem) return;
    await submitCode(userCode || "", languageId, currentProblem?.snapshot?.id, contestId);
  };

  const handleFinish = () =>{
    navigate.push(`/Leaderboard/${contestId}`);
  }

  return (
    <nav className="bg-base-200 text-base-content px-6 py-3 flex items-center justify-between border-b border-base-content/10 backdrop-blur-md">
      {/* Brand + Navigation */}
      <div className="flex items-center gap-6">
        <div className="relative inline-block mr-4">
          <h1 className="text-2xl font-bold text-blue-400 ml-3">
              🌊ode<span className="font-bold text-base-content">IU</span>
            </h1>
         
        </div>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsProblemListOpen(!isProblemListOpen)} className="flex items-center gap-2 bg-base-300 hover:bg-base-content/10 px-4 py-1.5 rounded-xl transition-all text-xs font-bold uppercase tracking-widest border border-base-content/5">
            <List className="w-4 h-4 text-primary" /> Problem List
          </button>
          {isProblemListOpen && (
            <div className="absolute top-full left-0 mt-3 w-72 bg-base-200 border border-base-content/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
              <div className="p-4 space-y-1 max-h-80 overflow-auto">
                {problems.map((problem, index) => (
                  <button key={index} onClick={() => { onProblemChange?.(index); setIsProblemListOpen(false); }}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all ${index === activeIndex ? "bg-primary text-primary-content font-bold shadow-lg" : "hover:bg-base-content/5 opacity-60"}`}>
                    <span className="text-[10px] font-black opacity-50">{String.fromCharCode(65 + index)}</span>
                    <span className="text-sm truncate">{problem.snapshot?.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-1">
          <button disabled={activeIndex === 0} onClick={() => onProblemChange(activeIndex - 1)} className="p-2 hover:bg-base-content/10 rounded-xl disabled:opacity-20"><ChevronLeft size={18} /></button>
          <button disabled={activeIndex === problems.length - 1} onClick={() => onProblemChange(activeIndex + 1)} className="p-2 hover:bg-base-content/10 rounded-xl disabled:opacity-20"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Actions + Timer */}
      <div className="flex items-center gap-4">
        <button onClick={handleRunCode} disabled={isexecuting || isSubmittingCode} className="btn btn-ghost btn-sm bg-base-300 hover:bg-base-content/10 rounded-xl px-4 flex items-center gap-2">
          {isexecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={14} className="fill-current" />}
          <span className="text-[10px] font-black uppercase tracking-widest">Run</span>
        </button>

        <button onClick={handleSubmitCode} disabled={isexecuting || isSubmittingCode} className="btn btn-primary btn-sm rounded-xl px-5 flex items-center gap-2 shadow-lg shadow-primary/20">
          {isSubmittingCode ? <Loader2 size={16} className="animate-spin" /> : <CloudDownload size={14} />}
          <span className="text-[10px] font-black uppercase tracking-widest">Submit</span>
        </button>

        <button onClick={handleFinish} className="btn btn-primary btn-sm rounded-xl px-5 flex items-center gap-2 shadow-lg shadow-primary/20"> 
          <span className="text-[10px] font-black uppercase tracking-widest">Finish</span>
          <SendHorizonal size={14} />
        </button>

        <div className={`flex items-center gap-3 px-4 py-1 rounded-xl border border-base-content/10 ${phase === "running" ? "bg-success/5 text-success border-success/20" : "bg-base-300"}`}>
           <Timer size={16} className={phase === "running" ? "animate-pulse" : ""} />
           <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase opacity-60 leading-none">{label}</span>
              <span className="text-sm font-mono font-bold leading-none">{value}</span>
           </div>
        </div>
      </div>
    </nav>
  );
};
export default Contest_Problem_TopNav;