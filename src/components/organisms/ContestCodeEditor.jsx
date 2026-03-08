"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2 } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-base-300/50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Loading Editor</span>
      </div>
    </div>
  ),
});
import { useSubmissionStore } from "@/store/useSubmissionStore";
import PreviousSubmissions from "@/components/molecules/PreviousSubmissions";
import ContestEditorHeader from "@/components/molecules/ContestEditorHeader";
import TestCaseTab from "@/components/molecules/TestCaseTab";
import TestResultTab from "@/components/molecules/TestResultTab";
import SubmissionTab from "@/components/molecules/SubmissionTab";

const Contest_Problem_CodeEditor = ({ codeSnippets, testcases, problemId }) => {
  const [activeTab, setActiveTab] = useState("testcase");
  const [topPanelHeight, setTopPanelHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  //  State to track if the current pending submission has timed out
  const [isTimedOut, setIsTimedOut] = useState(false);

  const { setUserCode, getCodeForProblem, RunReslts, selectedLanguage, setSelectedLanguage, submissions, clearResults, isexecuting, isSubmittingCode } = useSubmissionStore();

  const latestSubmission = useMemo(() => submissions?.find(sub => sub.problemId === problemId), [submissions, problemId]);
  const isSolved = latestSubmission?.status === "Accepted";

  useEffect(() => {
    const savedCode = getCodeForProblem(problemId, selectedLanguage);
    if (!savedCode && codeSnippets) {
      setUserCode(codeSnippets[selectedLanguage] || "", problemId, selectedLanguage);
    }
  }, [problemId, getCodeForProblem, codeSnippets, selectedLanguage, setUserCode]);

  useEffect(() => { if (latestSubmission?.status === "Pending") setActiveTab("submission"); }, [latestSubmission]);
  useEffect(() => { if (RunReslts?.length > 0) setActiveTab("testresult"); }, [RunReslts]);

  // NEW: Effect to handle the 25-second timeout for pending submissions
  useEffect(() => {
    let timeoutId;

    if (latestSubmission?.status === "Pending") {
      // Reset timeout state when a new pending submission starts
      setIsTimedOut(false);

      // Start the 25-second timer
      timeoutId = setTimeout(() => {
        setIsTimedOut(true);
      }, 25000);
    } else {
      // If it is no longer pending (e.g., Accepted or Rejected), ensure timeout is cleared
      setIsTimedOut(false);
    }

    // Cleanup function to clear the timer if the component unmounts or status changes early
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [latestSubmission?.status, latestSubmission?.id]); // Re-run if status or submission ID changes

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let val = ((e.clientY - rect.top) / rect.height) * 100;
    setTopPanelHeight(Math.max(20, Math.min(85, val)));
  };

  useEffect(() => {
    const up = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", up);
    }
    return () => { document.removeEventListener("mousemove", handleMouseMove); document.removeEventListener("mouseup", up); };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="flex flex-col h-full gap-3">
      {/* Editor Panel */}
      <div className="bg-base-200 border border-base-content/10 rounded-[2rem] flex flex-col overflow-hidden shadow-xl" style={{ height: `${topPanelHeight}%` }}>
        <ContestEditorHeader
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          codeSnippets={codeSnippets}
          setUserCode={setUserCode}
          problemId={problemId}
        />
        <div className="flex-1">
          <Editor height="100%" language={selectedLanguage.toLowerCase()} theme="vs-dark" value={getCodeForProblem(problemId, selectedLanguage)} onChange={(v) => setUserCode(v || "", problemId, selectedLanguage)} options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, padding: { top: 16 } }} />
        </div>
      </div>

      {/* Resizer */}
      <div className="h-1 w-full cursor-row-resize hover:bg-primary/20 transition-colors" onMouseDown={() => setIsDragging(true)} />

      {/* Results Panel */}
      <div className="bg-base-200 border border-base-content/10 rounded-[2rem] flex-grow flex flex-col overflow-hidden shadow-xl">
        <div className="flex px-6 border-b border-base-content/5 bg-base-300/30 gap-6">
          {["testcase", "testresult", "submission", "history"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === tab ? "border-primary text-primary" : "border-transparent opacity-40"}`}>
              {tab === "submission" && isSolved ? <span className="flex items-center gap-1">Submission <CheckCircle2 size={12} /></span> : tab}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-auto custom-scrollbar flex-grow">
          {activeTab === "testcase" && (
            <TestCaseTab
              testcases={testcases}
              selectedCaseIndex={selectedCaseIndex}
              setSelectedCaseIndex={setSelectedCaseIndex}
              variant="contest"
            />
          )}

          {activeTab === "testresult" && (
            <TestResultTab
              RunReslts={RunReslts}
              isexecuting={isexecuting}
              selectedResultIndex={selectedResultIndex}
              setSelectedResultIndex={setSelectedResultIndex}
              variant="contest"
            />
          )}

          {activeTab === "submission" && (
            <SubmissionTab
              latestSubmission={latestSubmission}
              isSubmittingCode={isSubmittingCode}
              isTimedOut={isTimedOut}
              variant="contest"
            />
          )}

          {activeTab === "history" && (
            <PreviousSubmissions problemId={problemId} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Contest_Problem_CodeEditor;