import { create } from 'zustand';
import { axiosInstanceSubmissionService } from '../lib/axios';
import { toast } from 'react-toastify';
import { getLanguageId } from '../lib/lang';
import { useProblemStore } from './useProblemStore';

export const useSubmissionStore = create((set, get) => {
    // Load defaults from localStorage if available
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('codeiu_lang') || 'JAVA' : 'JAVA';
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('codeiu_theme') || 'vs-dark' : 'vs-dark';

    return {
    
    isCodeRunning: false, // Legacy, will use cooldowns for UI state
    isSubmittingCode: false,
    RunReslts: [],
    
    // Custom Input state
    isCustomInputEnabled: false,
    customInput: "",
    
    // Decoupled Code Management: { [problemId]: code }
    problemCodes: {}, 
    
    // Cooldown Management: { [type]: expiryTimestamp }
    operationCooldowns: {
        run: 0,
        submit: 0
    },

    isexecuting: false,
    submissions: [],
    socket: null,
    selectedLanguage: savedLang,
    languageId: getLanguageId(savedLang),
    theme: savedTheme,

    setIsCustomInputEnabled: (val) => set({ isCustomInputEnabled: val }),
    setCustomInput: (val) => set({ customInput: val }),

    setRunResults: (results) => set({ RunReslts: results }),

    // ✅ NEW: Clears temporary result state, but RETAINS problemCodes
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

    // Encapsulated Code Update
    setUserCode: (code, problemId, language = "JAVA") => {
        if (!problemId) {
            console.warn("[SubmissionStore] setUserCode called without problemId");
            return;
        }
        set((state) => ({
            problemCodes: {
                ...state.problemCodes,
                [`${problemId}_${language}`]: code
            }
        }));
    },

    // UI helper: Get code for a specific problem or fallback
    getCodeForProblem: (problemId, language = "JAVA", defaultValue = "") => {
        return get().problemCodes[`${problemId}_${language}`] || defaultValue;
    },

    setSelectedLanguage: (langName) => {
        if (typeof window !== 'undefined') localStorage.setItem('codeiu_lang', langName);
        set({
            selectedLanguage: langName,
            languageId: getLanguageId(langName) || null 
        });
    },

    setTheme: (theme) => {
        if (typeof window !== 'undefined') localStorage.setItem('codeiu_theme', theme);
        set({ theme });
    },

    // --- Cooldown Logic ---
    startCooldown: (type, seconds = 30) => {
        set((state) => ({
            operationCooldowns: {
                ...state.operationCooldowns,
                [type]: Date.now() + seconds * 1000
            }
        }));
    },

    intializeSocket: async (userId) => {
        const { socket } = get();

        if (socket && socket.connected) {
            if (userId) socket.emit('join-room', { userId });
            return;
        }

        const { getSocket } = await import('@/lib/socket');
        const newSocket = getSocket();

        newSocket.off("submission-update");

        newSocket.on('connect', () => {
            if (userId) newSocket.emit('join-room', { userId });
        });

        if (newSocket.connected && userId) {
            newSocket.emit('join-room', { userId });
        }

        newSocket.on("submission-update", (finalSubmission) => {
            set((state) => ({
                submissions: state.submissions.map(sub =>
                    sub.id === finalSubmission.id ? { ...sub, ...finalSubmission } : sub
                ),
            }));

            if (finalSubmission.status === "Accepted") {
                const { solvedProblemsIds } = useProblemStore.getState();
                if (!solvedProblemsIds.includes(finalSubmission.problemId)) {
                    useProblemStore.setState({
                        solvedProblemsIds: [...solvedProblemsIds, finalSubmission.problemId]
                    });
                }
            }
        });

        set({ socket: newSocket });
    },

    runCode: async (sourceCode, stdin, languageId, expected_output) => {
        try {
            set({ isexecuting: true });
            
            // If custom input is enabled, override the standard testcases
            const finalStdin = get().isCustomInputEnabled ? [get().customInput] : stdin;
            const finalExpected = get().isCustomInputEnabled ? [""] : expected_output;

            const result = await axiosInstanceSubmissionService.post("/execute/run-problem", { 
                sourceCode, 
                stdin: finalStdin, 
                languageId, 
                expected_output: finalExpected 
            });
            set({ RunReslts: result.data.testCases });
            
            // Start local cooldown (30s as per backend middleware)
            get().startCooldown('run', 30);

        } catch (error) {
            if (error.response?.status === 429) {
                const ttl = error.response.data.message.match(/\d+/)?.[0] || 30;
                get().startCooldown('run', parseInt(ttl));
                toast.error(error.response.data.message);
            } else {
                const errMsg = error.response?.data?.error?.message || error.response?.data?.message || "Error running code";
                toast.error(errMsg);
            }
        } finally {
            set({ isexecuting: false });
        }
    },

    submitCode: async (sourceCode, languageId, problemId, contestId) => {
        try {
            set({ isSubmittingCode: true });

            const endpoint = contestId 
                ? `/execute/submit-code/${contestId}` 
                : `/execute/submit-code`;

            const payload = { sourceCode, languageId, problemId }; 

            const result = await axiosInstanceSubmissionService.post(endpoint, payload);
            
            set(state => ({
                submissions: [result.data.submission, ...state.submissions]
            }));

            // Start local cooldown
            get().startCooldown('submit', 30);

            if (result.data.submission?.status === "Accepted") {
                const { solvedProblemsIds } = useProblemStore.getState();
                if (!solvedProblemsIds.includes(problemId)) {
                    useProblemStore.setState({
                        solvedProblemsIds: [...solvedProblemsIds, problemId]
                    });
                }
            }

        } catch (error) {
            if (error.response?.status === 429) {
                const ttl = error.response.data.message.match(/\d+/)?.[0] || 30;
                get().startCooldown('submit', parseInt(ttl));
                toast.error(error.response.data.message);
            } else {
                const errMsg = error.response?.data?.error?.message || error.response?.data?.message || "Error submitting code";
                toast.error(errMsg);
            }
        } finally {
            set({ isSubmittingCode: false });
        }
    },

    closeSocketConnection: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, submissions: [] });
        }
    },
    };
});