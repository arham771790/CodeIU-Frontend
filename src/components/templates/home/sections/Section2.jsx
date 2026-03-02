"use client";
import { ArrowRight, Play, Terminal, Cpu, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from "framer-motion";

export default function Section2() {
  return (
    <div className="min-h-screen max-w-screen bg-base-300 relative overflow-hidden transition-colors duration-500">

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="order-last lg:order-first"
      >
        {/* 1. SECTION HEADER */}
        <div className="text-center pt-24 pb-20 relative z-10">

          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-base-content leading-none">
            The Developer <span className="text-primary">Skills Platform</span>
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="order-last lg:order-first"
      >
        {/* 2. MAIN CONTENT GRID */}
        <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* LEFT CONTENT */}
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
                <Cpu size={14} className="text-primary" />
                <span className="text-primary text-[10px] font-black tracking-[0.2em] uppercase">
                  CodeIU Community Matrix
                </span>
              </div>

              {/* REQUESTED: 3xl heading, No Italics */}
              <h2 className="text-3xl font-black text-base-content uppercase tracking-tighter leading-tight">
                Prepare and apply for your dream job
              </h2>

              <div className="space-y-8">
                {[
                  { title: "CodeIU Practice", desc: "Solve coding problems, aptitude quizzes, and DSA challenges." },
                  { title: "CodeIU Contests", desc: "Compete in AI-monitored live contests with real-time leaderboards." },
                  { title: "CodeIU Community", desc: "Join peers in forums and group-solving rooms. Share knowledge and discuss solutions." }
                ].map((item, i) => (
                  <div key={i} className="max-w-md">
                    <p className="text-base-content font-black text-xs uppercase tracking-widest mb-2 text-primary">
                      {item.title}
                    </p>
                    <p className="text-base-content/60 leading-relaxed font-medium">
                      {item.desc} <span className="text-base-content font-bold border-b-2 border-primary/40">{item.highlight}</span>.
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/explore"
                className="inline-flex bg-base-200 border border-base-content/10 text-base-content px-8 py-4 rounded-xl items-center gap-3 transition-all hover:bg-primary hover:text-white group font-black text-[10px] uppercase tracking-widest shadow-lg"
              >
                Learn more
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* RIGHT CONTENT - THEMED TERMINAL EDITOR */}
            <div className="relative group">
              {/* Dynamic Glow: Adapts to theme brightness */}
              <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="bg-base-200 border border-base-content/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">

                {/* Terminal Header: Now blends with base colors */}
                <div className="flex justify-between items-center px-6 py-5 bg-base-300/50 border-b border-base-content/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-error/40" />
                    <div className="w-3 h-3 rounded-full bg-warning/40" />
                    <div className="w-3 h-3 rounded-full bg-success/40" />
                  </div>
                  <div className="bg-base-100 border border-base-content/10 px-3 py-1 rounded-lg text-[9px] font-black text-base-content/40 tracking-widest uppercase">
                    C++ Environment // Stack-01
                  </div>
                </div>

                {/* Code Content: Optimized Contrast Palette */}
                <div className="p-8 font-mono text-[13px] leading-relaxed bg-base-100/30">
                  <div className="space-y-1">
                    <div className="text-secondary">#include <span className="text-base-content/70">&lt;vector&gt;</span></div>
                    <div className="text-secondary">using namespace <span className="text-base-content font-bold">std;</span></div>
                  </div>

                  <div className="mt-6 space-y-1">
                    <div>
                      <span className="text-primary">int</span> <span className="text-info">solveFirst</span>
                      <span className="text-base-content/40">(</span>
                      <span className="text-primary">int</span> a<span className="text-base-content/40">,</span> <span className="text-primary">int</span> b
                      <span className="text-base-content/40">) {"{"}</span>
                    </div>
                    <div className="ml-6 text-success">
                      <span>printf(<span className="text-base-content/60">"@Integral_University"</span>);</span>
                    </div>
                    <div className="text-base-content/40">{"}"}</div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div>
                      <span className="text-primary">int</span> <span className="text-info">main</span>
                      <span className="text-base-content/40">() {"{"}</span>
                    </div>
                    <div className="ml-6 text-base-content/30 italic font-sans">// System sync check</div>
                    <div className="ml-6 text-base-content/80">
                      <span className="text-primary">int</span> sum = a + b;
                    </div>
                    <div className="text-base-content/40">{"}"}</div>
                  </div>
                </div>

                {/* Footer Buttons: Clean blending */}
                <div className="flex justify-end items-center gap-4 px-8 py-6 bg-base-300/50 border-t border-base-content/10">
                  <button className="bg-base-100 border border-base-content/10 text-base-content/60 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-base-200 transition-colors flex items-center gap-2">
                    <Play size={14} className="fill-current" /> Run
                  </button>
                  <button className="bg-primary text-primary-content px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-lg transition-all">
                    Submit
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

    </div>
  );
}