import { getSocket, disconnectSocket } from "@/app/lib/socket";
import { axiosInstanceContestService } from "@/app/lib/axios";
import  {create} from "zustand"
export const useLeaderboardStore = create((set, get) => ({
  rows: [],
  isLoading: false,
  updatedAt: null,

  fetchLeaderboard: async (contestId, limit = 100) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstanceContestService.get(`contest/contests/${contestId}/leaderboard`);
      set({ rows: res.data.rows, updatedAt: Date.now(), isLoading: false });
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      set({ isLoading: false });
    }
  },

  initializeSocket: (contestId) => {
    const socket = getSocket(contestId);

    socket.on("leaderboard:update", (data) => {
      console.log("📈 Live leaderboard update received:", data);
      get().fetchLeaderboard(data.contestId);
    });
  },

  disconnectSocket: () => {
    disconnectSocket();
  },
}));
