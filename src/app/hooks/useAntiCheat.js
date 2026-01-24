"use client";
import { useEffect, useRef } from "react";
import { axiosInstanceContestService } from "@/app/lib/axios";
import { toast } from "react-toastify";

export function useAntiCheat({ contestId, userId, enabled = true }) {
  const violationsSent = useRef(new Set());

  useEffect(() => {
    if (!enabled || !contestId || !userId) return;

    const sendViolation = async (type, metadata = {}) => {
      // Basic rate limiting/deduplication: don't send the same type in the same second
      const now = Math.floor(Date.now() / 1000);
      const key = `${type}-${now}`;
      
      if (violationsSent.current.has(key)) return;
      violationsSent.current.add(key);

      try {
        const res = await axiosInstanceContestService.post(`contest/contests/${contestId}/violation`, {
          type,
          metadata: { ...metadata, timestamp: Date.now(), url: window.location.href }
        });
        
        if (!res.data.ok) {
           console.error("Failed to report violation:", res.data.error);
        } else {
           // Provide immediate local feedback for awareness
           const readableType = type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
           
           if (type !== "DEVTOOLS_SUSPECTED") {
             toast.warn(`⚠️ Warning: ${readableType} detected. Keep focus on the contest!`, {
               position: "bottom-left",
               autoClose: 4000,
               theme: "dark",
               hideProgressBar: false,
             });
           }
        }
      } catch (err) {
        console.error("Anti-cheat report error:", err.response?.data?.error || err.message);
      }
    };

    // 1. Tab switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        sendViolation("TAB_SWITCH", { state: "hidden" });
      }
    };

    // 2. Window blur (user clicks away from browser)
    const handleBlur = () => {
      sendViolation("WINDOW_BLUR");
    };

    // 3. DevTools detection (basic check by window dimensions)
    const handleResize = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff > threshold || heightDiff > threshold) {
        sendViolation("DEVTOOLS_SUSPECTED", { widthDiff, heightDiff });
      }
    };

    // 4. Paste detection (optional policy enforcement)
    const handlePaste = (e) => {
      const text = e.clipboardData?.getData("text") || "";
      sendViolation("PASTE_DETECTED", { length: text.length });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("resize", handleResize);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("paste", handlePaste);
    };
  }, [contestId, userId, enabled]);
}
