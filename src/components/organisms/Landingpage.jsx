"use client";
import React, { useEffect, useState } from "react";
import { TextFlip } from "@/components/atoms/TextFlip";
import Link from "next/link";
import { Cpu, Zap, Code2, ChevronRight } from "lucide-react";
import GridHighlights from "@/components/atoms/GridHighlights";

const Landingpage = () => {
  const [fadeOut, setFadeOut] = useState(false);

  // Syncing the fade with your TextFlip timing
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setFadeOut(false);
      }, 500);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-base-content min-h-[85vh] relative overflow-hidden flex items-center justify-center font-sans mb-8">



      {/* 2. MAIN CONTENT AREA */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">



        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-10 uppercase flex flex-col items-center gap-2">
          <div className="inline-block relative">
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-primary/60 transition-all duration-700 ${fadeOut ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
            >
              <TextFlip />
            </span>
          </div>
          <span className="mt-2">Next Generation</span>
          <span className="text-base-content opacity-20 text-4xl md:text-6xl tracking-widest mt-0">Developer Arena</span>
        </h1>

        {/* REQUESTED: 3xl Heading, No Italics */}
        <div className="space-y-4 mb-14">
          <h2 className="text-2xl md:text-3xl font-black text-base-content tracking-tighter uppercase leading-tight gap-2">
            Ultimate Platform For Next-Gen Coding Contests
          </h2>

          <div className="inline-flex items-center gap-2 bg-base-200 border border-base-content/10 px-5 py-2 rounded-2xl shadow-xl">
            <Cpu size={16} className="text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
              Engineered by Students of <span className="text-primary opacity-100">Integral University</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/problems">
            <button className="group bg-primary text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_40px_rgba(var(--p),0.3)]">
              <span>Start Coding</span>
              <Code2 size={16} className="group-hover:rotate-12 transition-transform" />
            </button>
          </Link>

          <Link href="/contest">
            <button className="group bg-base-200 border border-base-content/10 text-base-content px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-base-100 transition-all">
              Join Contest
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

      </div>


    </div>
  );
};

export default Landingpage;