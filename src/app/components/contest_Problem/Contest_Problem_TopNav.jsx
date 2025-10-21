import React, { useState } from 'react'; // <-- 1. Import useState
import {
  ChevronLeft,
  ChevronRight,
  List,
  Play,
  Star,
  CloudDownload,
  Code2,
  Timer,
  Loader2
} from 'lucide-react';

import { useSubmissionStore } from '@/app/store/useSubmissionStore';

const Contest_Problem_TopNav = ({ problems, activeIndex, onProblemChange }) => {

  const [isProblemListOpen, setIsProblemListOpen] = useState(false);

  const { userCode, RunReslts, runCode, isexecuting, languageId, submitCode, isSubmittingCode } = useSubmissionStore();

  const currentProblem = problems[activeIndex];


  const visibleTestCase = currentProblem?.snapshot?.testcases;
  
  const handleRunCode = async (e) => {
    e.preventDefault();
    try {
      let sourceCode = userCode;
      const stdin = visibleTestCase?.map(item => item.input);
      const expected_output = visibleTestCase?.map(item => item.output);

      await runCode(sourceCode, stdin, languageId, expected_output);

    } catch (error) {
      console.log("error occured while running the code from TopNav component : ", error);
    }
  }

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    try {
      let sourceCode = userCode;
      const stdin = visibleTestCase?.map(item => item.input);
      const expected_output = visibleTestCase?.map(item => item.output);

      // --- 6. 🐞 BUG FIX: Pass the 'currentProblem.id' ---
      await submitCode(sourceCode, languageId,  currentProblem?.id);

    } catch (error) {
      console.log("error occured while submitting the code from TopNav component : ", error);
    }
  }

  return (
    <div>
      <nav className="bg-[#212121] text-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className='text-xl font-bold text-white'>🌊odeIU</h1>

          {/* --- 7. This is the new Dropdown section --- */}
          <div className="relative"> {/* Anchor for the dropdown */}
            <button
              onClick={() => setIsProblemListOpen(!isProblemListOpen)} // Toggle state
              className="flex items-center space-x-2 hover:bg-zinc-800 p-2 rounded-md"
            >
              <List className="w-5 h-5" />
              <span className="font-medium">Problem List</span>
            </button>

            {/* The Dropdown Menu */}
            {isProblemListOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#2d2d2d] border border-gray-700 rounded-md shadow-lg z-50">
                {problems.map((problem, index) => {
                  const label = String.fromCharCode(65 + (problem.order ?? index));
                  const title = problem.snapshot?.title || "Untitled";
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={problem.id || index}
                      onClick={() => {
                        onProblemChange(index); // Call parent function
                        setIsProblemListOpen(false); // Close dropdown
                      }}
                      className={`
                        block w-full text-left px-4 py-2 text-sm truncate
                        ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-zinc-700'}
                      `}
                    >
                      {label}: {title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* These buttons are fine, but you could make them navigate too */}
          <div className="flex items-center space-x-0">
            <button 
              onClick={() => onProblemChange(Math.max(0, activeIndex - 1))} // Go to prev
              className="hover:bg-zinc-800 p-1 rounded"
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onProblemChange(Math.min(problems.length - 1, activeIndex + 1))} // Go to next
              className="hover:bg-zinc-800 p-1 rounded"
              disabled={activeIndex === problems.length - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ... Rest of your component (Run/Submit/Timer buttons) ... */}
        <div className="flex items-center space-x-1">
           {/* Run Button */}
           <button className="bg-[#f0b83f] hover:bg-yellow-500 text-white font-semibold px-2 py-1.5 rounded-md flex items-center space-x-1 text-sm"
            onClick={handleRunCode}
            disabled={isexecuting || isSubmittingCode} // Disable when busy
           >
             {isexecuting ? (
               <Loader2 className="h-5 w-5 animate-spin" />
             ) : (
               <><Play className=" w-4 h-4"/><span>Run</span></>
             )}
           </button>
           {/* Submit Button */}
           <button className="bg-[#238636] hover:bg-green-700 text-white font-semibold px-3 py-1.5 rounded-md flex items-center space-x-2 text-sm"
            onClick={handleSubmitCode}
            disabled={isexecuting || isSubmittingCode} // Disable when busy
           >
             {isSubmittingCode ? (
               <Loader2 className="h-5 w-5 animate-spin" />
             ) : (
               <><CloudDownload className=" w-4 h-4"/><span>Submit</span></>
             )}
           </button>
        </div> 
         <div className="flex items-center ml-50 space-x-4 "> 
           <button className='bg-[#26649e] hover:bg-blue-400 text-white font-semibold px-2 py-1.5 rounded-md flex items-center space-x-1 text-sm'>
               <Timer className="w-5 h-5 font-bold"/>
               <span>Timer</span>
           </button>
        </div>
      </nav>
    </div>
  )
}

export default Contest_Problem_TopNav;