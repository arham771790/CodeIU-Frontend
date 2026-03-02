import { create } from "zustand";
import { axiosInstanceContestService } from "@/lib/axios";
import { toast } from "react-hot-toast"; 

export const useContestStore = create((set, get) => ({
  contests: [],
  contest: null, // ✅ Added this (needed for the Detail Page)
  isLoading: false,
  error: null,

  // ✅ Hydrate store from Server Data (List)
  setContests: (data) => set({ contests: data }),

  // ✅ Hydrate store from Server Data (Single Contest)
  setContest: (data) => set({ contest: data }),

  fetchContests: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstanceContestService.get("/contest/contests");
      if (res?.data?.ok) {
        set({ contests: res.data.contests || [] });
      }
    } catch (err) {
      console.error("Fetch Contests Error:", err);
      toast.error("Failed to fetch contests");
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Re-fetch Single Contest (Needed for Socket updates on the Detail Page)
  fetchContestById: async (id) => {
    try {
      const res = await axiosInstanceContestService.get(`/contest/contests/${id}`, {
        withCredentials: true, // Need cookies to see registered status properly
      });
      if (res?.data?.ok) {
        set({ contest: res.data.contest });
      }
    } catch (err) {
      console.error("Refetch Error:", err);
    }
  },

  createContest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstanceContestService.post(`/contest/contests`, data, {
        withCredentials: true,
      });
      if (res?.data?.ok) {
        toast.success("Contest created successfully");
        // Add to the top of the list
        set({ contests: [res.data.contest, ...get().contests] });
        return true;
      }
      toast.error(res?.data?.error || "Failed to create contest");
      return false;
    } catch (err) {
      console.error("[createContest error]", err);
      toast.error("Error creating contest");
      set({ error: err.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteContest: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstanceContestService.delete(`/contest/contests/${id}`, {
        withCredentials: true 
      });
      if (res?.data?.ok) {
        toast.success("Contest deleted successfully");
        set({ contests: get().contests.filter((c) => c.id !== id) });
        return true;
      }
      toast.error("Failed to delete");
      return false;
    } catch (err) {
        toast.error("Error deleting");
        set({ isLoading: false });
        return false;
    } finally {
        set({ isLoading: false });
    }
  },

  // ✅ Optimized Status Update (Updates both the list AND the single view)
  updateContestStatus: (contestId, newStatus) => {
    set((state) => ({
      // 1. Update the list
      contests: state.contests.map((c) =>
        c.id === contestId ? { ...c, status: newStatus } : c
      ),
      // 2. Update the single view (if currently viewing this contest)
      contest: state.contest?.id === contestId 
        ? { ...state.contest, status: newStatus }
        : state.contest
    }));
  },
}));