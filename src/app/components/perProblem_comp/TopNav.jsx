"use client";
import React, { useState } from "react";
import { List, Play, CloudDownload, Timer, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useSubmissionStore } from "@/app/store/useSubmissionStore";
import ThemeController from "../ThemeController";
import { useAuthStore } from "@/app/store/useAuthStore";

const TopNav = ({ problem, problems }) => {
  const [isProblemListOpen, setIsProblemListOpen] = useState(false);
  const {
    userCode,
    runCode,
    isexecuting,
    languageId,
    submitCode,
    isSubmittingCode,
  } = useSubmissionStore();

  const { authUser } = useAuthStore();

  const handleRunCode = async (e) => {
    e.preventDefault();
    const stdin = problem?.visibleTestcases?.map((item) => item.input);
    const expected_output = problem?.visibleTestcases?.map(
      (item) => item.output,
    );
    await runCode(userCode, stdin, languageId, expected_output);
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    await submitCode(userCode, languageId, problem?.id);
  };

  return (
    <nav className="bg-base-200 text-base-content px-4 py-2 flex items-center justify-between border-b border-base-content/10">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <span className="text-xl font-bold text-blue-400 ml-3">
            🌊ode<span className="font-bold text-base-content">IU</span>
          </span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setIsProblemListOpen(!isProblemListOpen)}
            className="btn btn-ghost btn-sm gap-2"
          >
            <List className="w-4 h-4" /> <span>Problem List</span>
          </button>

          {isProblemListOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-base-200 border border-base-content/20 rounded-xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto backdrop-blur-md">
              {problems.map((p, index) => (
                <Link
                  key={p.id}
                  href={`/Each-problem/${p.id}`}
                  onClick={() => setIsProblemListOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-primary hover:text-primary-content transition-colors border-b border-base-content/5 last:border-0 font-medium"
                >
                  {index + 1}. {p.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {authUser ? (
        <>
          <div className="flex items-center space-x-3">
            <button
              className="btn btn-warning btn-sm h-9 px-4 rounded-lg font-bold"
              onClick={handleRunCode}
              disabled={isexecuting}
            >
              {isexecuting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <>
                  <Play size={16} /> Run
                </>
              )}
            </button>
            <button
              className="btn btn-success btn-sm h-9 px-4 rounded-lg font-bold"
              onClick={handleSubmitCode}
              disabled={isSubmittingCode}
            >
              {isSubmittingCode ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <>
                  <CloudDownload size={16} /> Submit
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="btn btn-ghost btn-sm text-primary hidden md:flex">
              <Timer size={18} /> Timer
            </button>
            <div className="divider divider-horizontal mx-0"></div>
            <ThemeController />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center space-x-3">
            <button
              className="btn btn-warning btn-sm h-9 px-4 rounded-lg font-bold hover:cursor-not-allowed"
              onClick={handleRunCode}
              title="You must be logged in to Run code"
            >
              <Lock size={16} /> Run
            </button>
            <button
              className="btn btn-success btn-sm h-9 px-4 rounded-lg font-bold hover:cursor-not-allowed "
              onClick={handleSubmitCode}
              title="You must be logged in to submit code"
            >
              <Lock size={16} /> Submit
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="btn btn-ghost btn-sm text-primary hidden md:flex">
              <Timer size={18} /> Timer
            </button>
            <div className="divider divider-horizontal mx-0"></div>
            <ThemeController />
          </div>
        </>
      )}
    </nav>
  );
};

export default TopNav;