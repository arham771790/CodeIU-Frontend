"use client";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Play,
  Star,
  CloudDownload,
  Code2,
  Timer,
  Loader2,
} from "lucide-react";

import { useState } from "react";

import { useSubmissionStore } from "@/app/store/useSubmissionStore";
import {useProblemStore} from "@/app/store/useProblemStore";
import Link from "next/link";

// sourceCode , stdin , languageId , expected_output

const TopNav = ({ problem, problems }) => {
  console.log("problems from topnav component : ", problems);

  const problemId = problem?.id;

  const [isProblemListOpen, setIsProblemListOpen] = useState(false);

  const {
    userCode,
    RunReslts,
    runCode,
    isexecuting,
    languageId,
    submitCode,
    isSubmittingCode,
  } = useSubmissionStore();

  const { getProblemById } = useProblemStore();


  const visibleTestCase = problem?.visibleTestcases;
  const handleRunCode = async (e) => {
    e.preventDefault();
    try {
      let sourceCode = userCode;
      const stdin = visibleTestCase?.map((item) => item.input);
      const expected_output = visibleTestCase?.map((item) => item.output);

      await runCode(sourceCode, stdin, languageId, expected_output);
    } catch (error) {
      console.log(
        "error occured while running the code from TopNav component : ",
        error
      );
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    try {
      let sourceCode = userCode;

      await submitCode(sourceCode, languageId, problemId);
    } catch (error) {
      console.log(
        "error occured while submitting the code from TopNav component : ",
        error
      );
    }
  };

  const handleOpenProblem = (problemId) => { 
    try {
      getProblemById(problemId);
    } catch (error) {
      console.log(
        "error occured while opening the problem from TopNav component : ",
        error
      );
    }
  }

  return (
    <div>
      <nav className="bg-[#0e0e0e] text-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" >
             <span className=" inline-flex items-center text-xl font-bold text-blue-400">
            🌊ode<h1 className="text-xl font-bold text-white">IU</h1>
          </span></Link>
          <div className="relative">
            {" "}
            {/* Anchor for the dropdown */}
            <button
              onClick={() => setIsProblemListOpen(!isProblemListOpen)} // Toggle state
              className="flex items-center space-x-2 hover:bg-zinc-800 p-2 rounded-md"
            >
              <List className="w-5 h-5" />
              <span className="font-medium">Problem List</span>
            </button>
            {/* The Dropdown Menu */}
            {isProblemListOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-black/90 border border-white/20 rounded-lg shadow-lg z-50">
                {problems.map((problem, index) => {
                 
                  const title = problem?.title || "Untitled";
                  const label = index + 1 ;

                  return (
                    <button
                      key={problem.id || index}
                      onClick={() => {
                        handleOpenProblem(problem.id);
                        setIsProblemListOpen(false); // Close dropdown
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm truncate text-gray-300 hover:bg-zinc-700 font-semibold `}
                    >
                       {label}. {title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            className="bg-[#f0b83f] hover:bg-yellow-500 text-white font-semibold px-2 py-1.5 rounded-md flex items-center space-x-1 text-sm"
            onClick={handleRunCode}
          >
            {isexecuting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
              </>
            ) : (
              <>
                <Play className=" w-4 h-4" />
                <span>Run</span>
              </>
            )}
          </button>
          <button
            className="bg-[#238636] hover:bg-green-700 text-white font-semibold px-3 py-1.5 rounded-md flex items-center space-x-2 text-sm"
            onClick={handleSubmitCode}
          >
            {isSubmittingCode ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
              </>
            ) : (
              <>
                <CloudDownload className=" w-4 h-4" />
                <span>Submit</span>
              </>
            )}
          </button>
        </div>
        <div className="flex items-center ml-50 space-x-4 ">
          <button className="bg-[#26649e] hover:bg-blue-400 text-white font-semibold px-2 py-1.5 rounded-md flex items-center space-x-1 text-sm">
            <Timer className="w-5 h-5 font-bold" />
            <span>Timer</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default TopNav;
