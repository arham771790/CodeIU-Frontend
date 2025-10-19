"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSocket } from "@/app/lib/socket"; // your singleton socket instance

export default function ContestCard({ contest }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState(contest.status); // SCHEDULED / RUNNING / ENDED

  // Countdown timer
  useEffect(() => {
    const calc = () => {
      const diff = +new Date(contest.startsAt) - +new Date();
      if (diff <= 0) return null;
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calc());
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, [contest.startsAt]);

  // Socket listener for status updates
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join:contest", { contestId: contest.id });

    const handler = ({ contestId, newStatus }) => {
      if (contestId === contest.id) {
        setStatus(newStatus);
      }
    };

    socket.on("contestStatusUpdated", handler);
    return () => socket.off("contestStatusUpdated", handler);
  }, [contest.id]);

  const formatTime = () => {
    if (status === "RUNNING") return "Contest Running!";
    if (status === "ENDED") return "Contest Ended!";
    if (!timeLeft) return "Starting soon…";

    const parts = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
    if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}m`);
    parts.push(`${timeLeft.seconds}s`);
    return `Starts in ${parts.slice(0, 3).join(" ")}`;
  };

  const handleClick = () => {
    router.push(`/contest/${contest.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#1e1e1e] border border-gray-700/50 rounded-lg shadow-lg overflow-hidden 
                  transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                  hover:shadow-blue-500/20 group cursor-pointer"
    >
      <div className="relative h-40 bg-gradient-to-b from-[#020d2e] to-black">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col justify-between h-full p-4 text-white">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatTime()}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-900">
        <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-300 transition-colors">
          {contest.title}
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {new Date(contest.startsAt).toLocaleString()} - {status}
        </p>
      </div>
    </div>
  );
}
