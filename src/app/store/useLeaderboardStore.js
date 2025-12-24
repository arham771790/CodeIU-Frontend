// src/app/store/useLeaderBoardStore.js
import { create } from "zustand";
import { axiosInstanceContestService } from "@/app/lib/axios";
import { getSocket, joinContestRoom } from "@/app/lib/socket";

export const useLeaderboardStore = create((set, get) => ({
  rows: [],
  isLoading: false,
  updatedAt: null,
  source: null,

  fetchLeaderboard: async (contestId, limit = 100) => {
    if (!contestId) return;
    if (get().rows.length === 0) set({ isLoading: true });

    try {
      const res = await axiosInstanceContestService.get(
        `/contest/contests/${contestId}/leaderboard?limit=${limit}`
      );

      if (res.data?.ok) {
        set({
          rows: res.data.rows || [],
          updatedAt: res.data.updatedAt || Date.now(),
          source: res.data.source || null,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      console.error("[fetchLeaderboard] error:", err);
      set({ isLoading: false });
    }
  },

  // call this when opening contest page
  bindRealtime: (contestId) => {
    if (!contestId) return;

    const socket = getSocket();
    joinContestRoom(contestId);

    // prevent duplicate handlers
    socket.off("leaderboard:update");

    let debounceTimer;
    socket.on("leaderboard:update", (payload) => {
      if (payload?.contestId !== contestId) return;

      // Simple debounce: cancel previous, wait 1s
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        get().fetchLeaderboard(contestId);
      }, 1000);
    });
  },

  // optional
  bindTimer: (contestId, onTick) => {
    const socket = getSocket();
    joinContestRoom(contestId);

    socket.off("contest:timer");
    socket.on("contest:timer", (payload) => {
      if (payload?.contestId !== contestId) return;
      if (typeof onTick === "function") onTick(payload);
    });
  },

  unbindRealtime: () => {
    const socket = getSocket();
    socket.off("leaderboard:update");
    socket.off("contest:timer");
  },
}));
