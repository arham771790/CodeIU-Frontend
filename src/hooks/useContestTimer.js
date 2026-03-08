import { useState, useEffect, useRef } from "react";
import { getContestSocket } from "@/lib/socket";

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

function computeTimerState(contest, serverOffset) {
  const now = Date.now() + serverOffset;
  const start = new Date(contest.startsAt).getTime();
  const end = new Date(contest.endsAt).getTime();

  if (now < start) {
    return { label: "Starts in", value: formatHMS((start - now) / 1000), phase: "upcoming" };
  } else if (now >= start && now < end) {
    return { label: "Ends in", value: formatHMS((end - now) / 1000), phase: "running" };
  } else {
    return { label: "Ended", value: "00:00:00", phase: "ended" };
  }
}

export function useContestTimer(contest) {
  const [serverOffset, setServerOffset] = useState(0);
  const [timerState, setTimerState] = useState({
    label: "Loading...",
    value: "--:--:--",
    phase: "unknown",
  });

  const intervalRef = useRef();

  // Sync server time via socket
  useEffect(() => {
    const socket = getContestSocket();

    const onSync = ({ serverTime }) => {
      if (serverTime) {
        setServerOffset(serverTime - Date.now());
      }
    };

    socket.on("timer:sync", onSync);
    socket.emit("get:time");

    return () => {
      socket.off("timer:sync", onSync);
    };
  }, []);

  // 1-second interval instead of requestAnimationFrame (60fps → 1fps = 98% less CPU)
  useEffect(() => {
    if (!contest) return;

    // Compute immediately for first render
    setTimerState(computeTimerState(contest, serverOffset));

    intervalRef.current = setInterval(() => {
      const newState = computeTimerState(contest, serverOffset);
      setTimerState(newState);

      // Auto-clear interval if contest ended
      if (newState.phase === "ended" && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [contest, serverOffset]);

  return timerState;
}
