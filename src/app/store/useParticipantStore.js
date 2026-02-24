"use client";
import { create } from "zustand";
import { axiosInstanceContestService } from "@/app/lib/axios";
import { toast } from "react-toastify";

export const useParticipantStore = create((set, get) => ({
  isRegistered: false,
  isRegistering: false,
  isUnregistering: false,
  participantCount: 0,
  error: null,
  
  // ✅ NEW: User Status State
  myWarnings: 0,
  myStatus: "ACTIVE", // ACTIVE, WARNED, DISQUALIFIED

  // ✅ Actions for Socket Updates
  setWarnings: (count) => set({ myWarnings: count }),
  setStatus: (status) => set({ myStatus: status }),

  // 🔍 Check if user is already registered & Get Status
  async checkRegistration({ contestId, userId }) {
    try {
      const res = await axiosInstanceContestService.get(`contest/contests/${contestId}/check`, {
        params: { userId },
      });

      set({ 
        isRegistered: res.data.isRegistered || false,
        // ✅ Save these from the backend response
        myWarnings: res.data.warnings || 0,
        myStatus: res.data.status || "ACTIVE"
      });

    } catch (err) {
      console.error("Error checking registration:", err);
      set({ error: "Failed to check registration" });
    }
  },

  // ✅ Register for contest
  async register({ contestId, userId, username }) {
    try {
      set({ isRegistering: true, error: null });
      const res = await axiosInstanceContestService.post(`contest/contests/${contestId}/register`, {
        userId, username
      });
      if (res.data.ok) {
        toast.success("Registered successfully!");
        set((state) => ({
          isRegistered: true,
          isRegistering: false,
          participantCount: state.participantCount + 1,
          myWarnings: 0, // Reset on new registration
          myStatus: "ACTIVE"
        }));
      } else {
        toast.error("Failed to register.");
        set({ isRegistering: false });
      }
    } catch (err) {
      console.error("Error registering:", err);
      toast.error(err.response?.data?.error || "Failed to register");
      set({ isRegistering: false, error: "Registration failed" });
    }
  },

  // 🚪 Unregister from contest
  async unregister({ contestId, userId }) {
    try {
      set({ isUnregistering: true, error: null });
      const res = await axiosInstanceContestService.delete(`contest/contests/${contestId}/unregister`, {
        data: { userId },
      });
      if (res.data.ok) {
        toast.info("You have unregistered from this contest.");
        set((state) => ({
          isRegistered: false,
          isUnregistering: false,
          participantCount: Math.max(0, state.participantCount - 1),
          myWarnings: 0,
          myStatus: "ACTIVE"
        }));
      } else {
        toast.error("Failed to unregister.");
        set({ isUnregistering: false });
      }
    } catch (err) {
      console.error("Error unregistering:", err);
      toast.error(err.response?.data?.error || "Failed to unregister");
      set({ isUnregistering: false, error: "Unregistration failed" });
    }
  },

  async fetchParticipantCount(contestId) {
    try {
      const res = await axiosInstanceContestService.get(`contest/contests/${contestId}/participants/count`);
      set({ participantCount: res.data.count || 0 });
    } catch (err) {
      console.error("Error fetching participant count:", err);
    }
  },

  // 🏁 Finish contest early
  async finishContest({ contestId, userId }) {
    try {
      const res = await axiosInstanceContestService.put(`contest/${contestId}/finish`, { userId });
      if (res.data.ok) {
        toast.info("Contest finished successfully.");
        set({ myStatus: "FINISHED" });
      } else {
        toast.error("Failed to finish contest.");
      }
    } catch (err) {
      console.error("Error finishing contest:", err);
      toast.error(err.response?.data?.error || "Failed to finish contest");
    }
  },
}));