// src/app/store/useBundleStore.js
"use client";
import { create } from "zustand";
import { axiosInstanceContestService } from "@/app/lib/axios";
import { toast } from "react-toastify";

export const useBundleStore = create((set) => ({
  bundle: null,
  isLoading: false,

  // Admin: attach exactly 4 problems
  attachFrozen: async ({ contestId, problems }) => {
    try {
      set({ isLoading: true });
      // Controller: attachFrozenProblems(req,res) expects params.id and body { problems: [...] }
      // We'll call POST /contest/:id/bundle/frozen
      const res = await axiosInstanceContestService.post(
        `contest/contests/${contestId}/bundle/frozen`,
        { problems },
        { withCredentials: true }
      );
      if (res?.data?.ok) {
        toast.success("Problems attached");
        return true;
      }
      toast.error(res?.data?.error || "Attach failed");
      return false;
    } catch (e) {
      console.error("[attachFrozen]", e);
      toast.error(e?.response?.data?.error || "Attach failed");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Participant: get bundle if registered (needs userId)
  fetchBundle: async ({ contestId, userId }) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstanceContestService.get(
        `contest/contests/${contestId}/bundle?userId=${encodeURIComponent(userId)}`,
        { withCredentials: true }
      );
      if (res?.data?.ok) {
        set({ bundle: res.data.data });
      } else {
        set({ bundle: null });
      }
    } catch (e) {
      console.error("[fetchBundle]", e);
      set({ bundle: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
