"use client";
import { create } from "zustand";
import { toast } from "react-toastify";
// ✅ Import Actions instead of Axios
import { 
  attachProblemsAction, 
  fetchBundleAction, 
  getContestProblemAction 
} from "@/actions/bundleBridge";

// --- Helper: Normalize Data Structure ---
const normalizeProblem = (p) => {
  if (!p) return null;
  const data = p.snapshot || p; 
  return {
    ...p,
    snapshot: {
      ...data,
      testcases: Array.isArray(data.testcases) && data.testcases.length 
        ? data.testcases 
        : [{ input: "1", output: "1" }],
      examples: {
        JAVASCRIPT: data.examples?.JAVASCRIPT || { input: "1", output: "1", explanation: "" },
        PYTHON: data.examples?.PYTHON || { input: "1", output: "1", explanation: "" },
        JAVA: data.examples?.JAVA || { input: "1", output: "1", explanation: "" },
        ...(data.examples?.CPP ? { CPP: data.examples.CPP } : {}),
      },
    }
  };
};

export const useBundleStore = create((set) => ({
  bundle: null,
  contestId: null,
  problem: null,
  isLoading: false,
  error: null,

  // 1. Attach Problems (Admin)
  attachInlineProblems: async ({ contestId, problems }) => {
    try {
      set({ isLoading: true });
      // ✅ Call Server Action
      const res = await attachProblemsAction(contestId, problems);
      
      if (res.ok) {
        toast.success("✅ Problems attached successfully.");
        return true;
      }
      toast.error(res.error || "❌ Failed to attach problems.");
      return false;
    } catch (e) {
      console.error(e);
      toast.error("Unexpected error.");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // 2. Fetch Bundle (Participant)
  fetchBundle: async ({ contestId, userId }) => {
    try {
      set({ isLoading: true });
      // ✅ Call Server Action
      const res = await fetchBundleAction(contestId, userId);

      if (res.ok && res.data) {
        const rawBundle = res.data;
        const bundle = { ...rawBundle };
        // Normalize
        bundle.problems = (bundle.problems || []).map(p => normalizeProblem(p));

        set({ bundle, contestId });
        return bundle;
      }

      set({ bundle: null, contestId: null });
      toast.error(res.error || "Failed to load contest.");
      return null;
    } catch (err) {
      console.error(err);
      set({ bundle: null });
    } finally {
      set({ isLoading: false });
    }
  },

  // 3. Get Specific Problem
  getContestProblem: async (contestId, problemId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // ✅ Call Server Action
      const res = await getContestProblemAction(contestId, problemId, userId);

      if (res.ok && res.data) {
        const p = res.data;
        // Normalize
        const normalized = normalizeProblem({ snapshot: p });
        set({ problem: normalized.snapshot });
      } else {
        set({ error: "Failed to fetch problem", problem: null });
      }
    } catch (err) {
      console.error(err);
      set({ error: "Failed to fetch problem", problem: null });
    } finally {
      set({ isLoading: false });
    }
  },

  clearBundle: () => set({ bundle: null }),
  resetProblem: () => set({ problem: null, isLoading: false, error: null }),
}));