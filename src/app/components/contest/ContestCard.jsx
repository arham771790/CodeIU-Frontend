"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSocket, joinContestRoom } from "@/app/lib/socket";
import { Calendar, LayoutGrid } from "lucide-react";

function calcStartsIn(startsAt) {
  const diff = +new Date(startsAt) - +new Date();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function ContestCard({ contest }) {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(() => calcStartsIn(contest.startsAt));
  const [status, setStatus] = useState(contest.status);

  // ✅ Always sync local status if props change (important!)
  useEffect(() => {
    setStatus(contest.status);
  }, [contest.status]);

  // Countdown timer
  useEffect(() => {
    const tick = () => setTimeLeft(calcStartsIn(contest.startsAt));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [contest.startsAt]);

  // Socket listener for status updates
  useEffect(() => {
    const socket = getSocket();
    joinContestRoom(contest.id);

    const handler = ({ contestId, newStatus }) => {
      if (contestId === contest.id) setStatus(newStatus);
    };

    socket.on("contestStatusUpdated", handler);
    return () => socket.off("contestStatusUpdated", handler);
  }, [contest.id]);

  const formatTime = useMemo(() => {
    if (status === "RUNNING") return "Contest Running!";
    if (status === "FROZEN") return "Leaderboard Frozen";
    if (status === "ENDED") return "Contest Ended!";
    if (!timeLeft) return "Starting soon…";

    const parts = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
    if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}m`);
    parts.push(`${timeLeft.seconds}s`);
    return `Starts in ${parts.slice(0, 3).join(" ")}`;
  }, [status, timeLeft]);

  const handleClick = () => {
    router.push(`/contest/${contest.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-base-200 border border-base-content/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
    >
      {/* Header Visual */}
      <div className="relative h-44 bg-gradient-to-br from-base-300 to-base-100 overflow-hidden">
        {/* Animated background shape */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
        
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-wider">
              <div className={`w-2 h-2 rounded-full animate-pulse ${status === "RUNNING" ? "bg-success" : "bg-warning"}`} />
              {status}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white/90 font-mono text-sm bg-black/20 backdrop-blur-sm w-fit px-3 py-1.5 rounded-lg border border-white/5">
             <Calendar size={14} className="text-primary" />
             {formatTime}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors line-clamp-1">
          {contest.title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-base-content/50 font-medium">
            {new Date(contest.startsAt).toLocaleDateString()} • {new Date(contest.startsAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
          <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-content transition-all">
             <LayoutGrid size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
