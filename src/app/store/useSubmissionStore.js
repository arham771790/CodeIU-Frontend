import { create } from 'zustand';
import { axiosInstanceSubmissionService } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
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
        const { socket } = get();

        // ✅ 1. SINGLETON CHECK: If socket exists and is connected, do nothing.
        if (socket && socket.connected) {
            console.log("⚡ Socket already active. Re-joining room for user:", userId);
            socket.emit('join-room', userId);
            return;
        }

        // 2. Initialize new socket
        const newSocket = io("http://localhost:8080", {
            withCredentials: true,
            transports: ['websocket'] // Optimization: Force websocket
        });

        newSocket.on('connect', () => {
            console.log("✅ Socket connected:", newSocket.id);
            if (userId) {
                newSocket.emit('join-room', userId);
            }
        });

        set({ socket: newSocket });

        // Listeners
        newSocket.on("submission-update", (finalSubmission) => {
            console.log('Received submission update:', finalSubmission);
            set((state) => ({
                submissions: state.submissions.map(sub =>
                    sub.id === finalSubmission.id ? finalSubmission : sub
                ),
            }));
        });

        newSocket.on("leaderboard:update", (leaderboardData) => {
            console.log('Received leaderboard update:', leaderboardData);
            set({ leaderboard: leaderboardData });
        });
    },


    runCode: async (sourceCode, stdin, languageId, expected_output) => {
        try {
            set({ isexecuting: true });
            const result = await axiosInstanceSubmissionService.post("/execute/run-problem", { 
                sourceCode, stdin, languageId, expected_output 
            });
            set({ RunReslts: result.data.testCases });
            console.log("Run Results:", result.data.testCases);

        } catch (error) {
            console.log("Run Code Error:", error);
            toast.error("Error running code");
        } finally {
            set({ isexecuting: false });
        }
    },

    submitCode: async (sourceCode, languageId, problemId, contestId) => {
        try {
            set({ isSubmittingCode: true });

            // ✅ 3. DYNAMIC URL: Handle missing contestId
            // If contestId is null/undefined, use the standard submission route
            const endpoint = contestId 
                ? `/execute/submit-code/${contestId}` 
                : `/execute/submit-code`; // Adjust this if your backend expects a different route for normal problems

            // If your backend handles `undefined` in the param, you can revert this, 
            // but explicitly checking is safer.
            const payload = contestId 
                ? { sourceCode, languageId, problemId } 
                : { sourceCode, languageId, problemId }; 

            const result = await axiosInstanceSubmissionService.post(endpoint, payload);
            
            set(state => ({
                submissions: [result.data.submission, ...state.submissions] // Add to top
            }));

        } catch (error) {
            console.log("Submit Code Error:", error);
            toast.error("Error submitting code");
        } finally {
            set({ isSubmittingCode: false });
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