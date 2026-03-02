"use client";

import React, { useState } from "react";
import {
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Terminal,
  BarChart3,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

const Section4 = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(1); // Default to useEffect for the demo

  return (
    <div className="text-base-content font-sans">

      {/* 1. HERO SECTION - Quiz on Left */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* A. INTERACTIVE TERMINAL (Now on Left) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-last lg:order-first"
          >
            <div className="bg-base-200/40 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative group">
              {/* Terminal Header with Close/Min/Max Buttons */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2 px-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_10px_rgba(255,95,86,0.3)]" title="Close" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_10px_rgba(255,189,46,0.3)]" title="Minimize" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_10px_rgba(39,201,63,0.3)]" title="Expand" />
                </div>
                <div className="text-[9px] font-mono tracking-[0.3em] opacity-40 uppercase  pr-2">
                  Session_v2.0 // Active
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-primary font-mono text-xs opacity-80">$</span>
                    <p className="text-primary font-mono text-xs uppercase tracking-widest">fetch_challenge</p>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black  tracking-tighter leading-tight">
                    Which React hook is used for <span className="text-primary">side effects</span>?
                  </h3>
                </div>

                {/* Hoverable Options */}
                <div className="space-y-3">
                  {["useState", "useEffect", "useMemo"].map((opt, i) => (
                    <div
                      key={opt}
                      onMouseEnter={() => setSelectedOpt(i)}
                      className={`p-5 rounded-2xl border transition-all duration-300 flex justify-between items-center cursor-pointer ${selectedOpt === i
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--p),0.1)] translate-x-2"
                        : "bg-white/[0.02] border-white/5 text-base-content/40 hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                    >
                      <span className="text-sm font-black tracking-widest uppercase">{opt}</span>
                      {selectedOpt === i && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle size={18} className="drop-shadow-[0_0_8px_rgba(var(--p),0.6)]" />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* B. TEXT CONTENT (Now on Right) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >


            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-5">
              Assess your <br />
              <span className="text-primary ">true potential.</span>
            </h1>

            <p className="text-base-content/50 text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Minimalist challenges for world-class engineers. Experience
              synchronized coding environments designed for high-performance teams.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-primary text-white px-10 py-5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-95 shadow-[0_0_30px_rgba(var(--p),0.2)]"
              >
                Enter Matrix
                <motion.div animate={{ x: isHovered ? 5 : 0 }}>
                  <ArrowRight size={16} />
                </motion.div>
              </button>

              <button className="bg-base-200 border border-base-content/10 text-base-content px-10 py-5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-base-300 transition-all">
                <Play size={16} fill="currentColor" />
                View Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="order-last lg:order-first"
      >

        {/* 2. MASTER GRID (Centered Focus) */}
        <section className="py-24 border-t border-base-content/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header in the middle */}
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
                Master the <span className="text-primary">Grid</span>
              </h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full shadow-[0_0_15px_rgba(var(--p),0.4)]" />
            </div>

            <div className="grid md:grid-cols-3 gap-12 text-center">
              <FeatureCard
                icon={<Terminal className="text-primary" />}
                title="Coding Sandboxes"
                desc="Answer technical questions by writing real code in our minimal integrated IDE."
              />
              <FeatureCard
                icon={<BarChart3 className="text-primary" />}
                title="Arena Contests"
                desc="Timed contests with global leaderboards and automated ranking protocols."
              />
              <FeatureCard
                icon={<Globe className="text-primary" />}
                title="Real-time Battles"
                desc="Compete in real-time with developers in themed tournament brackets."
              />
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group flex flex-col items-center space-y-8 p-4 hover:-translate-y-2 transition-transform duration-500">
    <div className="w-16 h-16 bg-base-200 border border-base-content/5 rounded-[1.5rem] flex items-center justify-center  group-hover:text-white group-hover:shadow-[0_0_30px_rgba(var(--p),0.3)] transition-all duration-500 rotate-3 group-hover:rotate-0">
      {icon}
    </div>
    <div className="space-y-4">
      <h3 className="text-xl font-black tracking-tighter uppercase">{title}</h3>
      <p className="text-sm text-base-content/40 leading-relaxed font-medium max-w-xs mx-auto">{desc}</p>
    </div>
  </div>
);

export default Section4;