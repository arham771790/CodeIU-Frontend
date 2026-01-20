"use client";
import React, { useEffect, useState } from "react";
import {
  PlayCircle,
  Bookmark,
  Star,
  ChevronRight,
  Lock,
  Cpu,
  Globe,
  Zap,
  Compass,
  Code2,
  Terminal,
} from "lucide-react";
import GridHighlights from "@/app/components/GridHighlights";

// --- Mock Data ---
const courses = {
  interview: [
    {
      title: "Top Questions from Facebook",
      gradient: "from-blue-600 to-blue-800",
      chapters: 7,
      items: 75,
      progress: 0,
      isPremium: true,
    },
    {
      title: "Crack the Coding Interview",
      gradient: "from-orange-500 to-red-600",
      chapters: 12,
      items: 150,
      progress: 0,
    },
    {
      title: "Data Structures: Advanced",
      gradient: "from-indigo-500 to-purple-700",
      chapters: 8,
      items: 92,
      progress: 0,
    },
    {
      title: "Get Well Prepared for Amazon",
      gradient: "from-yellow-500 to-orange-400",
      chapters: 10,
      items: 110,
      progress: 0,
      isPremium: true,
    },
  ],
  // NEW: Dummy Problem Sets
  problemSets: [
    {
      title: "Mastering Recursion",
      author: "By CodeIU",
      total: 25,
      type: "Logic",
    },
    {
      title: "Graph Theory X",
      author: "By CodeIU",
      total: 15,
      type: "Advanced",
    },
    { title: "Bit Manipulation", author: "By CodeIU", total: 20, type: "Math" },
  ],
};

// --- Reusable Components ---

const CourseCard = ({ course }) => (
  <div className="relative flex-shrink-0 w-72 h-44 rounded-[2rem] overflow-hidden group border border-base-content/10 bg-base-200 shadow-2xl transition-all duration-500 hover:-translate-y-2">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-20 group-hover:opacity-40 transition-opacity`}
    />
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="relative h-full flex flex-col justify-between p-6 z-10">
      <div>
        <h3 className="font-black text-lg text-base-content tracking-tight leading-tight">
          {course.title}
        </h3>
        <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest opacity-40 mt-2">
          <span>{course.chapters} Chapters</span>
          <span>{course.items} Items</span>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full bg-base-content/5 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(var(--p),0.5)]"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-black opacity-30 uppercase tracking-tighter">
            Roadmap Sync
          </span>
          <span className="text-[10px] font-black text-primary uppercase">
            {course.progress}%
          </span>
        </div>
      </div>

      {/* Locked Overlay */}
      <div className="absolute inset-0 bg-base-300/60 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-100 group-hover:backdrop-blur-none transition-all duration-500">
        <div className="w-12 h-12 bg-base-100 rounded-2xl flex items-center justify-center shadow-2xl border border-base-content/10">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <span className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-primary opacity-80">
          Sector Locked
        </span>
      </div>
    </div>
  </div>
);

// NEW: Locked Problem Set Card (No Blur, 40% Opacity)
const LockedProblemCard = ({ set }) => (
  <div className="relative flex-shrink-0 w-72 h-44 rounded-[2rem] overflow-hidden group border border-dashed border-base-content/20 bg-base-100/50 flex flex-col justify-between p-6">
    {/* 40% Opacity Content - No Blur */}
    <div className="opacity-40 transition-opacity group-hover:opacity-60">
      <div className="flex justify-between items-start">
        <h3 className="font-black text-xl text-base-content leading-tight max-w-[70%]">
          {set.title}
        </h3>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Terminal size={14} className="opacity-50" />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
          {set.type} Directory
        </span>
      </div>
    </div>

    <div className="flex justify-between items-end opacity-40">
      <span className="text-[9px] font-black uppercase tracking-widest italic">
        {set.author}
      </span>
      <Code2 className="text-primary" size={24} />
    </div>

    {/* Absolute Centered Lock - Sharp visibility */}
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
      <div className="w-10 h-10 bg-base-200 border border-primary/30 rounded-xl flex items-center justify-center shadow-xl">
        <Lock size={18} className="text-primary" />
      </div>
      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary mt-2">
        Coming Soon
      </span>
    </div>
  </div>
);

const CourseSection = ({ title, children }) => (
  <section className="relative">
    <div className="flex justify-between items-end mb-8">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--p),0.5)]" />
        <h2 className="text-2xl font-black uppercase tracking-tight text-base-content">
          {title} <span className="opacity-20">Modules</span>
        </h2>
      </div>
      <button className="btn btn-ghost btn-xs gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-primary transition-all">
        View All <ChevronRight className="w-3 h-3" />
      </button>
    </div>
    <div className="flex gap-8 pb-6 -mx-4 px-4 overflow-x-auto custom-scrollbar">
      {children}
    </div>
  </section>
);

const ExplorePage = () => {
  return (
    <div className="min-h-screen bg-base-300 text-base-content font-sans overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-20 pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-[100vh] [mask-image:linear-gradient(to_bottom,black_40%,transparent)] pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <GridHighlights />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <header className="relative z-10 text-center mb-10 py-12 md:py-24">
          {/* 1. THE CONSTANT BACKGROUND GLOW (Title Aura) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-primary/60 blur-[100px] rounded-full animate-pulse pointer-events-none" />

          <div className="flex flex-col items-center relative z-10">
            {/* 2. THE TITLE */}
            <h1 className="relative text-5xl md:text-7xl font-black tracking-tighter mb-4 flex items-center justify-center">
              <span className="text-base-content">Explore</span>

              {/* WE NEST THE ICON INSIDE THIS RELATIVE SPAN TO ANCHOR IT TO THE X */}
              <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-primary/60 mx-4 animate-pulse">
                X{/* 3. POSITIONED COMPASS CONTAINER */}
                {/* Using -top-6/7 so it appears to touch the X at the bottom of the bounce */}
                <div className="absolute -top-6 -right-5 md:-top-7 md:-right-6 flex items-end pointer-events-none">
                  <div className="relative p-2 bg-base-200 border-2 border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(var(--p),0.5)] animate-bounce">
                    {/* Internal Pulsing Glow */}
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse pointer-events-none" />

                    {/* Rotating Dashed Orbit */}
                    <div className="absolute inset-[-8px] border border-dashed border-primary/40 rounded-full animate-[spin_10s_linear_infinite] opacity-50" />

                    {/* The Icon */}
                    <Compass className="text-primary w-5 h-5 md:w-6 md:h-6 relative z-10 drop-shadow-[0_0_8px_rgba(var(--p),0.8)]" />
                  </div>
                </div>
              </span>
            </h1>

            {/* 4. SUBTITLE & NEON UNDERLINE */}
            <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mt-2">
              Explore our latest collection.
            </p>

            <div className="h-1.5 w-24 bg-primary mt-6 rounded-full shadow-[0_0_20px_rgba(var(--p),0.6)] mx-auto" />
          </div>
        </header>

        <div className="space-y-24">
          {/* Interview Modules */}
          <CourseSection title="Interview">
            {courses.interview.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </CourseSection>

          {/* NEW: Problem Sets (Locked, 40% Opacity, No Blur) */}
          <CourseSection title="Problem Sets">
            {courses.problemSets.map((set, index) => (
              <LockedProblemCard key={index} set={set} />
            ))}
          </CourseSection>

          <div className="flex flex-col items-center justify-center py-20 border-t border-base-content/5">
            <div className="flex items-center gap-3 mb-4 opacity-20">
              <Zap size={20} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.5em]">
                Future Updates
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-base-content opacity-10 uppercase tracking-tighter">
              Coming soon...
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;