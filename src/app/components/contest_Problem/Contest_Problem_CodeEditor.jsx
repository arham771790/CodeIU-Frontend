"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { RefreshCw, Expand, Loader2, CheckCircle2 } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useSubmissionStore } from "@/app/store/useSubmissionStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import SubmissionResult from "../perProblem_comp/SubmissionResult"; // Reusing your existing result component

const Contest_Problem_CodeEditor = ({ codeSnippets, testcases, problemId }) => {
  const [activeTab, setActiveTab] = useState("testcase");
  const [topPanelHeight, setTopPanelHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  const {
    setUserCode,
    userCode,
    RunReslts,
    selectedLanguage,
    setSelectedLanguage,
    submissions,
    clearResults, // Use this to clear run results when switching
  } = useSubmissionStore();

  const { authUser } = useAuthStore();

  // Find latest submission for THIS problem
  const latestSubmission = useMemo(() => {
    if (!submissions || submissions.length === 0) return null;
    return submissions.find((sub) => sub.problemId === problemId);
  }, [submissions, problemId]);

  const isSolved = latestSubmission?.status === "Accepted";

  // Initialize Code & Test Cases when problemId changes
  useEffect(() => {
    if (codeSnippets) {
      setUserCode(codeSnippets?.[selectedLanguage] || "");
    }
    clearResults(); // Clear previous "Run Code" results
  }, [codeSnippets, selectedLanguage, clearResults, setUserCode]);

  // Auto-switch to submission tab if pending
  useEffect(() => {
    if (latestSubmission && latestSubmission.status === "Pending") {
      setActiveTab("submission");
    }
  }, [latestSubmission]);

  // Auto-switch to test results if run results arrive
  useEffect(() => {
    if (RunReslts && RunReslts.length > 0) {
      setActiveTab("testresult");
    }
  }, [RunReslts]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setUserCode(codeSnippets?.[lang] || "");
  };

  const handleRefreshCode = () => {
    setUserCode(codeSnippets?.[selectedLanguage] || "");
  };

  // --- Resizing Logic (Standard) ---
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    let newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;
    if (newHeight < 20) newHeight = 20;
    if (newHeight > 85) newHeight = 85;
    setTopPanelHeight(newHeight);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // --- Anti-Cheating Listeners ---
  useEffect(() => {
    const preventCheating = (e) => {
        // e.preventDefault(); // Uncomment for production
    };
    // Add your listeners here if needed
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      {/* Top Panel: Editor */}
      <div className="bg-[#0e0e0e] rounded-lg flex flex-col overflow-hidden" style={{ height: `${topPanelHeight}%` }}>
        <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center">
            <select
              className="bg-[#0e0e0e] text-white text-sm font-semibold rounded-lg focus:outline-none"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {Object.keys(codeSnippets || {}).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="hover:bg-zinc-800 p-1.5 rounded" onClick={handleRefreshCode} title="Reset Code">
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
            <button className="hover:bg-zinc-800 p-1.5 rounded">
              <Expand className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={selectedLanguage.toLowerCase()}
            theme="vs-dark"
            value={userCode}
            onChange={(value) => setUserCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              lineNumbers: "on",
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* Resizer */}
      <div className="w-full h-2 flex-shrink-0 cursor-row-resize" onMouseDown={handleMouseDown}></div>

      {/* Bottom Panel: Tabs */}
      <div className="bg-[#0e0e0e] rounded-lg flex-grow flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex items-center space-x-2 px-4 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("testcase")}
            className={`py-2 text-sm font-semibold border-b-2 hover:cursor-pointer ${
              activeTab === "testcase" ? "border-white text-white" : "border-transparent text-gray-400"
            }`}
          >
            Testcase
          </button>
          <button
            onClick={() => setActiveTab("testresult")}
            className={`py-2 ml-3 text-sm font-semibold border-b-2 hover:cursor-pointer ${
              activeTab === "testresult" ? "border-white text-white" : "border-transparent text-gray-400"
            }`}
          >
            Test Result
          </button>
          <button
            onClick={() => setActiveTab("submission")}
            className={`py-2 ml-3 text-sm font-semibold border-b-2 hover:cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "submission" ? "border-white text-white" : "border-transparent text-gray-400"
            }`}
          >
            <span>Submission</span>
            {isSolved && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </button>
        </div>

        <div className="flex-grow overflow-auto">
          {/* --- Tab Content: Test Case --- */}
          {activeTab === "testcase" && (
            <div className="p-2">
              <div className="flex items-center space-x-3 mb-2">
                {testcases?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCaseIndex(index)}
                    className={`text-sm font-semibold px-3 py-1 rounded-md transition-colors ${
                      selectedCaseIndex === index ? "bg-zinc-700 text-white" : "bg-[#272727] text-gray-400"
                    }`}
                  >
                    Case {index + 1}
                  </button>
                ))}
              </div>
              {testcases && testcases[selectedCaseIndex] && (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold mb-1">Input:</p>
                    <pre className="text-sm text-gray-300 bg-[#1a1a1a] p-3 rounded">{testcases[selectedCaseIndex].input}</pre>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Output:</p>
                    <pre className="text-sm text-gray-300 bg-[#1a1a1a] p-3 rounded">{testcases[selectedCaseIndex].output}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- Tab Content: Test Result --- */}
          {activeTab === "testresult" && (
            <div className="p-4 flex-grow font-semibold items-center text-gray-500">
              {!RunReslts || RunReslts.length === 0 ? (
                <div>Run your code to see results.</div>
              ) : (
                <div>
                  <SubmissionResult runResults={RunReslts} />
                  <div className="flex items-center space-x-3 mb-2 mt-4">
                    {RunReslts.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedResultIndex(index)}
                        className={`flex items-center space-x-2 text-sm font-semibold px-3 py-1 rounded-md transition-colors ${
                          selectedResultIndex === index ? "bg-zinc-700 text-white" : "bg-[#1a1a1a] text-gray-400"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${result.passed ? "bg-green-500" : "bg-red-500"}`}></span>
                        <span>Case {index + 1}</span>
                      </button>
                    ))}
                  </div>
                  {/* Result Details (Same as your old code) */}
                  {RunReslts[selectedResultIndex] && (
                    <div className="space-y-2">
                      <div><p className="text-sm font-semibold text-gray-400 mb-1 mt-2">Input</p><pre className="text-sm text-gray-200 bg-[#141414] p-3 rounded-md">{RunReslts[selectedResultIndex].Input}</pre></div>
                      <div><p className="text-sm font-semibold text-gray-400 mb-1">Output</p><pre className="text-sm text-gray-200 bg-[#141414] p-3 rounded-md">{RunReslts[selectedResultIndex].stdout}</pre></div>
                      <div><p className="text-sm font-semibold text-gray-400 mb-1">Expected</p><pre className="text-sm text-gray-200 bg-[#141414] p-3 rounded-md">{RunReslts[selectedResultIndex].expected}</pre></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* --- Tab Content: Submission --- */}
          {activeTab === "submission" && (
            <div className="p-4">
              {!latestSubmission ? (
                <div className="text-gray-500 font-semibold">Submit your code to see results.</div>
              ) : (
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${latestSubmission.status === "Accepted" ? "text-green-500" : latestSubmission.status === "Pending" ? "text-yellow-500" : "text-red-500"}`}>
                    {latestSubmission.status}
                    {latestSubmission.status === "Pending" && <Loader2 className="inline-block ml-2 h-6 w-6 animate-spin" />}
                  </h2>
                  {latestSubmission.testcases && latestSubmission.testcases.length > 0 && (
                    <div className="space-y-4">
                      <p className="font-semibold text-gray-300">Test Cases:</p>
                      <div className="grid gap-2">
                        {latestSubmission.testcases.map((tc, index) => (
                          <div key={index} className="bg-[#1a1a1a] p-3 rounded-md flex justify-between items-center">
                            <span className="font-semibold text-white">Case {tc.testCase}</span>
                            <span className={`font-bold text-sm px-2 py-1 rounded-full ${tc.passed ? "bg-green-800 text-green-300" : "bg-red-800 text-red-300"}`}>{tc.passed ? "Passed" : "Failed"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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