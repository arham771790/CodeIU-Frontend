"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { RefreshCw, Expand, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useSubmissionStore } from "@/app/store/useSubmissionStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import SubmissionResult from "../perProblem_comp/SubmissionResult";
import { useContestTimer } from "@/app/hooks/useContestTimer"; // Assuming this import is needed for useContestTimer

const Contest_Problem_CodeEditor = ({ codeSnippets, testcases, problemId, contestId, startsAt, endsAt }) => {
  const [activeTab, setActiveTab] = useState("testcase");
  const [topPanelHeight, setTopPanelHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const { label, value, phase } = useContestTimer({ startsAt, endsAt });
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  const { setUserCode, userCode, RunReslts, selectedLanguage, setSelectedLanguage, submissions, clearResults, fetchSubmissionsByProblem } = useSubmissionStore();

  const latestSubmission = useMemo(() => submissions?.find(sub => sub.problemId === problemId), [submissions, problemId]);
  const isSolved = latestSubmission?.status === "Accepted";

  useEffect(() => {
    if (codeSnippets) setUserCode(codeSnippets?.[selectedLanguage] || "");
    clearResults();
    if (problemId) {
      fetchSubmissionsByProblem(problemId, contestId);
    }
  }, [codeSnippets, selectedLanguage, clearResults, setUserCode, problemId, contestId, fetchSubmissionsByProblem]);

  useEffect(() => { if (latestSubmission?.status === "Pending") setActiveTab("submission"); }, [latestSubmission]);
  useEffect(() => { if (RunReslts?.length > 0) setActiveTab("testresult"); }, [RunReslts]);

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
        <div className="px-4 py-2 border-b border-base-content/5 flex items-center justify-between bg-base-300/30">
          <select className="bg-transparent text-xs font-bold uppercase tracking-widest text-primary focus:outline-none" value={selectedLanguage} onChange={(e) => { setSelectedLanguage(e.target.value); setUserCode(codeSnippets[e.target.value]); }}>
            {Object.keys(codeSnippets || {}).map(lang => <option key={lang} value={lang} className="bg-base-200">{lang}</option>)}
          </select>
          <div className="flex gap-1">
            <button onClick={() => setUserCode(codeSnippets[selectedLanguage])} className="p-2 hover:bg-base-content/10 rounded-xl opacity-40 transition-all hover:opacity-100"><RefreshCw size={14} /></button>
            <button className="p-2 hover:bg-base-content/10 rounded-xl opacity-40 transition-all hover:opacity-100"><Expand size={14} /></button>
          </div>
        </div>
        <div className="flex-1">
          <Editor height="100%" language={selectedLanguage.toLowerCase()} theme="vs-dark" value={userCode} onChange={(v) => setUserCode(v || "")} options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, padding: { top: 16 } }} />
        </div>
      </div>

      {/* Resizer */}
      <div className="h-1 w-full cursor-row-resize hover:bg-primary/20 transition-colors" onMouseDown={() => setIsDragging(true)} />

      {/* Results Panel */}
      <div className="bg-base-200 border border-base-content/10 rounded-[2rem] flex-grow flex flex-col overflow-hidden shadow-xl">
        <div className="flex px-6 border-b border-base-content/5 bg-base-300/30 gap-6">
          {["testcase", "testresult", "submission"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === tab ? "border-primary text-primary" : "border-transparent opacity-40"}`}>
              {tab === "submission" && isSolved ? <span className="flex items-center gap-1">Submission <CheckCircle2 size={12} /></span> : tab}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-auto custom-scrollbar flex-grow">
          {activeTab === "testcase" && (
            <div className="space-y-6">
              <div className="flex gap-2">
                {testcases?.map((_, i) => (
                  <button key={i} onClick={() => setSelectedCaseIndex(i)} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCaseIndex === i ? "bg-primary text-primary-content" : "bg-base-300 opacity-40"}`}>Case {i + 1}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Input</p><pre className="bg-base-300 p-4 rounded-2xl text-xs font-mono">{testcases?.[selectedCaseIndex]?.input}</pre></div>
                <div className="space-y-2"><p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Expected</p><pre className="bg-base-300 p-4 rounded-2xl text-xs font-mono">{testcases?.[selectedCaseIndex]?.output}</pre></div>
              </div>
            </div>
          )}

          {activeTab === "testresult" && (
            <div className="space-y-6">
              {!RunReslts?.length ? <div className="text-center py-10 text-xs font-bold opacity-20 italic">No execution data found. Run code to begin.</div> : (
                <>
                  <SubmissionResult runResults={RunReslts} />
                  <div className="flex gap-2 flex-wrap pt-4">
                    {RunReslts.map((r, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border ${r.passed ? "bg-success/5 border-success/20 text-success" : "bg-error/5 border-error/20 text-error"}`}>
                        {r.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Case {i + 1}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "submission" && (
            <div className="space-y-6">
              {!submissions || submissions.length === 0 ? <div className="text-center py-10 text-xs font-bold opacity-20 italic">Waiting for problem submission...</div> : (
                <div className="space-y-4">
                  {submissions.map((sub, index) => (
                    <div key={sub.id || index} className="bg-base-300/30 rounded-2xl border border-base-content/5 p-6 transition-all hover:bg-base-300/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h2 className={`text-xl font-black tracking-tighter uppercase ${sub.status === "Accepted" ? "text-success" : "text-error"}`}>
                            {sub.status}
                          </h2>
                          {sub.status === "Pending" && <Loader2 className="animate-spin text-primary" size={18} />}
                        </div>
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">
                          {new Date(sub.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sub.testcases?.map((tc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl border border-base-content/5">
                            <span className="text-[10px] font-black opacity-40 uppercase">Case {tc.testCase}</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${tc.passed ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                              {tc.passed ? "OK" : "FAIL"}
                            </span>
                          </div>
                        ))}
                      </div>
                      {(sub.compileOutput || sub.stderr) && (
                        <pre className="mt-4 p-3 bg-error/5 border border-error/10 text-error/80 text-[10px] font-mono rounded-xl whitespace-pre-wrap">
                          {sub.compileOutput || sub.stderr}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Contest_Problem_CodeEditor;