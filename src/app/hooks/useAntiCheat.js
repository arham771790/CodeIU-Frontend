import { useEffect } from "react";
import { getContestSocket, joinUserRoom } from "@/app/lib/socket"; // Uses your lib/socket.js
import { useParticipantStore } from "@/app/store/useParticipantStore";
import { toast } from "react-toastify"; // or react-hot-toast depending on what you use

export const useAntiCheat = (contestId, userId) => {
  const { setWarnings, setStatus } = useParticipantStore();

  useEffect(() => {
    if (!contestId || !userId) return;

    const socket = getContestSocket();

    // 1. Join User Room (Specific to Contest Service)
    // We do this to ensure we receive private events like disqualification
    if (socket.connected) {
        joinUserRoom(userId);
    } else {
        socket.on("connect", () => joinUserRoom(userId));
    }

    // 2. Define Listeners
    const onWarningUpdate = ({ warnings, maxWarnings }) => {
      console.log(`⚠️ Warning Update: ${warnings}/${maxWarnings}`);
      setWarnings(warnings);
      
      // Optional: Show toast
      toast.warn(`Warning: Tab switching detected! (${warnings}/${maxWarnings})`, {
        autoClose: 3000,
        toastId: "warning-toast" // Prevents duplicates
      });
    };

    const onContestTerminated = ({ reason, redirect }) => {
      console.error("🛑 Contest Terminated:", reason);
      toast.error(reason || "You have been disqualified.");
      setStatus("DISQUALIFIED"); // Lock the UI immediately
      
      // Force redirect after delay
      setTimeout(() => {
        if (typeof window !== "undefined" && redirect) {
            window.location.href = redirect;
        }
      }, 2000);
    };

    // 3. Attach Listeners
    socket.on("warning:update", onWarningUpdate);
    socket.on("contest:terminated", onContestTerminated);

    // 4. Visibility Detection Logic
    let timer;

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // Wait 1 second before verifying
      timer = setTimeout(() => {
         socket.emit("warning:trigger", { contestId });
      }, 1000); 
    } else {
      // If they come back instantly, clear the timer (No Warning)
      if (timer) clearTimeout(timer);
    }
  };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 5. Cleanup
    return () => {
      socket.off("warning:update", onWarningUpdate);
      socket.off("contest:terminated", onContestTerminated);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [contestId, userId, setWarnings, setStatus]);
};