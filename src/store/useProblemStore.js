import {create} from 'zustand';
import { axiosInstanceProblemService } from '../lib/axios';
import { toast } from 'react-hot-toast';

const FETCH_TTL_MS = 60_000; // 60 seconds

export const useProblemStore = create((set, get) => ({
    
  problems: [],
  problem: null,
  solvedProblemsIds: [], 
  isSolvedLoading: false, 
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isCreatingProblem: false,
  isDeletingProblem: false,
  isUpdatingProblem: false,
  lastFetched: null, // TTL guard timestamp

  getAllProblems: async (force = false) => {
    const { lastFetched } = get();
    if (!force && lastFetched && Date.now() - lastFetched < FETCH_TTL_MS) {
      return; // Data is fresh, skip fetch
    }
    try {
      set({ isProblemsLoading: true });
      const res = await axiosInstanceProblemService.get("/problem/getAllProblem");
      set({ problems: res.data.problems || [], lastFetched: Date.now() });
    } catch (error) {
      console.error(`[useProblemStore] getAllProblems [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
      toast.error(error.normalizedMessage || "Error fetching problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  fetchUserSolvedProblems: async () => {
    try {
      set({ isSolvedLoading: true });
      const res = await axiosInstanceProblemService.get("/problem/solved-problems");
      const ids = (res.data.solvedProblem || []).map(s => s.problemId);
      set({ solvedProblemsIds: ids });
    } catch (error) {
      console.error(`[useProblemStore] fetchUserSolvedProblems [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
    } finally {
      set({ isSolvedLoading: false });
    }
  },

  createProblem: async (data) => {
    try {
      set({ isCreatingProblem: true });
      await axiosInstanceProblemService.post("/problem/createProblem", data);
      // Invalidate cache on mutation
      set({ lastFetched: null });
      toast.success("Problem created successfully");
    } catch (error) {
      console.error(`[useProblemStore] createProblem [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
      toast.error(error.normalizedMessage || "Error creating problem");
    } finally {
      set({ isCreatingProblem: false });
    }
  },

  getProblemById: async (ProblemID) => {
    try {
      set({ isProblemLoading: true });
      const res = await axiosInstanceProblemService.get(`/problem/getProblem/${ProblemID}`);
      const prob = res?.data?.problem;
      set({ problem: prob });
      return prob;
    } catch (error) {
      console.error(`[useProblemStore] getProblemById [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
      toast.error(error.normalizedMessage || "Error fetching problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  UpdateProblem: async () => {
    try {
      set({ lastFetched: null }); // Invalidate cache on mutation
    } catch (error) {
      console.error(`[useProblemStore] UpdateProblem [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
    }
  },

  deleteProblem: async (ProblemId) => {
    try {
      set({ isDeletingProblem: true });
      await axiosInstanceProblemService.delete(`/problem/deleteProblem/${ProblemId}`);
      set((state) => ({
        problems: state.problems.filter(problem => problem.id !== ProblemId),
        lastFetched: null, // Invalidate cache
      }));
    } catch (error) {
      console.error(`[useProblemStore] deleteProblem [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
      toast.error(error.normalizedMessage || "Error deleting problem");
    } finally {
      set({ isDeletingProblem: false });
    }
  }
}))