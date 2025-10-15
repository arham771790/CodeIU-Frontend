import { create } from "zustand";
import { axiosInstanceContestService } from "@/app/lib/axios";
import { useAuthStore } from "./useAuthStore";
import { toast } from "react-toastify";

export const useContestStore = create((set, get) => ({
  contests: [],
  contest: null,
  isLoading: false,
  error: null,

  /* ---------- Fetch All Contests ---------- */
  fetchContests: async (type = "") => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstanceContestService.get(
        `/contest/contests${type ? `?type=${type}` : ""}`
      );
      if (res?.data?.ok) set({ contests: res.data.contests });
      else toast.error(res?.data?.error || "Failed to fetch contests");
    } catch (err) {
      console.error("[fetchContests error]", err);
      toast.error("Error fetching contests");
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  /* ---------- Fetch One Contest by ID ---------- */
  fetchContest: async (id) => {
    if (!id) return;
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstanceContestService.get(`/contest/contests/${id}`, {
        withCredentials: true,
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      if (res?.data?.ok) set({ contest: res.data.contest });
      else toast.error(res?.data?.error || "Contest not found");
    } catch (e) {
      console.error("[fetchContest]", e);
      toast.error("Error loading contest");
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  /* ---------- Create Contest ---------- */
  createContest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstanceContestService.post(`/contest/contests`, data, {
        withCredentials: true,
      });
      if (res?.data?.ok) {
        toast.success("Contest created successfully");
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
}));
