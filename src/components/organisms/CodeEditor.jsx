"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  RefreshCw,
  Expand,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useSubmissionStore } from "@/store/useSubmissionStore";
import { useAuthStore } from "@/store/useAuthStore";
import SubmissionResult from "@/components/molecules/SubmissionResult";

const CodeEditor = ({ problemId, codeSnippets, testcases }) => {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("testcase");
  const [topPanelHeight, setTopPanelHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  const {
    problemCodes,
    getCodeForProblem,
    setUserCode,
    RunReslts,
    selectedLanguage,
    setSelectedLanguage,
    intializeSocket,
    resetProblemState,
    submissions,
    operationCooldowns,
    isSubmittingCode,
    isexecuting,
    runCode,
    submitCode,
    clearResults,
    isCustomInputEnabled,
    setIsCustomInputEnabled,
    customInput,
    setCustomInput,
    theme: userTheme,
    setTheme,
  } = useSubmissionStore();

  const { authUser } = useAuthStore();
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  // Deriving Lock State
  const now = Date.now();
  const isRunLocked = operationCooldowns.run > now || isexecuting;
  const isSubmitLocked = operationCooldowns.submit > now || isSubmittingCode;

  // Initialize Socket Connection
  useEffect(() => {
    if (authUser?.id) intializeSocket(authUser.id);
  }, [authUser, intializeSocket]);

  // Reset result state when changing problem
  useEffect(() => {
    resetProblemState();
  }, [problemId, resetProblemState]);

  // Handle Code Initialization (Snippet loading)
  useEffect(() => {
    // 1. Try to get saved code for this problem AND language
    const savedCode = getCodeForProblem(problemId, selectedLanguage);

    // 2. If no saved code, use the snippet for the current language
    if (!savedCode && codeSnippets) {
      setUserCode(codeSnippets[selectedLanguage] || "", problemId, selectedLanguage);
    }
  }, [problemId, getCodeForProblem, codeSnippets, selectedLanguage, setUserCode]);

  // Auto-switch tabs based on state
  useEffect(() => {
    if (submissions?.length > 0) setActiveTab("submission");
  }, [submissions]);

  useEffect(() => {
    if (RunReslts?.length > 0) setActiveTab("testresult");
  }, [RunReslts]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  // Resizing Logic
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
    if (newHeight > 20 && newHeight < 85) setTopPanelHeight(newHeight);
  };

  useEffect(() => {
    const up = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", up);
    };
  }, [isDragging]);

  const handleRun = () => {
    const code = getCodeForProblem(problemId, selectedLanguage);
    const stdin = testcases[selectedCaseIndex]?.input || "";
    const expected = testcases[selectedCaseIndex]?.output || "";
    runCode(code, stdin, useSubmissionStore.getState().languageId, expected);
  };

  const handleSubmit = () => {
    const code = getCodeForProblem(problemId, selectedLanguage);
    submitCode(code, useSubmissionStore.getState().languageId, problemId);
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full gap-2">
      {/* Top Panel: Monaco Editor */}
      <div
        className="bg-base-200 rounded-xl flex flex-col overflow-hidden border border-base-content/10 min-h-[280px]"
        style={{ height: `${topPanelHeight}%` }}
      >
        <div className="bg-base-300/50 px-2 sm:px-4 py-2 flex items-center justify-between border-b border-base-content/10 gap-2">
          {/* Left: Language selector + format */}
          <div className="flex gap-2 sm:gap-4 items-center flex-shrink-0">
            <select
              className="select select-ghost select-xs font-bold text-primary flex-shrink-0"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {Object.keys(codeSnippets || {}).map((lang) => (
                <option
                  key={lang}
                  value={lang}
                  className="bg-base-200 text-base-content"
                >
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            <button
              onClick={formatCode}
              className="btn btn-ghost btn-xs gap-1 hover:text-primary transition-colors flex-shrink-0"
            >
              <RefreshCw size={12} />
              <span className="hidden sm:inline">Format</span>
            </button>
            <div className="divider divider-horizontal mx-0 h-4 self-center opacity-10"></div>
            <select
              className="select select-ghost select-xs font-bold opacity-50 hover:opacity-100 flex-shrink-0"
              value={userTheme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>

          {/* Right: Expand */}
          <div className="flex gap-2 sm:gap-4 text-base-content/50 flex-shrink-0">
            <Expand
              size={16}
              className="cursor-pointer hover:text-primary transition-colors mt-1 hidden sm:block"
            />
          </div>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language={selectedLanguage.toLowerCase()}
            theme={userTheme || (['dark', 'black', 'abyss', 'forest'].includes(resolvedTheme) ? 'vs-dark' : 'light')}
            value={getCodeForProblem(problemId, selectedLanguage)}
            onMount={handleEditorDidMount}
            onChange={(v) => setUserCode(v || "", problemId, selectedLanguage)}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 10 },
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="h-1.5 w-full cursor-row-resize hover:bg-primary/20 transition-colors"
        onMouseDown={() => setIsDragging(true)}
      ></div>

      {/* Bottom Panel: Testcases / Results / Submissions */}
      <div className="bg-base-200 rounded-xl flex-grow flex flex-col overflow-hidden border border-base-content/10">
        <div className="tabs tabs-bordered bg-base-300/30 px-2">
          {["testcase", "custom", "testresult", "submission"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab tab-sm h-10 transition-all ${activeTab === tab
                ? "tab-active font-bold border-primary text-primary"
                : "opacity-50"
                }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-auto flex-1">
          {/* Tab 1: Testcases */}
          {activeTab === "testcase" && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {testcases?.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCaseIndex(i)}
                    className={`btn btn-xs ${selectedCaseIndex === i
                      ? "btn-primary"
                      : "btn-ghost bg-base-300"
                      }`}
                  >
                    Case {i + 1}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold opacity-50 mb-1 uppercase tracking-wider">
                    Input
                  </p>
                  <pre className="bg-base-300 p-3 rounded-lg text-sm font-mono border border-base-content/5">
                    {testcases[selectedCaseIndex]?.input}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-bold opacity-50 mb-1 uppercase tracking-wider">
                    Expected Output
                  </p>
                  <pre className="bg-base-300 p-3 rounded-lg text-sm font-mono border border-base-content/5">
                    {testcases[selectedCaseIndex]?.output}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === "custom" && (
            <div className="p-6 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary toggle-sm"
                    checked={isCustomInputEnabled}
                    onChange={(e) => setIsCustomInputEnabled(e.target.checked)}
                  />
                  <span className="text-xs font-bold opacity-60">Use Custom Testcase</span>
                </div>
              </div>
              <div className="flex-1 bg-base-300/50 rounded-2xl border border-base-content/5 p-4 flex flex-col transition-all focus-within:border-primary/30">
                <p className="text-[10px] font-black uppercase opacity-30 tracking-widest mb-2">Standard Stdin</p>
                <textarea
                  className="flex-1 bg-transparent outline-none font-mono text-sm resize-none"
                  placeholder="Type your input here..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />
              </div>
              <div className="text-[10px] opacity-20 italic">
                Note: Enabling this will ignore the default testcases when you click 'Run'.
              </div>
            </div>
          )}

          {/* Tab 2: Test Results (From 'Run' button) */}
          {activeTab === "testresult" && (
            <div className="space-y-4">
              {!RunReslts?.length ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-50 italic">
                  <p>Run your code to see results.</p>
                </div>
              ) : (
                <>
                  <SubmissionResult runResults={RunReslts} isCustom={isCustomInputEnabled} />
                  <div className="flex gap-2 flex-wrap">
                    {RunReslts.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedResultIndex(i)}
                        className={`btn btn-xs gap-1 ${selectedResultIndex === i
                          ? "btn-primary"
                          : "bg-base-300"
                          }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${r.passed ? "bg-success" : "bg-error"
                            }`}
                        ></div>{" "}
                        Case {i + 1}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {/* Tab 3: Submission Status */}
          {activeTab === "submission" && (
            <div className="space-y-4">
              {!submissions || submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-50 italic">
                  <p>No submission attempts yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {submissions.map((sub, index) => (
                    <div
                      key={sub.id || index}
                      className="bg-base-300/30 rounded-xl border border-base-content/10 overflow-hidden"
                    >
                      {/* Header: Overall Result Summary */}
                      <div className="bg-base-300/50 px-4 py-3 flex justify-between items-center border-b border-base-content/10">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-1.5 rounded-full ${sub.status === "Accepted"
                              ? "bg-success/20 text-success"
                              : "bg-error/20 text-error"
                              }`}
                          >
                            {sub.status === "Accepted" ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <XCircle size={18} />
                            )}
                          </div>
                          <div>
                            <h3
                              className={`font-bold leading-none ${sub.status === "Accepted"
                                ? "text-success"
                                : "text-error"
                                }`}
                            >
                              {sub.status}
                            </h3>
                            <span className="text-[10px] opacity-50 uppercase tracking-tight">
                              {sub.language} •{" "}
                              {new Date(sub.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono">
                            {sub.testcases?.filter((t) => t.passed).length}/
                            {sub.testcases?.length} Passed
                          </p>
                        </div>
                      </div>

                      {/* Individual Test Case List */}
                      <div className="p-4 space-y-2">
                        {sub.testcases && sub.testcases.length > 0 ? (
                          sub.testcases.map((tc, i) => (
                            <div
                              key={tc.id || i}
                              className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg border border-base-content/5 hover:border-base-content/20 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold opacity-70">
                                  TestCase {tc.testCase || i + 1}
                                </span>
                                <div className="h-1 w-1 rounded-full bg-base-content/20"></div>
                                <span
                                  className={`text-sm font-medium ${tc.passed ? "text-success" : "text-error"
                                    }`}
                                >
                                  {tc.status}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-[11px] font-mono opacity-60">
                                <span>{tc.time || "0s"}</span>
                                <span>{tc.memory || "0KB"}</span>
                                {tc.passed ? (
                                  <CheckCircle2
                                    size={14}
                                    className="text-success"
                                  />
                                ) : (
                                  <XCircle size={14} className="text-error" />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          /* Fallback if it's still Pending */
                          <div className="flex items-center gap-2 py-4 justify-center opacity-50">
                            <Loader2 className="animate-spin" size={16} />
                            <p className="text-sm italic">
                              Queueing test cases...
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Compile/System Error Section */}
                      {(sub.compileOutput || sub.stderr) && (
                        <div className="px-4 pb-4">
                          <div className="bg-error/5 border border-error/20 p-3 rounded-lg">
                            <p className="text-[10px] font-bold text-error uppercase mb-1">
                              Error Log
                            </p>
                            <pre className="text-xs font-mono text-error/80 whitespace-pre-wrap">
                              {sub.compileOutput || sub.stderr}
                            </pre>
                          </div>
                        </div>
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

export default CodeEditor;
