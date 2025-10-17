"use client";

import { useState, useEffect } from "react";

import React from 'react'
import { useAuthStore } from '@/app/store/useAuthStore';
import { useProblemStore } from '@/app/store/useProblemStore';
import { useParams } from 'next/navigation';

import TopNav from '@/app/components/perProblem_comp/TopNav';
import ProblemDescription from '@/app/components/perProblem_comp/ProblemDescription';
import CodeEditor from '@/app/components/perProblem_comp/CodeEditor';




const EachProblemPage = () => {

    const { authUser } = useAuthStore();
    const { isProblemLoading, problem, getProblemById } = useProblemStore();
    const { id } = useParams();

    useEffect(() => {
      getProblemById(id);
    }, [getProblemById , id]);
  
    
  return (
  

        <div className="bg-[#1a1a1a] flex flex-col  min-h-screen font-sans text-white">
     
          <TopNav problem={problem} />
          <main className="flex-1 overflow-hidden p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProblemDescription 
              title={problem?.title}
              description={problem?.description}
              testcases={problem?.testcases}
              constraints={problem?.constraints}
            />
            <CodeEditor
              description={problem?.description}
              codeSnippets={problem?.codeSnippets}
              testcases={problem?.testcases}
            />
          </main>
        
    </div>
   
  )
}

export default EachProblemPage
