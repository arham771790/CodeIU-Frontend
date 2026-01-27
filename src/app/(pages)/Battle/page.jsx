"use client";
import React, { useState, useEffect } from "react";
import {
  Swords,
  Users,
  Zap,
  Trophy,
  Timer,
  Search,
  ArrowRight,
  Keyboard,
  Lock,
} from "lucide-react";
import GridHighlights from "@/app/components/GridHighlights";

const BattleMode = () => {
  // --- USER DATA (Preserved) ---
  const currentUserStats = {
    rank: "****",
    wins: "**",
    battles: "X",
    winRate: "x%",
  };

  const categories = [
    { name: "React JS", active: 142 },
    { name: "Node.js", active: 89 },
    { name: "DSA Master", active: 231 },
    { name: "Python", active: 67 },
  ];

  return (
    <div className="min-h-screen bg-base-300 text-base-content font-sans overflow-hidden relative pb-20">
      
      {/* 1. GLOBAL BACKGROUND GRID (CodeIU X Style) */}
      <div className="absolute top-0 left-0 w-full h-[100vh] [mask-image:linear-gradient(to_bottom,black_40%,transparent)] pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <GridHighlights />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* 2. HEADER: Battle Arena X */}
        <header className="relative z-10 py-12 md:py-24 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-primary/30 blur-[100px] rounded-full animate-pulse pointer-events-none" />
          
          <div className="flex flex-col items-center relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative p-2 bg-base-200 border-2 border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(var(--p),0.5)] animate-bounce">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <div className="absolute inset-[-8px] border border-dashed border-primary/40 rounded-full animate-[spin_10s_linear_infinite] opacity-50" />
                <Swords className="text-primary w-6 h-6 relative z-10 drop-shadow-[0_0_8px_rgba(var(--p),0.8)]" />
              </div>
            </div>

            <h1 className="relative text-5xl md:text-7xl font-black tracking-tighter mb-4">
              Battle <span className="text-base-content">Arena</span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-primary/60 mx-2 animate-pulse">
                X
              </span>
            </h1>
            <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mt-2">
              Sector: 1v1 Combat // Status: Restricted
            </p>
            <div className="h-1.5 w-24 bg-primary mt-6 rounded-full shadow-[0_0_20px_rgba(var(--p),0.6)] mx-auto" />
          </div>
        </header>

        {/* 3. MAIN CONTENT (Locked UI) */}
        <div className="relative">
          
          {/* THE LOCK OVERLAY (Sharp, Not Blurred) */}
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-base-300/40 border border-white/5 rounded-[3rem] pointer-events-none">
             <div className="p-6 bg-base-100 border border-primary/30 rounded-3xl shadow-[0_0_50px_rgba(var(--p),0.3)] flex flex-col items-center gap-4 animate-in zoom-in duration-500 pointer-events-auto">
                <Lock size={40} className="text-primary" />
                <div className="text-center">
                  <p className="text-xl font-black uppercase tracking-tighter">Sector Locked</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">Under Construction</p>
                </div>
             </div>
          </div>

          {/* DUMMY CONTENT BELOW (Visible but Unusable) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-40 grayscale">
            
            {/* User Stats */}
            <div className="bg-base-200/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 space-y-8">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Season Protocol</h3>
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-base-300 rounded-2xl border border-primary/20">
                     <Trophy className="text-primary" size={32} />
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tighter">{currentUserStats.rank}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Current Rank</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-base-300/50 rounded-2xl border border-white/5">
                     <p className="text-xl font-black">{currentUserStats.wins}</p>
                     <p className="text-[8px] font-black uppercase tracking-widest opacity-20">Total Wins</p>
                  </div>
                  <div className="p-4 bg-base-300/50 rounded-2xl border border-white/5">
                     <p className="text-xl font-black text-primary">{currentUserStats.winRate}</p>
                     <p className="text-[8px] font-black uppercase tracking-widest opacity-20">Success Rate</p>
                  </div>
               </div>
            </div>

            {/* Action Card */}
            <div className="lg:col-span-2 bg-base-200/50 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/5 flex flex-col justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
               <div className="relative z-10 space-y-8">
                  <h2 className="text-4xl font-black tracking-tighter">Ready for <span className="text-primary italic">Combat?</span></h2>
                  <div className="flex flex-col sm:flex-row gap-5">
                     <button className="flex-1 btn btn-primary h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]">
                        Quick Match
                     </button>
                     <button className="flex-1 btn btn-outline border-white/10 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]">
                        Challenge Friend
                     </button>
                  </div>
               </div>
            </div>

            {/* Category Grid */}
            <div className="lg:col-span-3 pt-10">
               <div className="flex items-center gap-3 mb-8">
                  <Search size={18} className="text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Battle Directories</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.map((cat, i) => (
                    <div key={i} className="p-6 bg-base-200/50 border border-white/5 rounded-[2rem] hover:border-primary/40 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-black text-xl tracking-tighter uppercase">{cat.name}</h4>
                            <Zap size={16} className="text-primary group-hover:animate-pulse" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-20">{cat.active} Searchers</p>
                    </div>
                  ))}
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BattleMode;