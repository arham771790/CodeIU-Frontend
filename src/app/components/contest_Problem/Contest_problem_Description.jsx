"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Book, Code2, Expand, ShieldAlert } from "lucide-react";

export default function Contest_problem_Description({ title, description, examples, testcases, constraints }) {
  return (
    <div className="bg-base-200 border border-base-content/10 rounded-[2rem] flex flex-col h-full overflow-hidden shadow-xl">

      {/* 1. Header (Fixed Height) */}
      <div className="px-6 py-3 flex-shrink-0 border-b border-base-content/5 flex items-center justify-between bg-base-300/30">
        <div className="flex items-center gap-2 text-primary">
          <Book size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Description</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-base-content/10 rounded-xl opacity-40 transition-all hover:opacity-100"><Code2 size={16} /></button>
          <button className="p-2 hover:bg-base-content/10 rounded-xl opacity-40 transition-all hover:opacity-100"><Expand size={16} /></button>
        </div>
      </div>

      {/* 2. Scrollable Body (The Fix: flex-1 min-h-0) */}
      <div className="flex-1 overflow-y-auto min-h-0 p-8 space-y-10 custom-scrollbar scroll-smooth">

        {/* Title & Body */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--p),0.5)]" />
            <h2 className="text-2xl font-black tracking-tight">{title}</h2>
          </div>
          <div className="text-base text-base-content/70 leading-relaxed font-medium prose prose-sm max-w-none prose-headings:text-base-content prose-p:text-base-content/70 prose-strong:text-base-content prose-li:text-base-content/70">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </section>

        {/* Examples / Testcases */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest opacity-40">Example Cases</h3>
          <div className="space-y-4">
            {/* Show Examples if available, else show Testcases */}
            {examples && Object.entries(examples).length > 0 ? (
              Object.entries(examples).map(([language, data], idx) => (
                <div key={idx} className="bg-base-300/50 border border-base-content/5 rounded-2xl p-6 space-y-4">
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Example {idx + 1}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-primary/60 tracking-tighter">Input</span>
                      <pre className="font-mono text-sm text-base-content/90 bg-black/10 p-2 rounded-lg whitespace-pre-wrap">{data.input}</pre>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-primary/60 tracking-tighter">Output</span>
                      <pre className="font-mono text-sm text-base-content/90 bg-black/10 p-2 rounded-lg whitespace-pre-wrap">{data.output}</pre>
                    </div>
                  </div>
                  {data.explanation && (
                    <div className="pt-2 border-t border-base-content/5">
                      <span className="text-[9px] font-black uppercase opacity-30 block mb-1">Explanation</span>
                      <p className="text-sm italic opacity-70 text-base-content/80 whitespace-pre-line">{data.explanation}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              testcases?.map((tc, idx) => (
                <div key={idx} className="bg-base-300/50 border border-base-content/5 rounded-2xl p-6 space-y-4">
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Case {idx + 1}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-primary/60 tracking-tighter">Input</span>
                      <pre className="font-mono text-sm text-base-content/90 bg-black/10 p-2 rounded-lg whitespace-pre-wrap">{tc.input}</pre>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-primary/60 tracking-tighter">Output</span>
                      <pre className="font-mono text-sm text-base-content/90 bg-black/10 p-2 rounded-lg whitespace-pre-wrap">{tc.output}</pre>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 3. Constraints (Now Reachable) */}
        <section className="pt-8 border-t border-base-content/5 pb-8">
          <h3 className="text-sm font-black uppercase tracking-widest opacity-40 mb-4 flex items-center gap-2">
            <ShieldAlert size={14} /> Constraints & Limits
          </h3>
          <ul className="list-disc list-inside space-y-2">
            {constraints
              ? constraints.split("\n").filter(Boolean).map((line, i) => (
                <li key={i} className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-xl font-mono text-sm text-primary font-bold shadow-[0_0_15px_rgba(var(--p),0.1)]">
                  {line}
                </li>
              ))
              : <li className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-xl font-mono text-sm text-primary font-bold">Standard Limits Apply</li>
            }
          </ul>
        </section>
      </div>

      {/* 4. Footer Accent */}
      <div className="px-6 py-2 flex-shrink-0 bg-base-300/10 border-t border-base-content/5">
        <p className="text-[8px] font-black uppercase opacity-20 tracking-[0.4em] text-center italic">
          CodeIU Arena Secure Protocol
        </p>
      </div>
    </div>
  );
}