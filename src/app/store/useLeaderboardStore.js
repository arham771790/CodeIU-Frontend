import { create } from "zustand";
import { axiosInstanceContestService } from "@/app/lib/axios";
import { io } from 'socket.io-client';

export const useLeaderboardStore = create((set, get) => ({
  rows: [],
  isLoading: false,
  updatedAt: null,
  socket: null, // Store the socket instance here

  fetchLeaderboard: async (contestId, limit = 100) => {
    // Don't trigger loading spinner on background updates (when rows already exist)
    if (get().rows.length === 0) set({ isLoading: true });
    
    try {
      const res = await axiosInstanceContestService.get(`contest/contests/${contestId}/leaderboard`);
      set({ 
          rows: res.data.rows, 
          updatedAt: Date.now(), 
          isLoading: false 
      });
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      set({ isLoading: false });
    }
  },

  initializeSocket: (contestId) => {
    let socket = get().socket;

    // 1. Connect if not exists
    if (!socket) {
      socket = io("http://localhost:8080", {
        withCredentials: true,
        transports: ['websocket', 'polling'] // Force stability
      });

      socket.on("connect", () => {
        console.log("✅ Leaderboard Socket connected:", socket.id);
        // Emit join event immediately on connect
        if (contestId) socket.emit("join:contest", contestId);
      });

      // 2. Listen for updates
      // NOTE: Changed 'leaderboard:update' to 'leaderboard-update' to match your Submission Store
      socket.on("leaderboard-update", (data) => {
        console.log("📈 Live leaderboard update received:", data);
        
        // OPTION A: If the socket sends the full data, use it directly (Faster)
        if (data.rows) {
             set({ 
                 rows: data.rows, 
                 updatedAt: Date.now() 
             });
        } 
        // OPTION B: Fallback to fetching (Reliable)
        else {
             get().fetchLeaderboard(contestId);
        }
      });

      set({ socket });
    }

    // 3. CRITICAL: Always ensure we join the contest room on function call
    // This handles the client-side navigation issue
    if (socket && socket.connected && contestId) {
        console.log(`Joining contest room: ${contestId}`);
        socket.emit("join:contest", contestId);
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log("Leaderboard socket disconnected");
    }
  },
}));