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
      console.log(res)
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
  fetchContestById: async (id) => {
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

  /* ---------- Update Contest ---------- */
  updateContest: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstanceContestService.patch(
        `/contest/contests/${id}`,
        data,
        { withCredentials: true }
      );
      if (res?.data?.ok) {
        toast.success("Contest updated successfully");
        // Update in list
        set({
          contests: get().contests.map((c) =>
            c.id === id ? res.data.contest : c
          ),
        });
        // Update single contest if it's loaded
        if (get().contest?.id === id) {
          set({ contest: res.data.contest });
        }
        return true;
      }
      toast.error(res?.data?.error || "Failed to update contest");
      return false;
    } catch (err) {
      console.error("[updateContest error]", err);
      toast.error("Error updating contest");
      set({ error: err.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  /* ---------- Delete Contest ---------- */
  deleteContest: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstanceContestService.delete(
        `/contest/contests/${id}`,
        { withCredentials: true }
      );
      if (res?.data?.ok) {
        toast.success("Contest deleted successfully");
        // Remove from list
        set({ contests: get().contests.filter((c) => c.id !== id) });
        // Clear single contest if it was the deleted one
        if (get().contest?.id === id) {
          set({ contest: null });
        }
        return true;
      }
      toast.error(res?.data?.error || "Failed to delete contest");
      return false;
    } catch (err) {
      console.error("[deleteContest error]", err);
      toast.error("Error deleting contest");
      set({ error: err.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  updateContestStatus: (contestId, newStatus) => {
  set({
    contests: get().contests.map((c) =>
      c.id === contestId ? { ...c, status: newStatus } : c
    ),
    contest: get().contest?.id === contestId
      ? { ...get().contest, status: newStatus }
      : get().contest,
  });
},
}));
