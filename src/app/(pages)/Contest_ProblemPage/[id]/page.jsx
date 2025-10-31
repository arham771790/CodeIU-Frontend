"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import Contest_Problem_CodeEditor from "@/app/components/contest_Problem/Contest_Problem_CodeEditor";
import Contest_problem_Description from "@/app/components/contest_Problem/Contest_problem_Description";
import Contest_Problem_TopNav from "@/app/components/contest_Problem/Contest_Problem_TopNav";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useBundleStore } from "@/app/store/useBundleStore";
import Link from "next/link";


const page = () => {
  const { bundle , contestId:storedContestId , fetchBundle , isLoading } = useBundleStore();
  const {authUser} = useAuthStore();
  
  const params = useParams();
  const contestId = params?.id;

  const [isOpenQuestion, setisOpenQuestion] = useState(true); //yhan pr false hoga testing e liye i did true
  const [warnings, setwarning] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (contestId && authUser?.id) {
      
      // 👇 3. The new, smart check
      if (contestId !== storedContestId || !bundle) {
        console.log("Store is empty or has wrong contest. Fetching...");
        fetchBundle({ contestId, userId: authUser.id });
      }
      
    }
    // Add all dependencies
  }, [contestId, authUser?.id, fetchBundle, storedContestId, bundle]);

  const Problems = bundle?.problems || [];


  const sortedProblems = Problems.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const activeProblem = sortedProblems[activeIndex]; 


  const handleOpenQuestion = () => {
    const element = document.documentElement; // target the whole page

    //request full screen
    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    }

    //show the main problem and editor component
    setisOpenQuestion(true);
  };

  useEffect(() => {
    if (!isOpenQuestion) return;

    const handleFullScreenChange = () => {
      // If document.fullscreenElement is null, the user has exited full-screen
      if (!document.fullscreenElement) {
        const newWarningCount = warnings + 1;
        setwarning(newWarningCount);

        if (newWarningCount <= 3) {
          alert(
            `Warning ${newWarningCount} of 3: You must remain in full-screen mode to continue.`
          );
          // Immediately hide the test content, forcing them to click to re-enter.
          setisOpenQuestion(false);
        } else {
          // This runs when the warning count is 4
          alert(
            "You have exceeded the maximum number of warnings. Your test has been submitted."
          );
          setisOpenQuestion(false);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [isOpenQuestion]);





  return (
     <div className="bg-[#080808] flex flex-col  min-h-screen font-sans text-white">
      {!isOpenQuestion ? (
        // Show this overlay before the test starts
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold mb-4">Demo Question</h1>
          {warnings > 0 && warnings <= 3 && (
            <p className="text-yellow-400 font-bold mb-4 text-lg">
              You have received {warnings} of 3 warnings.
            </p>
          )}
          {warnings > 3 ? (
           <div>
             <div className="text-center">
              <h1 className="text-2xl font-bold text-green-500 mb-4">
                Test Submitted Successfully
              </h1>
              <p className="text-gray-300">
                You exited full-screen mode too many times. Your progress has
                been automatically submitted.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center font-semibold test-xl mb-4 mt-4">
              <p>Click 👇to go back to Constest Page</p>
           
              <Link href={`/contest/${contestId}`} className="mt-2">
                <button className="inline-flex items-center justify-center border border-white/20 bg-blue-400 p-4 rounded-lg">Click me</button>
               </Link>
            </div>
           </div>
          ) : (
            <>
              <p className="mb-8">
                Click the button below to begin. The test will start in
                full-screen mode.
              </p>
              <button
                onClick={handleOpenQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
              >
                {warnings > 0 ? "Re-enter Test" : "Open Question"}
              </button>
            </>
          )}
        </div>
      ) : (
        // Show the main content after the test starts
        <>
          <Contest_Problem_TopNav
            problems={sortedProblems}    // Pass the WHOLE array
            activeIndex={activeIndex}      // Pass the CURRENT index
            onProblemChange={setActiveIndex}
            problemId={activeProblem?.snapshot?.id}  // Pass the FUNCTION to change it
          />
          <main className="flex-1 overflow-hidden p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Now, pass the *activeProblem* data to the children */}
            <Contest_problem_Description 
              title={activeProblem?.snapshot?.title}
              description={activeProblem?.snapshot?.description}
              testcases={activeProblem?.snapshot?.testcases}
              constraints={activeProblem?.snapshot?.constraints}
            />
            <Contest_Problem_CodeEditor
              description={activeProblem?.snapshot?.description}
              codeSnippets={activeProblem?.snapshot?.codeSnippets}
              testcases={activeProblem?.snapshot?.testcases}
              problemId={activeProblem?.snapshot?.id} 
            />
          </main>
        </>
      )}
    </div>
  );
};

export default page;
