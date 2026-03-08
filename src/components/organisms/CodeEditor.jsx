"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

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
import { useAuthStore } from "@/store/useAuthStore";
import EditorHeader from "@/components/molecules/EditorHeader";
import TestCaseTab from "@/components/molecules/TestCaseTab";
import TestResultTab from "@/components/molecules/TestResultTab";
import SubmissionTab from "@/components/molecules/SubmissionTab";

import { Group, Panel, Separator } from "react-resizable-panels";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { GripHorizontal, GripVertical } from "lucide-react";

const CodeEditor = ({ problemId, codeSnippets, testcases }) => {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("testcase");
  const [tabOrder, setTabOrder] = useState(["testcase", "custom", "testresult", "submission"]);
  const [panelLayout, setPanelLayout] = useState([60, 40]);
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

  // Load layout from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`editor-layout-${problemId}`);
    if (saved) {
      try {
        const { layout, order } = JSON.parse(saved);
        if (layout) setPanelLayout(layout);
        if (order) setTabOrder(order);
      } catch (e) { }
    }
  }, [problemId]);

  const saveEditorLayout = useCallback((layout, order) => {
    localStorage.setItem(`editor-layout-${problemId}`, JSON.stringify({
      layout: layout || panelLayout,
      order: order || tabOrder
    }));
  }, [problemId, panelLayout, tabOrder]);

  const onLayoutChange = useCallback((sizes) => {
    setPanelLayout(sizes);
    saveEditorLayout(sizes);
  }, [saveEditorLayout]);

  const onTabReorder = (newOrder) => {
    setTabOrder(newOrder);
    saveEditorLayout(undefined, newOrder);
  };

  // Reactive tick to unlock buttons when cooldown expires
  const [, setTick] = useState(0);
  useEffect(() => {
    const hasCooldown = operationCooldowns.run > Date.now() || operationCooldowns.submit > Date.now();
    if (!hasCooldown) return;
    const interval = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(interval);
  }, [operationCooldowns]);

  const now = Date.now();
  const isRunLocked = operationCooldowns.run > now || isexecuting;
  const isSubmitLocked = operationCooldowns.submit > now || isSubmittingCode;

  useEffect(() => {
    if (authUser?.id) intializeSocket(authUser.id);
  }, [authUser, intializeSocket]);

  useEffect(() => {
    resetProblemState();
  }, [problemId, resetProblemState]);

  useEffect(() => {
    const savedCode = getCodeForProblem(problemId, selectedLanguage);
    if (!savedCode && codeSnippets) {
      setUserCode(codeSnippets[selectedLanguage] || "", problemId, selectedLanguage);
    }
  }, [problemId, getCodeForProblem, codeSnippets, selectedLanguage, setUserCode]);

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

  return (
    <div className="h-full flex flex-col gap-0 overflow-hidden">
      <Group orientation="vertical" onLayoutChange={onLayoutChange}>
        {/* Top: Editor */}
        <Panel defaultSize={panelLayout[0]} minSize={20}>
          <div className="h-full bg-base-200 rounded-xl flex flex-col overflow-hidden border border-base-content/10">
            <EditorHeader
              codeSnippets={codeSnippets}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              formatCode={formatCode}
              userTheme={userTheme}
              setTheme={setTheme}
            />
            <div className="flex-1 overflow-hidden">
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
        </Panel>

        <Separator className="relative h-2 w-full group/vhandle flex items-center justify-center cursor-row-resize">
          <div className="absolute w-full h-[2px] bg-base-content/5 group-hover/vhandle:bg-primary transition-colors" />
          <div className="z-10 w-8 h-1 bg-base-content/20 rounded-full group-hover/vhandle:bg-primary group-hover/vhandle:w-16 transition-all" />
        </Separator>

        {/* Bottom: Results */}
        <Panel defaultSize={panelLayout[1]} minSize={20}>
          <div className="h-full bg-base-200 rounded-xl flex flex-col overflow-hidden border border-base-content/10">
            <div className="bg-base-300/30 border-b border-base-content/5 px-2 py-0.5">
              <Reorder.Group axis="x" values={tabOrder} onReorder={onTabReorder} className="flex gap-1">
                {tabOrder.map((tab) => (
                  <Reorder.Item
                    key={tab}
                    value={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                                    cursor-pointer px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg
                                    ${activeTab === tab ? "bg-base-100 text-primary shadow-sm" : "text-base-content/40 hover:text-base-content hover:bg-base-content/5"}
                                `}
                  >
                    {tab}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            <div className="p-4 overflow-auto flex-1 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
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
                    </div>
                  )}

                  {activeTab === "testresult" && (
                    <TestResultTab
                      RunReslts={RunReslts}
                      isexecuting={isexecuting}
                      isCustomInputEnabled={isCustomInputEnabled}
                      selectedResultIndex={selectedResultIndex}
                      setSelectedResultIndex={setSelectedResultIndex}
                    />
                  )}
                  {activeTab === "submission" && (
                    <SubmissionTab
                      submissions={submissions}
                      isSubmittingCode={isSubmittingCode}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
};

export default CodeEditor;
