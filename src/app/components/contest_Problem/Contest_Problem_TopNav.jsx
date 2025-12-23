"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Play,
  CloudDownload,
  Timer,
  Loader2,
} from "lucide-react";

import { useSubmissionStore } from "@/app/store/useSubmissionStore";
import { getSocket, joinContestRoom } from "@/app/lib/socket";

function pad2(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function formatHMS(totalSec) {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(r)}`;
}

/**
 * Compute timer state from timestamps
 * - before start: starts in
 * - running: ends in
 * - ended: ended
 */
function computeTimer({ startsAt, endsAt }) {
  const now = Date.now();
  const start = startsAt ? new Date(startsAt).getTime() : null;
  const end = endsAt ? new Date(endsAt).getTime() : null;

  if (!start || !end) {
    return { label: "Timer", value: "--:--:--", phase: "unknown" };
  }

  if (now < start) {
    return {
      label: "Starts in",
      value: formatHMS((start - now) / 1000),
      phase: "upcoming",
    };
  }

  if (now >= start && now < end) {
    return {
      label: "Ends in",
      value: formatHMS((end - now) / 1000),
      phase: "running",
    };
  }

  return { label: "Ended", value: "00:00:00", phase: "ended" };
}

const Contest_Problem_TopNav = ({
  problems = [],
  activeIndex = 0,
  onProblemChange,
  contestId,
  startsAt, // optional fallback
  endsAt,   // optional fallback
}) => {
  const [isProblemListOpen, setIsProblemListOpen] = useState(false);

  const dropdownRef = useRef(null);

  const {
    userCode,
    runCode,
    isexecuting,
    languageId,
    submitCode,
    isSubmittingCode,
  } = useSubmissionStore();

  const currentProblem = problems?.[activeIndex];
  const visibleTestCase = currentProblem?.snapshot?.testcases;

  // ----- Timer state -----
  const [timerState, setTimerState] = useState(() =>
    computeTimer({ startsAt, endsAt })
  );

  // Local fallback timer tick (only if startsAt/endsAt given)
  useEffect(() => {
    if (!startsAt || !endsAt) return;
    const t = setInterval(() => {
      setTimerState(computeTimer({ startsAt, endsAt }));
    }, 1000);
    return () => clearInterval(t);
  }, [startsAt, endsAt]);

  // Optional: Socket timer (if backend emits `contest:timer`)
  useEffect(() => {
    if (!contestId) return;

    const socket = getSocket();
    joinContestRoom(contestId);

    const onTick = (payload) => {
      // payload example:
      // { contestId, phase: "running", secondsLeft: 1234, label: "Ends in" }
      if (payload?.contestId !== contestId) return;

      if (typeof payload?.secondsLeft === "number") {
        const label = payload?.label || "Timer";
        setTimerState({
          label,
          value: formatHMS(payload.secondsLeft),
          phase: payload.phase || "unknown",
        });
      }
    };

    socket.on("contest:timer", onTick);
    return () => socket.off("contest:timer", onTick);
  }, [contestId]);

  // Close dropdown on outside click / ESC
  useEffect(() => {
    const onDocClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setIsProblemListOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setIsProblemListOpen(false);
    };

    if (isProblemListOpen) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isProblemListOpen]);

  const handleRunCode = async (e) => {
    e.preventDefault();
    if (!currentProblem) return;

    try {
      const sourceCode = userCode || "";
      const stdin = visibleTestCase?.map((t) => t.input) || [];
      const expected_output = visibleTestCase?.map((t) => t.output) || [];

      await runCode(sourceCode, stdin, languageId, expected_output);
    } catch (error) {
      console.log("[TopNav] run error:", error);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (!currentProblem) return;

    try {
      const sourceCode = userCode || "";
      await submitCode(sourceCode, languageId, currentProblem?.snapshot?.id, contestId);
    } catch (error) {
      console.log("[TopNav] submit error:", error);
    }
  };

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < problems.length - 1;

  const timerBadgeClass = useMemo(() => {
    if (timerState.phase === "running") return "bg-green-700/80 border-green-500/30";
    if (timerState.phase === "upcoming") return "bg-blue-700/70 border-blue-500/30";
    if (timerState.phase === "ended") return "bg-red-700/70 border-red-500/30";
    return "bg-[#26649e] border-white/10";
  }, [timerState.phase]);

  return (
    <nav className="bg-[#0e0e0e] text-gray-300 px-4 py-2 flex items-center justify-between border-b border-white/10">
      {/* Left: Brand + Problem list + Prev/Next */}
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="text-xl font-bold text-white select-none">
          CodeIU
        </h1>

        {/* Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProblemListOpen((v) => !v)}
            className="flex items-center gap-2 hover:bg-zinc-800 px-2 py-1.5 rounded-md"
          >
            <List className="w-5 h-5" />
            <span className="font-medium">Problem List</span>
          </button>

          {isProblemListOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-[#1f1f1f] border border-gray-700 rounded-md shadow-lg z-50 overflow-hidden">
              <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-800">
                Select a problem
              </div>

              <div className="max-h-72 overflow-auto">
                {problems.map((problem, index) => {
                  const label = String.fromCharCode(
                    65 + (problem.order ?? index)
                  );
                  const title = problem.snapshot?.title || "Untitled";
                  const isActive = index === activeIndex;

                  return (
                    <button
                      type="button"
                      key={problem.id || index}
                      onClick={() => {
                        onProblemChange?.(index);
                        setIsProblemListOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm truncate
                        ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-zinc-800"}`}
                    >
                      {label}: {title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Prev/Next */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onProblemChange?.(Math.max(0, activeIndex - 1))}
            className="hover:bg-zinc-800 p-1 rounded disabled:opacity-40 disabled:hover:bg-transparent"
            disabled={!canPrev}
            title="Previous problem"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onProblemChange?.(Math.min(problems.length - 1, activeIndex + 1))}
            className="hover:bg-zinc-800 p-1 rounded disabled:opacity-40 disabled:hover:bg-transparent"
            disabled={!canNext}
            title="Next problem"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right: Run/Submit + Timer */}
      <div className="flex items-center gap-3">
        {/* Run */}
        <button
          type="button"
          className="bg-[#f0b83f] hover:bg-yellow-500 text-white font-semibold px-3 py-1.5 rounded-md flex items-center gap-2 text-sm disabled:opacity-60"
          onClick={handleRunCode}
          disabled={isexecuting || isSubmittingCode}
        >
          {isexecuting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>Run</span>
        </button>

        {/* Submit */}
        <button
          type="button"
          className="bg-[#238636] hover:bg-green-700 text-white font-semibold px-3 py-1.5 rounded-md flex items-center gap-2 text-sm disabled:opacity-60"
          onClick={handleSubmitCode}
          disabled={isexecuting || isSubmittingCode}
        >
          {isSubmittingCode ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <CloudDownload className="w-4 h-4" />
          )}
          <span>Submit</span>
        </button>

        {/* Timer */}
        <div
          className={`px-3 py-1.5 rounded-md border ${timerBadgeClass} flex items-center gap-2`}
          title="Contest timer"
        >
          <Timer className="w-4 h-4" />
          <div className="leading-tight">
            <div className="text-[10px] text-white/80">{timerState.label}</div>
            <div className="text-sm font-semibold text-white tabular-nums">
              {timerState.value}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Contest_Problem_TopNav;
