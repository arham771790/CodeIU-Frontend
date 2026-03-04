"use client";
import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useSubmissionStore } from "@/store/useSubmissionStore";
import { useAuthStore } from "@/store/useAuthStore";
import EditorHeader from "@/components/molecules/EditorHeader";
import TestCaseTab from "@/components/molecules/TestCaseTab";
import TestResultTab from "@/components/molecules/TestResultTab";
import SubmissionTab from "@/components/molecules/SubmissionTab";

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
        <EditorHeader
          codeSnippets={codeSnippets}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          formatCode={formatCode}
          userTheme={userTheme}
          setTheme={setTheme}
        />
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
            <TestCaseTab
              testcases={testcases}
              selectedCaseIndex={selectedCaseIndex}
              setSelectedCaseIndex={setSelectedCaseIndex}
            />
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
            <TestResultTab
              RunReslts={RunReslts}
              isexecuting={isexecuting}
              isCustomInputEnabled={isCustomInputEnabled}
              selectedResultIndex={selectedResultIndex}
              setSelectedResultIndex={setSelectedResultIndex}
            />
          )}
          {/* Tab 3: Submission Status */}
          {activeTab === "submission" && (
            <SubmissionTab
              submissions={submissions}
              isSubmittingCode={isSubmittingCode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
