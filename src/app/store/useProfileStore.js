import { create } from "zustand";
import { axiosInstanceSubmissionService } from "@/app/lib/axios";

export const useProfileStore = create((set) => ({
  stats: {
    solved: { total: 0, easy: 0, medium: 0, hard: 0 },
    totalQuestions: { total: 0, easy: 0, medium: 0, hard: 0 },
    percentage: 0,
  },
  activityData: [],
  activities: [],
  isLoadingStats: false,
  isLoadingActivity: false,

  fetchProfileData: async (userId) => {
    if (!userId) return;
    try {
      set({ isLoadingStats: true });
      const res = await axiosInstanceSubmissionService.get(`submission/users/${userId}/stats`);
      
      if (res.data.ok) {
        set({
          stats: res.data.stats,
          activityData: res.data.activityData,
        });
      }
    } catch (err) {
      console.error("Error fetching profile stats:", err);
    } finally {
      set({ isLoadingStats: false });
    }
  },

  fetchRecentSubmissions: async (userId) => {
    if (!userId) return;
    try {
      set({ isLoadingActivity: true });
      const res = await axiosInstanceSubmissionService.get(`submission/users/${userId}/submissions`);
      
      if (res.data.ok) {
        set({ activities: res.data.submissions });
      }
    } catch (err) {
      console.error("Error fetching recent submissions:", err);
    } finally {
      set({ isLoadingActivity: false });
    }
  },
}));
