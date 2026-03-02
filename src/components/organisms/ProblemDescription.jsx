"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Code2, Expand, Book, Clock, CheckCircle2, Trophy } from "lucide-react";
import PreviousSubmissions from "@/components/molecules/PreviousSubmissions";
import ProblemLeaderboard from "@/components/molecules/ProblemLeaderboard";
import { useProblemStore } from "@/store/useProblemStore";

const ProblemDescription = ({ title, description, examples, constraints, problemId }) => {
  const [activeTab, setActiveTab] = useState("description");
  const { solvedProblemsIds } = useProblemStore();
  const isSolved = solvedProblemsIds.includes(problemId);
  return (
    <div className="bg-base-200 text-base-content flex flex-col h-full overflow-hidden rounded-xl border border-base-content/10">
      <div className="bg-base-300/50 px-4 py-2 flex items-center justify-between border-b border-base-content/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex items-center gap-2 font-bold transition-colors disabled:opacity-50 ${activeTab === 'description' ? 'text-primary' : 'opacity-50 hover:opacity-100'}`}
          >
            <Book size={16} /> Description
          </button>
          <div className="divider divider-horizontal mx-0"></div>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`flex items-center gap-2 font-bold transition-colors disabled:opacity-50 ${activeTab === 'submissions' ? 'text-primary' : 'opacity-50 hover:opacity-100'}`}
          >
            <Clock size={16} /> Submissions
          </button>
          <div className="divider divider-horizontal mx-0"></div>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex items-center gap-2 font-bold transition-colors disabled:opacity-50 ${activeTab === 'leaderboard' ? 'text-primary' : 'opacity-50 hover:opacity-100'}`}
          >
            <Trophy size={16} /> Leaderboard
          </button>
        </div>
        <div className="flex gap-3 opacity-50">
          <Code2 size={18} className="cursor-pointer hover:opacity-100" />
          <Expand size={18} className="cursor-pointer hover:opacity-100" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        {activeTab === "description" ? (
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              {title}
              {isSolved && (
                <CheckCircle2 className="w-5 h-5 text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              )}
            </h2>

            {/* Description — rendered as Markdown */}
            <div className="leading-relaxed opacity-90 prose prose-sm max-w-none prose-headings:text-base-content prose-p:text-base-content prose-strong:text-base-content prose-li:text-base-content">
              <ReactMarkdown>{description}</ReactMarkdown>
            </div>

            {/* Examples */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Examples</h3>

              {examples &&
                Object.entries(examples).map(([language, data], i) => (
                  <div
                    key={i}
                    className="bg-base-300/50 p-4 rounded-xl border border-base-content/5 space-y-2"
                  >
                    <p className="text-sm font-mono whitespace-pre-wrap">
                      <span className="opacity-50 font-bold">Input:</span>{" "}
                      {data.input}
                    </p>
                    <p className="text-sm font-mono whitespace-pre-wrap">
                      <span className="opacity-50 font-bold">Output:</span>{" "}
                      {data.output}
                    </p>
                    {data.explanation && (
                      <p className="text-sm italic opacity-70">
                        <span className="font-bold">Explanation:</span>{" "}
                        {data.explanation}
                      </p>
                    )}
                  </div>
                ))}
            </div>

            {/* Constraints — split into bullet points */}
            <div className="space-y-2">
              <h3 className="font-bold">Constraints</h3>
              <ul className="list-disc list-inside space-y-1 text-sm font-mono bg-base-300 px-4 py-3 rounded-lg border border-base-content/5">
                {constraints &&
                  constraints
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            </div>
          </div>
        ) : activeTab === "submissions" ? (
          <div className="p-2 h-full">
            <PreviousSubmissions problemId={problemId} />
          </div>
        ) : (
          <div className="p-4 h-full">
            <ProblemLeaderboard problemId={problemId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDescription;