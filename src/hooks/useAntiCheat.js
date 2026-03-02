import { useEffect } from "react";
import { getContestSocket, joinUserRoom } from "@/lib/socket"; // Uses your lib/socket.js
import { useParticipantStore } from "@/store/useParticipantStore";
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

    // 4. Enhanced Visibility & Tracking Logic
    let hideTimer;
    let blurTimer;
    let resizeTimer;

    const emitWarning = (reason) => {
      console.warn(`🚨 [Anti-Cheat Audit] Triggered: ${reason} at ${new Date().toISOString()}`);
      socket.emit("warning:trigger", { contestId, reason });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log("👀 [Anti-Cheat] Tab hidden detected.");
        // Wait 1 second before verifying
        hideTimer = setTimeout(() => emitWarning('Tab hidden or minimized'), 1000); 
      } else {
        console.log("👀 [Anti-Cheat] Tab visible.");
        if (hideTimer) clearTimeout(hideTimer);
      }
    };

    const handleBlur = () => {
      console.log("👀 [Anti-Cheat] Window lost focus.");
      // Give them a 2-second grace period for focus changes before warning
      blurTimer = setTimeout(() => emitWarning('Window lost focus'), 2000);
    };

    const handleFocus = () => {
      console.log("👀 [Anti-Cheat] Window gained focus.");
      if (blurTimer) clearTimeout(blurTimer);
    };

    const handleResize = () => {
       // Debounce resize to prevent spamming warnings
       if (resizeTimer) clearTimeout(resizeTimer);
       resizeTimer = setTimeout(() => {
         console.log("👀 [Anti-Cheat] Window resized.");
         emitWarning('Window resized (Possible split-screen)');
       }, 2000);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("resize", handleResize);

    // 5. Cleanup
    return () => {
      socket.off("warning:update", onWarningUpdate);
      socket.off("contest:terminated", onContestTerminated);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("resize", handleResize);
      if (hideTimer) clearTimeout(hideTimer);
      if (blurTimer) clearTimeout(blurTimer);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [contestId, userId, setWarnings, setStatus]);
};