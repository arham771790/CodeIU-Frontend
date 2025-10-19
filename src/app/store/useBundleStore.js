"use client";
import { create } from "zustand";
import { axiosInstanceContestService } from "@/app/lib/axios";
import { toast } from "react-hot-toast";

export const useBundleStore = create((set) => ({
  bundle: null,
  isLoading: false,

  /* ----------------------------- Attach Problems ----------------------------- */
  attachInlineProblems: async ({ contestId, problems }) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstanceContestService.post(
        `/contest/contests/${contestId}/bundle/attach-inline`,
        { problems },
        { withCredentials: true }
      );

      if (res?.data?.ok) {
        toast.success("✅ Problems successfully attached to contest.");
        return true;
      }

      toast.error(res?.data?.error || "❌ Failed to attach problems.");
      return false;
    } catch (e) {
      console.error("[attachInlineProblems]", e);
      const status = e?.response?.status;
      const payload = e?.response?.data;

      if (status === 401) toast.error("You are not logged in.");
      else if (status === 403) toast.error("Only admins can attach problems.");
      else if (status === 400 && Array.isArray(payload?.details)) {
        const first = payload.details[0];
        const path = first?.path?.join(".") || "";
        const msg = first?.message || "Validation failed";
        toast.error(`Validation Error: ${path ? `${path}: ` : ""}${msg}`);
      } else {
        toast.error(payload?.error || "Unexpected error while attaching problems.");
      }

      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  /* ------------------------------- Fetch Bundle ------------------------------ */
  fetchBundle: async ({ contestId, userId }) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstanceContestService.get(
        `/contest/contests/${contestId}/bundle?userId=${encodeURIComponent(userId)}`,
        { withCredentials: true }
      );

      if (res?.data?.ok) {
        set({ bundle: res.data.data });
        toast.success("Contest problems loaded successfully.");
        return res.data.data;
      }

      set({ bundle: null });
      toast.error(res?.data?.error || "Failed to load contest problems.");
      return null;
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.error;

      if (status === 404 && code === "bundle_not_ready") {
        toast.error("⚠️ Problems not yet attached to this contest.");
      } else if (status === 403 && code === "not_registered") {
        toast.error("🚫 You must register to view this contest’s problems.");
      } else if (status === 401) {
        toast.error("You must log in to access contest problems.");
      } else {
        console.error("[fetchBundle]", err);
        toast.error("Failed to fetch contest problems. Please try again.");
      }

      set({ bundle: null });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  clearBundle: () => set({ bundle: null }),
}));
