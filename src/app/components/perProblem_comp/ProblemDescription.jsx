"use client";
import React from "react";
import { Code2, Expand, Book } from "lucide-react";

const ProblemDescription = ({ title, description, testcases, constraints }) => {
  return (
    <div className="bg-base-200 text-base-content flex flex-col h-full overflow-hidden rounded-xl border border-base-content/10">
      <div className="bg-base-300/50 px-4 py-2 flex items-center justify-between border-b border-base-content/10">
        <div className="flex items-center gap-2 text-primary font-bold"><Book size={16} /> Description</div>
        <div className="flex gap-3 opacity-50">
          <Code2 size={18} className="cursor-pointer hover:opacity-100" />
          <Expand size={18} className="cursor-pointer hover:opacity-100" />
        </div>
      </div>

      <div className="p-6 overflow-y-auto space-y-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="leading-relaxed opacity-90">{description}</p>

        <div className="space-y-4">
          <h3 className="font-bold text-lg">Examples</h3>
          {testcases?.map((tc, i) => (
            <div key={i} className="bg-base-300/50 p-4 rounded-xl border border-base-content/5 space-y-2">
              <p className="text-sm font-mono"><span className="opacity-50 font-bold">Input:</span> {tc.input}</p>
              <p className="text-sm font-mono"><span className="opacity-50 font-bold">Output:</span> {tc.output}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-bold">Constraints</h3>
          <code className="block bg-base-300 px-3 py-2 rounded-lg text-sm font-mono border border-base-content/5">{constraints}</code>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;