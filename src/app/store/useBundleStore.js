"use client";
import { create } from "zustand";
import { axiosInstanceContestService } from "@/app/lib/axios";
import { toast } from "react-hot-toast";

export const useBundleStore = create((set) => ({
  bundle: null,
  contestId: null,
  problem: null,
  isLoading: false,
  error: null,

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

  fetchBundle: async ({ contestId, userId }) => {
  try {
    set({ isLoading: true });
    const res = await axiosInstanceContestService.get(
      `/contest/contests/${contestId}/bundle?userId=${encodeURIComponent(userId)}`,
      { withCredentials: true }
    );

    if (res?.data?.ok) {
      const rawBundle = res.data.data;

      // 🔎 LOG raw bundle from server (before client normalization)
      console.log("[BundleStore] fetchBundle RAW:", {
        problemsCount: Array.isArray(rawBundle?.problems) ? rawBundle.problems.length : 0,
        first: rawBundle?.problems?.[0] ? {
          order: rawBundle.problems[0].order,
          points: rawBundle.problems[0].points,
          id: rawBundle.problems[0].snapshot?.id,
          title: rawBundle.problems[0].snapshot?.title,
          tcsCount: Array.isArray(rawBundle.problems[0].snapshot?.testcases)
            ? rawBundle.problems[0].snapshot.testcases.length
            : 0,
          tcsHead: rawBundle.problems[0].snapshot?.testcases?.slice(0, 2),
        } : null
      });

      const bundle = { ...rawBundle };
      bundle.problems = bundle.problems.map(p => ({
        ...p,
        snapshot: {
          ...p.snapshot,
          testcases: Array.isArray(p.snapshot.testcases) && p.snapshot.testcases.length
            ? p.snapshot.testcases
            : [{ input: "1", output: "1" }], // client safety net
          examples: {
            JAVASCRIPT: p.snapshot.examples?.JAVASCRIPT || { input: "1", output: "1", explanation: "" },
            PYTHON: p.snapshot.examples?.PYTHON || { input: "1", output: "1", explanation: "" },
            JAVA: p.snapshot.examples?.JAVA || { input: "1", output: "1", explanation: "" },
            ...(p.snapshot.examples?.CPP ? { CPP: p.snapshot.examples.CPP } : {}),
          },
        },
      }));

      // 🔎 LOG after normalization
      console.log("[BundleStore] fetchBundle NORMALIZED:", {
        problemsCount: bundle.problems.length,
        first: bundle.problems[0] ? {
          order: bundle.problems[0].order,
          points: bundle.problems[0].points,
          id: bundle.problems[0].snapshot?.id,
          title: bundle.problems[0].snapshot?.title,
          tcsCount: bundle.problems[0].snapshot?.testcases?.length || 0,
          tcsHead: bundle.problems[0].snapshot?.testcases?.slice(0, 2),
        } : null
      });

      set({ bundle , contestId});
      toast.success("Contest problems loaded successfully.");
      return bundle;
    }

    set({ bundle: null , contestId:null });
    toast.error(res?.data?.error || "Failed to load contest problems.");
    return null;
  } catch (err) {
    // ...
  } finally {
    set({ isLoading: false });
  }
},

  getContestProblem: async (contestId, problemId, userId) => {
  set({ isLoading: true, error: null });
  try {
    const res = await axiosInstanceContestService.get(
      `/contest/contests/${contestId}/problems/${problemId}`,
      { params: { userId }, withCredentials: true }
    );

    if (res.data.ok) {
      const p = res.data.data;
      console.log("[BundleStore] getContestProblem RAW:", {
        id: p?.id, title: p?.title,
        tcsCount: Array.isArray(p?.testcases) ? p.testcases.length : 0,
        tcsHead: p?.testcases?.slice(0,2),
      });

      const normalized = {
        ...p,
        testcases: Array.isArray(p.testcases) && p.testcases.length ? p.testcases : [{ input: "1", output: "1" }],
        examples: {
          JAVASCRIPT: p.examples?.JAVASCRIPT || { input: "1", output: "1", explanation: "" },
          PYTHON: p.examples?.PYTHON || { input: "1", output: "1", explanation: "" },
          JAVA: p.examples?.JAVA || { input: "1", output: "1", explanation: "" },
          ...(p.examples?.CPP ? { CPP: p.examples.CPP } : {}),
        },
      };

      console.log("[BundleStore] getContestProblem NORMALIZED:", {
        tcsCount: normalized.testcases.length, tcsHead: normalized.testcases.slice(0,2)
      });

      set({ problem: normalized });
    } else {
      set({ error: res.data.error, problem: null });
    }
  } catch (err) {
    // ...
  } finally {
    set({ isLoading: false });
  }
},


  clearBundle: () => set({ bundle: null }),
  resetProblem: () => set({ problem: null, isLoading: false, error: null }),
}));
