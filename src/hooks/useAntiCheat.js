import { useEffect } from "react";
import { getContestSocket, joinUserRoom } from "@/lib/socket"; // Uses your lib/socket.js
import { useParticipantStore } from "@/store/useParticipantStore";
import { toast } from "react-toastify"; // or react-hot-toast depending on what you use

export const useAntiCheat = (contestId, userId, { isArena = false } = {}) => {
  const { setWarnings, setStatus } = useParticipantStore();

  useEffect(() => {
    if (!contestId || !userId) return;

    const socket = getContestSocket();

    // 1. Private User Room (Specific to Contest Service for DQ)
    if (socket.connected) {
      joinUserRoom(userId);
    } else {
      socket.on("connect", () => joinUserRoom(userId));
    }

    // 2. Define Socket Listeners
    const onWarningUpdate = ({ warnings, maxWarnings }) => {
      console.log(`⚠️ Warning Sync: ${warnings}/${maxWarnings}`);
      setWarnings(warnings);
      
      toast.warn(`Integrity Warning: (${warnings}/${maxWarnings})`, {
        autoClose: 3000,
        toastId: `warning-${warnings}`
      });
    };

    const onContestTerminated = ({ reason, redirect }) => {
      console.error("🛑 Disqualification Signal Received:", reason);
      setStatus("DISQUALIFIED");
      toast.error(reason || "You have been disqualified.");
    };

    socket.on("warning:update", onWarningUpdate);
    socket.on("contest:terminated", onContestTerminated);

    // 3. TRACKING LOGIC (Only if in Arena)
    let hideTimer, blurTimer, resizeTimer;
    
    const emitWarning = (reason) => {
      if (!isArena) return; 
      console.warn(`🚨 [Anti-Cheat Audit] Triggered: ${reason}`);
      socket.emit("warning:trigger", { contestId, reason });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hideTimer = setTimeout(() => emitWarning('Tab switching detected'), 1000); 
      } else if (hideTimer) clearTimeout(hideTimer);
    };

    const handleBlur = () => {
      blurTimer = setTimeout(() => emitWarning('Page focus lost'), 2000);
    };

    const handleFocus = () => {
      if (blurTimer) clearTimeout(blurTimer);
    };

    if (isArena) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleBlur);
      window.addEventListener("focus", handleFocus);
    }

    // 4. Cleanup
    return () => {
      socket.off("warning:update", onWarningUpdate);
      socket.off("contest:terminated", onContestTerminated);
      if (isArena) {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("blur", handleBlur);
        window.removeEventListener("focus", handleFocus);
      }
      if (hideTimer) clearTimeout(hideTimer);
      if (blurTimer) clearTimeout(blurTimer);
    };
  }, [contestId, userId, isArena, setWarnings, setStatus]);
};