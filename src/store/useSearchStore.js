import { create } from "zustand";
import { axiosInstanceProblemService } from "@/lib/axios";
import { toast } from "react-toastify";

export const useSearchStore = create((set, get) => ({
  searchTerm: "",
  results: [],
  isLoading: false,
  error: null,

  setSearchTerm: (term) => set({ searchTerm: term }),

  search: async () => {
    

    try {
      const term = get().searchTerm;

      const encodedTerm = encodeURIComponent(term);

      if (term.trim() === "") {
        set({ results: [], isLoading: false, error: null });
        return;
      }

      set({ isLoading: true , error : null});

      const res = await axiosInstanceProblemService.get(`/problem/search?q=${encodedTerm}`);

      set({ results: res.data.problems });
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Failed to fetch search results");
      // Set error state and clear results
      set({
        error: "Failed to fetch search results. Please try again..",
        isLoading: false,
        results: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

   clearSearch: () => set({ searchTerm: '', results: [], error: null, isLoading: false }),
}));
