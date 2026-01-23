import { create } from "zustand";
import { axiosInstanceSubmissionService } from "../lib/axios";
import { toast } from "react-hot-toast";
import { getLanguageId } from "../lib/lang";

export const useSubmissionStore = create((set, get) => ({
  isCodeRunning: false,
  isSubmittingCode: false,
  isexecuting: false,

  RunReslts: [],
  submissions: [],
  userCode: "",

  socket: null,
  contestSocket: null,

  selectedLanguage: "JAVA",
  languageId: getLanguageId("JAVA"),

  /* ------------------ STATE HELPERS ------------------ */

  setRunResults: (results) => set({ RunReslts: results }),

  clearRunResults: () => set({ RunReslts: [] }),

  clearResults: () => set({ submissions: [], RunReslts: [] }),

  resetProblemState: () =>
    set({
      RunReslts: [],
      isexecuting: false,
      isSubmittingCode: false,
      submissions: [],
    }),

  setUserCode: (code) => set({ userCode: code }),

  setSelectedLanguage: (langName) =>
    set({
      selectedLanguage: langName,
      languageId: getLanguageId(langName) || null,
    }),

  /* ------------------ SOCKET INIT ------------------ */

  intializeSocket: async (userId) => {
    const { socket } = get();

    // ✅ Singleton guard
    if (socket && socket.connected) {
      socket.emit("join-room", { userId });
      return;
    }

    const { getSocket, getContestSocket } = await import(
      "@/app/lib/socket"
    );

    const submissionSocket = getSocket();
    const contestSocket = getContestSocket();

    submissionSocket.on("connect", () => {
      console.log("✅ Submission socket connected:", submissionSocket.id);
      if (userId) {
        submissionSocket.emit("join-room", { userId });
      }
    });

    contestSocket.on("connect", () => {
      console.log("✅ Contest socket connected:", contestSocket.id);
    });

    /* ---------- Submission updates (UPSERT) ---------- */
    submissionSocket.on("submission-update", (finalSubmission) => {
      console.log("📥 Submission update:", finalSubmission);

      set((state) => {
        const exists = state.submissions.some(
          (sub) => sub.id === finalSubmission.id
        );

        return {
          submissions: exists
            ? state.submissions.map((sub) =>
                sub.id === finalSubmission.id ? finalSubmission : sub
              )
            : [finalSubmission, ...state.submissions],
        };
      });
    });

    /* ---------- Contest leaderboard updates ---------- */
    contestSocket.on("leaderboard:update", (leaderboardData) => {
      console.log("📊 Leaderboard update:", leaderboardData);
      set({ leaderboard: leaderboardData });
    });

    set({
      socket: submissionSocket,
      contestSocket,
    });
  },

  /* ------------------ RUN CODE ------------------ */

  runCode: async (sourceCode, stdin, languageId, expected_output) => {
    try {
      set({ isexecuting: true });

      const result =
        await axiosInstanceSubmissionService.post(
          "/execute/run-problem",
          {
            sourceCode,
            stdin,
            languageId,
            expected_output,
          }
        );

      set({ RunReslts: result.data.testCases });
    } catch (error) {
      console.error("Run Code Error:", error);
      toast.error("Error running code");
    } finally {
      set({ isexecuting: false });
    }
  },

  /* ------------------ SUBMIT CODE ------------------ */

  submitCode: async (sourceCode, languageId, problemId, contestId) => {
    try {
      set({ isSubmittingCode: true });

      const endpoint = contestId
        ? `/execute/submit-code/${contestId}`
        : `/execute/submit-code`;

      const payload = { sourceCode, languageId, problemId };

      await axiosInstanceSubmissionService.post(endpoint, payload);

      // ❌ NO optimistic insert
      // Socket will deliver final submission

    } catch (error) {
      console.error("Submit Code Error:", error);
      toast.error("Error submitting code");
    } finally {
      set({ isSubmittingCode: false });
    }
  },

  /* ------------------ CLEANUP ------------------ */

  closeSocketConnection: () => {
    const { socket, contestSocket } = get();

    socket?.disconnect();
    contestSocket?.disconnect();

    set({
      socket: null,
      contestSocket: null,
      submissions: [],
    });

    console.log("🔌 All sockets closed");
  },
}));
