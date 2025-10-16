"use client";

import React from 'react'
import{
    ChevronLeft, 
    ChevronRight, 
    List,
    Play, 
    Star ,
    CloudDownload,
    Code2,
    Timer,
    Loader2
} from 'lucide-react';

import { useSubmissionStore } from '@/app/store/useSubmissionStore';

// sourceCode , stdin , languageId , expected_output


const TopNav = ({problem}) => { 

  console.log("problem from topnav component : " , problem);

    const problemId = problem?.id;

    console.log("problemId from topnav component : " , problemId);


    const {userCode ,  RunReslts ,  runCode , isexecuting , languageId , submitCode , isSubmittingCode} = useSubmissionStore();

    const visibleTestCase = problem?.testcases?.slice(0, 2);
    const handleRunCode = async(e) => {
        e.preventDefault();
        try {

            let sourceCode = userCode;
            const stdin = visibleTestCase?.map(item => item.input);
            const expected_output = visibleTestCase?.map(item => item.output);

           await  runCode(sourceCode , stdin , languageId , expected_output);
            
        } catch (error) {
            console.log("error occured while running the code from TopNav component : " , error);
        }
    }

    const handleSubmitCode = async(e) => {
      e.preventDefault();
      try {

        let sourceCode = userCode;
        const stdin = visibleTestCase?.map(item => item.input);
        const expected_output = visibleTestCase?.map(item => item.output);

        await submitCode(sourceCode , stdin , languageId , expected_output , problemId);
        
      } catch (error) {
        console.log("error occured while submitting the code from TopNav component : " , error);
      }
    }

    

  return (
    <div>
       <nav className="bg-[#212121] text-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <h1 className='text-xl font-bold text-white'>🌊odeIU</h1>
            <div className="flex items-center space-x-2">
                <button className="hover:bg-zinc-800 p-1 rounded"><List className="w-5 h-5"/></button>
                <span className="font-medium">Problem List</span>
                <button className="hover:bg-zinc-800 p-1 rounded"><ChevronLeft className="w-5 h-5"/></button>
                <button className="hover:bg-zinc-800 p-1 rounded"><ChevronRight className="w-5 h-5"/></button>
            </div>
        </div>
        <div className="flex items-center space-x-1">
           <button className="bg-[#f0b83f] hover:bg-yellow-500 text-white font-semibold px-2 py-1.5 rounded-md flex items-center space-x-1 text-sm"
            onClick={handleRunCode}
           >
             {isexecuting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                </>
              ) : (
                <>
                  <Play className=" w-4 h-4"/>
                  <span>Run</span>
                </>
              )}
            </button>
            <button className="bg-[#238636] hover:bg-green-700 text-white font-semibold px-3 py-1.5 rounded-md flex items-center space-x-2 text-sm"
            onClick={handleSubmitCode}
            >
              {
                isSubmittingCode ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </>
                ) : (
                  <>
                   <CloudDownload className=" w-4 h-4"/>
                   <span>Submit</span>
                 </> 
                )
              }
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

export default TopNav
