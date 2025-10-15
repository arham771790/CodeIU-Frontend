  // src/app/store/useContestStore.js
  import { create } from "zustand";
  import { axiosInstanceContestService } from "@/app/lib/axios";
  import { useAuthStore } from "./useAuthStore";
  import { toast } from "react-toastify";

  export const useContestStore = create((set, get) => ({
    contests: [],
    currentContest: null,
    isLoading: false,
    error: null,

    /* ---------- Fetch All Contests ---------- */
    fetchContests: async (type = "") => {
  set({ isLoading: true, error: null });
  try {
    const res = await axiosInstanceContestService.get(
      `/contest/contests${type ? `?type=${type}` : ""}`
    );
    if (res?.data?.ok) {
      set({ contests: res.data.contests });
    } else {
      toast.error(res?.data?.error || "Failed to fetch contests");
    }
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
        const res = await axiosInstanceContestService.get(`/contest/${id}`);
        if (res?.data?.ok) {
          set({ currentContest: res.data.contest });
        } else {
          toast.error(res?.data?.error || "Contest not found");
        }
      } catch (err) {
        console.error("[fetchContestById error]", err);
        toast.error("Error fetching contest");
        set({ error: err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    /* ---------- Create Contest ---------- */
    createContest: async (data) => {
  set({ isLoading: true, error: null });
  try {
    const token = useAuthStore.getState().token;
    
     // ⬅️ get the admin JWT
    console.log("Token being sent:", token);
console.log("Data being sent:", data);

    const res = await axiosInstanceContestService.post(
      "/contest/contests",
      data,
      {
        withCredentials:true
      }
    );

    if (res?.data?.ok) {
      toast.success("Contest created successfully");
      set({ contests: [res.data.contest, ...get().contests] });
      return true;
    } else {
      toast.error(res?.data?.error || "Failed to create contest");
      return false;
    }
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
    updateContest: async (id, updates) => {
      set({ isLoading: true, error: null });
      try {
        const res = await axiosInstanceContestService.patch(`/contest/${id}`, updates);
        if (res?.data?.ok) {
          toast.success("Contest updated successfully");

          // Update the local list
          set({
            contests: get().contests.map((c) =>
              c.id === id ? res.data.contest : c
            ),
            currentContest: res.data.contest,
          });
          return true;
        } else {
          toast.error(res?.data?.error || "Failed to update contest");
          return false;
        }
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
      if (!id) return;
      set({ isLoading: true, error: null });
      try {
        const res = await axiosInstanceContestService.delete(`/contest/${id}`);
        if (res?.data?.ok) {
          toast.success("Contest deleted successfully");
          set({
            contests: get().contests.filter((c) => c.id !== id),
          });
          return true;
        } else {
          toast.error(res?.data?.error || "Failed to delete contest");
          return false;
        }
      } catch (err) {
        console.error("[deleteContest error]", err);
        toast.error("Error deleting contest");
        set({ error: err.message });
        return false;
      } finally {
        set({ isLoading: false });
      }
    },
  }));
