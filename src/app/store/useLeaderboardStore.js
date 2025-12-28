import { create } from "zustand";
import { getSocket, joinContestRoom } from "@/app/lib/socket";
import { refreshLeaderboardAction } from "@/actions/leaderboardBridge";

export const useLeaderboardStore = create((set, get) => ({
  rows: [],
  isLoading: false,
  updatedAt: null,
  source: null,

  // ✅ Hydrate from Server Page (Instant Load)
  setInitialLeaderboard: (data) => set({
    rows: data.rows,
    updatedAt: data.updatedAt,
    source: data.source,
    isLoading: false
  }),

  // ✅ Refresh using Server Action (Called by Socket)
  refreshLeaderboard: async (contestId) => {
    // Only set loading if rows are empty (prevent UI flicker on live updates)
    if (get().rows.length === 0) set({ isLoading: true });

    try {
      const res = await refreshLeaderboardAction(contestId);
      if (res.ok) {
        set({
          rows: res.rows,
          updatedAt: res.updatedAt,
          source: res.source,
          isLoading: false,
        });
      }
    } catch (err) {
      console.error("Leaderboard refresh error:", err);
      set({ isLoading: false });
    }
  },

  bindRealtime: (contestId) => {
    if (!contestId) return;
    const socket = getSocket();
    joinContestRoom(contestId);

    socket.off("leaderboard:update");

    let debounceTimer;
    socket.on("leaderboard:update", (payload) => {
      if (payload?.contestId !== contestId) return;
      
      console.log("⚡ Leaderboard Update Signal Received");

      // Debounce to prevent spamming the server if 10 users submit at once
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        get().refreshLeaderboard(contestId);
      }, 1000); 
    });
  },

  unbindRealtime: () => {
    const socket = getSocket();
    socket.off("leaderboard:update");
  },
}));