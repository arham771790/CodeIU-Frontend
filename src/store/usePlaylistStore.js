import { create } from "zustand";
import { axiosInstanceProblemService } from "@/lib/axios";
import { toast } from "react-toastify";

const PLAYLIST_TTL_MS = 120_000; // 2 minutes

export const usePlaylistStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isPlaylistsLoading: false,
  isPlaylistLoading: false,
  lastFetchedList: null,

  // ═══════════════════════════════════════
  //  PUBLIC — LIST & DETAIL
  // ═══════════════════════════════════════

  fetchAllPlaylists: async (force = false) => {
    const { lastFetchedList } = get();
    if (
      !force &&
      lastFetchedList &&
      Date.now() - lastFetchedList < PLAYLIST_TTL_MS
    ) {
      return;
    }

    try {
      set({ isPlaylistsLoading: true });
      const res = await axiosInstanceProblemService.get("/playlist");
      set({
        playlists: res.data.playlists || [],
        lastFetchedList: Date.now(),
      });
    } catch (error) {
      console.error(
        `[usePlaylistStore] fetchAllPlaylists [${error.errorCode}] ${error.normalizedMessage}`,
        { traceId: error.traceId },
      );
      toast.error(error.normalizedMessage || "Failed to load playlists");
    } finally {
      set({ isPlaylistsLoading: false });
    }
  },

  fetchPlaylistDetail: async (identifier) => {
    try {
      set({ isPlaylistLoading: true, currentPlaylist: null });
      const res = await axiosInstanceProblemService.get(
        `/playlist/${identifier}`,
      );
      set({ currentPlaylist: res.data.playlist || null });
      return res.data.playlist;
    } catch (error) {
      console.error(
        `[usePlaylistStore] fetchPlaylistDetail [${error.errorCode}] ${error.normalizedMessage}`,
        { traceId: error.traceId },
      );
      toast.error(error.normalizedMessage || "Failed to load playlist");
    } finally {
      set({ isPlaylistLoading: false });
    }
  },

  createPlaylist: async (data, noToast = false) => {
    try {
      const res = await axiosInstanceProblemService.post("/playlist", data);
      if (!noToast) toast.success("Playlist created successfully");
      get().fetchAllPlaylists(true);
      return res.data.playlist;
    } catch (error) {
      toast.error(error.normalizedMessage || "Failed to create playlist");
      throw error;
    }
  },

  updatePlaylist: async (playlistId, data, noToast = false) => {
    try {
      const res = await axiosInstanceProblemService.put(`/playlist/${playlistId}`, data);
      if (!noToast) toast.success("Playlist updated successfully");
      get().fetchAllPlaylists(true);
      if (get().currentPlaylist?.id === playlistId) {
        get().fetchPlaylistDetail(playlistId);
      }
      return res.data.playlist;
    } catch (error) {
      toast.error(error.normalizedMessage || "Failed to update playlist");
      throw error;
    }
  },

  deletePlaylist: async (playlistId, noToast = false) => {
    try {
      await axiosInstanceProblemService.delete(`/playlist/${playlistId}`);
      if (!noToast) toast.success("Playlist deleted successfully");
      get().fetchAllPlaylists(true);
    } catch (error) {
      toast.error(error.normalizedMessage || "Failed to delete playlist");
      throw error;
    }
  },

  // ═══════════════════════════════════════
  //  ADMIN — SUBDIVISIONS
  // ═══════════════════════════════════════

  addSubdivision: async (playlistId, data, noToast = false) => {
    try {
      const res = await axiosInstanceProblemService.post(`/playlist/${playlistId}/subdivisions`, data);
      if (!noToast) toast.success("Subdivision added successfully");
      get().fetchPlaylistDetail(playlistId);
      return res.data.subdivision;
    } catch (error) {
      toast.error(error.normalizedMessage || "Failed to add subdivision");
      throw error;
    }
  },

  updateSubdivision: async (playlistId, subdivisionId, data, noToast = false) => {
    try {
      const res = await axiosInstanceProblemService.put(`/playlist/subdivisions/${subdivisionId}`, data);
      if (!noToast) toast.success("Subdivision updated successfully");
      get().fetchPlaylistDetail(playlistId);
      return res.data.subdivision;
    } catch (error) {
      toast.error(error.normalizedMessage || "Failed to update subdivision");
      throw error;
    }
  },

  deleteSubdivision: async (playlistId, subdivisionId, noToast = false) => {
    try {
      await axiosInstanceProblemService.delete(`/playlist/subdivisions/${subdivisionId}`);
      if (!noToast) toast.success("Subdivision deleted successfully");
      get().fetchPlaylistDetail(playlistId);
    } catch (error) {
      toast.error(error.normalizedMessage || "Failed to delete subdivision");
      throw error;
    }
  },

  // ═══════════════════════════════════════
  //  ADMIN — PROBLEMS IN SUBDIVISIONS
  // ═══════════════════════════════════════

  addProblemToSubdivision: async (playlistId, subdivisionId, problemId, order = 0, noToast = false) => {
    try {
      const res = await axiosInstanceProblemService.post(`/playlist/subdivisions/${subdivisionId}/problems`, { problemId, order });
      if (!noToast) toast.success("Problem added to subdivision successfully");
      get().fetchPlaylistDetail(playlistId);
      return res.data.playlistProblem;
    } catch (error) {
      toast.error(error.normalizedMessage || "Failed to add problem to subdivision");
      throw error;
    }
  },

  removeProblemFromSubdivision: async (playlistId, subdivisionId, problemId, noToast = false) => {
    try {
      await axiosInstanceProblemService.delete(`/playlist/subdivisions/${subdivisionId}/problems/${problemId}`);
      if (!noToast) toast.success("Problem removed from subdivision successfully");
      get().fetchPlaylistDetail(playlistId);
    } catch (error) {
      toast.error(error.normalizedMessage || "Failed to remove problem from subdivision");
      throw error;
    }
  },

  // ═══════════════════════════════════════
  //  PROGRESS
  // ═══════════════════════════════════════

  markProgress: async (playlistId, problemId) => {
    try {
      await axiosInstanceProblemService.post(
        `/playlist/${playlistId}/progress`,
        { problemId },
      );

      // Optimistic local state update
      set((state) => {
        const cp = state.currentPlaylist;
        if (!cp || cp.id !== playlistId) return state;
        const newSolvedIds = [
          ...new Set([...(cp.progress?.solvedIds || []), problemId]),
        ];
        const total = cp.progress?.total || 1;
        return {
          currentPlaylist: {
            ...cp,
            progress: {
              ...cp.progress,
              solvedIds: newSolvedIds,
              solved: newSolvedIds.length,
              percentage: Math.round((newSolvedIds.length / total) * 100),
            },
          },
        };
      });
    } catch (error) {
      console.error(
        `[usePlaylistStore] markProgress [${error.errorCode}] ${error.normalizedMessage}`,
        { traceId: error.traceId },
      );
    }
  },

  // ═══════════════════════════════════════
  //  CACHE MANAGEMENT
  // ═══════════════════════════════════════

  invalidatePlaylistCache: () => {
    set({ lastFetchedList: null });
  },

  clearCurrentPlaylist: () => {
    set({ currentPlaylist: null });
  },
}));
