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

export function useContestTimer(contest) {
  const [serverOffset, setServerOffset] = useState(0);
  const [timerState, setTimerState] = useState({
    label: "Loading...",
    value: "--:--:--",
    phase: "unknown", // upcoming | running | ended | unknown
  });

  const requestRef = useRef();

  useEffect(() => {
    const socket = getContestSocket();

    // 1. Listen for sync response
    const onSync = ({ serverTime }) => {
      if (serverTime) {
        const offset = serverTime - Date.now();
        setServerOffset(offset);
        // console.log("[useContestTimer] Synced. Offset:", offset, "ms");
      }
    };

    socket.on("timer:sync", onSync);

    // 2. Request time
    socket.emit("get:time");

    return () => {
      socket.off("timer:sync", onSync);
    };
  }, []);

  // 3. Animation Loop
  useEffect(() => {
    if (!contest) return;

    const animate = () => {
      const now = Date.now() + serverOffset;
      const start = new Date(contest.startsAt).getTime();
      const end = new Date(contest.endsAt).getTime();

      let newState = { label: "Timer", value: "00:00:00", phase: "unknown" };

      if (now < start) {
        newState = {
          label: "Starts in",
          value: formatHMS((start - now) / 1000),
          phase: "upcoming",
        };
      } else if (now >= start && now < end) {
        newState = {
          label: "Ends in",
          value: formatHMS((end - now) / 1000),
          phase: "running",
        };
      } else {
        newState = {
          label: "Ended",
          value: "00:00:00",
          phase: "ended",
        };
      }

      setTimerState(newState);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [contest, serverOffset]);

  return timerState;
}
