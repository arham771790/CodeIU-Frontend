"use client";

import React from "react";
import {
  Code2,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings,
  Expand,
  Loader2
} from "lucide-react";
import Editor from "@monaco-editor/react";



import { useState, useEffect, useRef } from "react";
import { useSubmissionStore } from "@/app/store/useSubmissionStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import SubmissionResult from "./SubmissionResult";

const CodeEditor = ({ description, codeSnippets, testcases }) => {
  const [activeTab, setActiveTab] = useState("testcase");
  const [topPanelHeight, setTopPanelHeight] = useState(60); // Initial height in percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const [testCases, setTestCases] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showWarning, setShowWarning] = useState(true);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  const {
    setUserCode,
    userCode,
    RunReslts,
    selectedLanguage,
    setSelectedLanguage,
    intializeSocket,
    disconnectSocket,
    submissions,
  } = useSubmissionStore();
  const { authUser } = useAuthStore();

  const userId = authUser?.id;

  // This gets the most recent submission from the array
  const latestSubmission = submissions?.[0];

  const visibleTestCase = testcases?.slice(0, 2);

  useEffect(() => {
    if (codeSnippets) {
      setUserCode(codeSnippets?.[selectedLanguage] || "");
    }

    setTestCases(
      visibleTestCase?.map((testCase) => ({
        Input: testCase?.input,
        Output: testCase?.output,
      })) || []
    );
  }, [codeSnippets, selectedLanguage]);

  useEffect(() => {
    if (latestSubmission && latestSubmission.status === "Pending") {
      setActiveTab("submission");
    }
  }, [submissions]);

  useEffect(() => {
    if (authUser && userId) {
      intializeSocket(userId);
    }

    return () => {
      disconnectSocket();
    };
  }, [authUser, intializeSocket, disconnectSocket]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);

    setCode(codeSnippets?.[lang] || "");
  };


  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let newHeight =
      ((e.clientY - containerRect.top) / containerRect.height) * 100;

    // Clamp the height between 20% and 80%
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
  }, [isDragging, handleMouseMove, handleMouseUp]);



  return (
    <div ref={containerRef} className="flex flex-col h-full">
      {/* Top Panel: Header + Code Editor */}
      <div
        className="bg-[#212121] rounded-lg flex flex-col overflow-hidden"
        style={{ height: `${topPanelHeight}%` }}
      >
        <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between border-b border-zinc-800   ">
          <div className="flex items-center ">
            <select
              className="bg-[#1e1e1e] text-white text-sm font-semibold rounded-lg focus:outline-none"
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
            <button className="hover:bg-zinc-800 p-1.5 rounded">
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
            <button className="hover:bg-zinc-800 p-1.5 rounded">
              <Expand className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="  flex-1 overflow-hidden">
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
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* Draggable Divider */}
      <div
        className="w-full h-2 flex-shrink-0 cursor-row-resize "
        onMouseDown={handleMouseDown}
      ></div>

      {/* Bottom Panel: Test Cases */}
      <div className="bg-[#212121] rounded-lg flex-grow flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex items-center space-x-2 px-4 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("testcase")}
            className={`py-2 text-sm  font-semibold border-b-2 hover:cursor-pointer ${
              activeTab === "testcase"
                ? "border-white text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            Testcase
          </button>
          <button
            onClick={() => setActiveTab("testresult")}
            className={`py-2 ml-3 text-sm font-semibold border-b-2 hover:cursor-pointer ${
              activeTab === "testresult"
                ? "border-white text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            Test Result
          </button>

          <button
            onClick={() => setActiveTab("submission")}
            className={`py-2 ml-3 text-sm font-semibold border-b-2 hover:cursor-pointer ${
              activeTab === "submission"
                ? "border-white text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            Submission
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          {activeTab === "testcase" && (
            <div className="p-2">
              <div className="flex items-center space-x-3 mb-2">
                {visibleTestCase?.map((testCase, index) => (
                  <button
                    key={testCase?.id || index}
                    onClick={() => setSelectedCaseIndex(index)}
                    className={`bg-zinc-700 text-sm font-semibold px-3 py-1 rounded-md transition-colors ${
                      selectedCaseIndex === index
                        ? "bg-zinc-700 text-white"
                        : "bg-zinc-800 text-gray-400"
                    }`}
                  >
                    Case {index + 1}
                  </button>
                ))}
              </div>

              {/*RENDER THE DETAILS FOR ONLY THE SELECTED CASE */}
              {/*  check if the test case exists before trying to show its data */}

              {visibleTestCase && visibleTestCase[selectedCaseIndex] && (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold mb-1">Input:</p>
                    <pre className="text-sm text-gray-300 bg-[#272727] p-3 rounded">
                      {visibleTestCase[selectedCaseIndex].input}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Output:</p>
                    <pre className="text-sm text-gray-300 bg-[#272727] p-3 rounded">
                      {visibleTestCase[selectedCaseIndex].output}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "testresult" && (
            <div className="p-4 flex-grow font-semibold items-center  text-gray-500">
              {!RunReslts || RunReslts.length === 0 ? (
                <div> Run your code to see the results.</div>
              ) : (
                <div>
                  <SubmissionResult runResults={RunReslts} />
                  <div className="flex items-center space-x-3 mb-2">
                    {RunReslts.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedResultIndex(index)}
                        className={`flex items-center space-x-2 text-sm font-semibold px-3 py-1 rounded-md transition-colors ${
                          selectedResultIndex === index
                            ? "bg-zinc-700 text-white"
                            : "bg-zinc-800 text-gray-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            result.passed ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        <span>Case {index + 1}</span>
                      </button>
                    ))}
                  </div>

                  {RunReslts[selectedResultIndex] && (
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-400 mb-1 mt-2">
                          Input
                        </p>
                        <pre className="text-sm text-gray-200 bg-[#272727] p-3 rounded-md w-full">
                          {RunReslts[selectedResultIndex].Input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-400 mb-1">
                          Output
                        </p>
                        <pre className="text-sm text-gray-200 bg-[#272727] p-3 rounded-md">
                          {RunReslts[selectedResultIndex].stdout}
                        </pre>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-400 mb-1">
                          Expected
                        </p>
                        <pre className="text-sm text-gray-200 bg-[#272727] p-3 rounded-md">
                          {RunReslts[selectedResultIndex].expected}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* RENDER THE SUBMISSION RESULT */}
          {activeTab === "submission" && (
            <div>
              {!latestSubmission ? (
                <div className="text-gray-500 font-semibold">
                  Submit your code to see the final result.
                </div>
              ) : (
                <div>
                  <h2
                    className={`text-2xl font-semibold mb-3 ${
                      latestSubmission.status === "Accepted"
                        ? "text-green-500"
                        : latestSubmission.status === "Pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {latestSubmission.status}
                    {latestSubmission.status === "Pending" && (
                      <Loader2 className="inline-block ml-2 h-6 w-6 animate-spin" />
                    )}
                  </h2>

                  {/* Display test cases once they arrive */}
                  {latestSubmission.testcases &&
                    latestSubmission.testcases.length > 0 && (
                      <div className="space-y-4">
                        <p className="font-semibold text-gray-300">
                          Test Cases:
                        </p>
                        {latestSubmission.testcases.map((tc, index) => (
                          <div
                            key={index}
                            className="bg-[#272727] p-3 rounded-md"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-white">
                                Case {tc.testCase}
                              </span>
                              <span
                                className={`font-bold text-sm px-2 py-1 rounded-full ${
                                  tc.passed
                                    ? "bg-green-800 text-green-300"
                                    : "bg-red-800 text-red-300"
                                }`}
                              >
                                {tc.passed ? "Passed" : "Failed"}
                              </span>
                            </div>
                            {/* You can add more details here if you want */}
                          </div>
                        ))}
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

export default CodeEditor;
