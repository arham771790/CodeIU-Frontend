import { create } from 'zustand';
import { axiosInstanceSubmissionService } from '../lib/axios';
import { toast } from 'react-toastify';
import { getLanguageId } from '../lib/lang';

export const useSubmissionStore = create((set, get) => ({
    
    isCodeRunning: false,
    isSubmittingCode: false,
    RunReslts: [],
    userCode: "",
    isexecuting: false,
    submissions: [],
    socket: null,
    selectedLanguage: 'JAVA',
    languageId: getLanguageId('JAVA'),

    setRunResults: (results) => set({ RunReslts: results }),

    // ✅ NEW: Clears temporary state when switching problems, but keeps the socket alive
    resetProblemState: () => set({ 
        RunReslts: [], 
        isexecuting: false, 
        isSubmittingCode: false,
        submissions: [] 
    }),

    clearRunResults: () => set({ RunReslts: [] }),

    addSubmission: (newSubmission) => set((state) => ({
        submissions: [newSubmission, ...state.submissions] 
    })),

    clearResults: () => set({ submissions: [], RunReslts: [] }),

    setUserCode: (code) => {
        set({ userCode: code })
    },

    setSelectedLanguage: (langName) => {
        set({
            selectedLanguage: langName,
            languageId: getLanguageId(langName) || null 
        });
    },

    intializeSocket: async (userId) => {
        let { socket } = get();

        // ✅ 1. SINGLETON CHECK: If socket exists and is connected, do nothing.
        if (socket && socket.connected) {
            console.log("⚡ Socket already active. Re-joining room for user:", userId);
            socket.emit('join-room', {userId});
            return;
        }

        // 2. Initialize using centralized helper
        const { getSocket, getContestSocket } = await import('@/app/lib/socket');
        const newSocket = getSocket();
        const cSocket = getContestSocket();

        newSocket.on('connect', () => {
            console.log("✅ Submission Socket connected:", newSocket.id);
            if (userId) {
                newSocket.emit('join-room', {userId});
            }
        });

        cSocket.on('connect', () => {
            console.log("✅ Contest Socket connected:", cSocket.id);
            if (userId) {
                console.log("🛰️ Contest Socket joining user room:", userId);
                cSocket.emit('join:user', { userId });
            }
        });

        set({ socket: newSocket });

        // Listeners for Submission Socket
        newSocket.on("submission-update", (finalSubmission) => {
            console.log('Received submission update:', finalSubmission);
            set((state) => ({
                submissions: state.submissions.map(sub =>
                    sub.id === finalSubmission.id ? finalSubmission : sub
                ),
            }));
        });

        // Listeners for Contest Socket
        cSocket.on("leaderboard:update", (leaderboardData) => {
            console.log('Received leaderboard update:', leaderboardData);
            set({ leaderboard: leaderboardData });
        });

        cSocket.on("participant:warning", (data) => {
            console.log("⚠️ Anti-Cheat Warning:", data);
            toast.error(`⚠️ WARNING (${data.warnings}/2): Anti-cheat violation detected! Switching windows or unauthorized actions may lead to disqualification.`, {
                position: "top-center",
                autoClose: 10000,
                theme: "dark",
            });
        });

        cSocket.on("participant:disqualified", (data) => {
            console.log("🚫 Disqualified:", data);
            toast.error("🚫 YOU HAVE BEEN DISQUALIFIED for repeated violations. Your participation has been terminated.", {
                position: "top-center",
                autoClose: false,
                theme: "colored",
            });
            // Delay redirect slightly so user can read the toast
            setTimeout(() => {
                window.location.href = `/contest/${data.contestId}/summary`;
            }, 3000);
        });
    },


    runCode: async (sourceCode, stdin, languageId, expected_output) => {
        try {
            set({ isexecuting: true });
            const result = await axiosInstanceSubmissionService.post("submission/execute/run-problem", { 
                sourceCode, stdin, languageId, expected_output 
            });
            set({ RunReslts: result.data.testCases });
            console.log("Run Results:", result.data.testCases);
            toast.success("Code executed successfully!");
        } catch (error) {
            console.log("Run Code Error:", error);
            toast.error(error.response?.data?.error || "Error running code");
        } finally {
            set({ isexecuting: false });
        }
    },

    submitCode: async (sourceCode, languageId, problemId, contestId) => {
        try {
            set({ isSubmittingCode: true });

            // Ensure explicitly choosing the /execute service prefix
            const endpoint = contestId 
                ? `submission/execute/submit-code/${contestId}` 
                : `submission/execute/submit-code`;

            const payload = { sourceCode, languageId, problemId }; 

            const result = await axiosInstanceSubmissionService.post(endpoint, payload);
            
            set(state => ({
                submissions: [result.data.submission, ...state.submissions] // Add to top
            }));
            toast.success("Code submitted successfully!");
        } catch (error) {
            console.log("Submit Code Error:", error);
            toast.error(error.response?.data?.error || "Error submitting code");
        } finally {
            set({ isSubmittingCode: false });
        }
    },

    fetchSubmissionsByProblem: async (problemId, contestId) => {
        try {
            const params = {};
            if (contestId) params.contestId = contestId;

            const res = await axiosInstanceSubmissionService.get(`submission/submission/get-Submissions-For-Problem/${problemId}`, { params });
            
            if (res.data.ok) {
                set({ submissions: res.data.submissions });
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
            // Silent error for background fetch
        }
    },

    // ✅ Renamed to avoid confusion. Only call this on Logout.
    closeSocketConnection: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, submissions: [] });
            console.log('Submission socket closed.');
        }
    }, 
}));