// src/app/store/useParticipantStore.js
"use client";
import { create } from "zustand";
import { axiosInstanceContestService } from "@/app/lib/axios";
import { toast } from "react-toastify";

export const useParticipantStore = create((set) => ({
  isRegistering: false,
  isRegistered: false,

  register: async ({ contestId, userId }) => {
    if (!contestId || !userId) return false;
    set({ isRegistering: true });
    try {
      // POST /api/v1/contest/participants/:id/register  OR  /contest/:id/register
      // Your controller comment says: POST /contests/:id/register (plural),
      // but routes are mounted at /api/v1/contest. Use this endpoint:
      const res = await axiosInstanceContestService.post(
        `contest/contests/${contestId}/register`,
        { userId },
        { withCredentials: true }
      );
      if (res?.data?.ok) {
        set({ isRegistered: true });
        toast.success("Registered for contest");
        return true;
      }
      toast.error(res?.data?.error || "Register failed");
      return false;
    } catch (e) {
      console.error("[registerParticipant]", e);
      toast.error(e?.response?.data?.error || "Register failed");
      return false;
    } finally {
      set({ isRegistering: false });
    }
  },
}));
