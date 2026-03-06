import { create } from 'zustand';
import { axiosInstanceSubmissionService } from '../lib/axios';
import { toast } from 'react-toastify';
import { getLanguageId } from '../lib/lang';
import { useProblemStore } from './useProblemStore';

export const useSubmissionStore = create((set, get) => {
    let savedCodes = {};
    let savedLang = 'JAVA';
    let savedTheme = 'vs-dark';

    if (typeof window !== 'undefined') {
        try {
            savedCodes = JSON.parse(localStorage.getItem('codeiu_problem_codes') || '{}');
            savedLang = localStorage.getItem('codeiu_lang') || 'JAVA';
            savedTheme = localStorage.getItem('codeiu_theme') || 'vs-dark';
        } catch (e) {
            console.error("[SubmissionStore] Error parsing saved problem codes", e);
            savedCodes = {};
        }
    }

    return {
    
    isCodeRunning: false, // Legacy, will use cooldowns for UI state
    isSubmittingCode: false,
    RunReslts: [],
    
    // Custom Input state
    isCustomInputEnabled: false,
    customInput: "",
    
    // Decoupled Code Management: { [problemId]: code }
    problemCodes: savedCodes, 
    
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
        set((state) => {
            const updatedCodes = {
                ...state.problemCodes,
                [`${problemId}_${language}`]: code
            };
            if (typeof window !== 'undefined') {
                localStorage.setItem('codeiu_problem_codes', JSON.stringify(updatedCodes));
            }
            return { problemCodes: updatedCodes };
        });
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
        newSocket.off("tc:result");

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

        newSocket.on("tc:result", (tcResult) => {
            set((state) => ({
                submissions: state.submissions.map(sub => {
                    if (sub.id !== tcResult.submissionId) return sub;

                    const existingTestcases = sub.testcases || [];
                    const updatedTestcases = [...existingTestcases];

                    const idx = updatedTestcases.findIndex(t => t.testCase === tcResult.testCase);
                    if (idx >= 0) {
                        updatedTestcases[idx] = tcResult;
                    } else {
                        updatedTestcases.push(tcResult);
                    }

                    updatedTestcases.sort((a, b) => a.testCase - b.testCase);

                    return { ...sub, testcases: updatedTestcases };
                })
            }));
        });

        set({ socket: newSocket });
    },

    runCode: async (sourceCode, stdin, languageId, expected_output) => {
        // Auto-reset after 5s in case of hang
        const autoResetTimer = setTimeout(() => {
            set({ isexecuting: false });
        }, 5000);

        try {
            set({ isexecuting: true, RunReslts: [] });
            
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
            
            // 5s cooldown
            get().startCooldown('run', 5);

        } catch (error) {
            if (error.httpStatus === 429) {
                const ttl = error.normalizedMessage?.match(/\d+/)?.[0] || 5;
                get().startCooldown('run', parseInt(ttl));
                toast.error(error.normalizedMessage || "Too many requests.");
            } else {
                console.error(`[useSubmissionStore] runCode [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
                toast.error(error.normalizedMessage || "Error running code");
            }
        } finally {
            clearTimeout(autoResetTimer);
            set({ isexecuting: false });
        }
    },

    submitCode: async (sourceCode, languageId, problemId, contestId) => {
        // Auto-reset after 5s in case of hang
        const autoResetTimer = setTimeout(() => {
            set({ isSubmittingCode: false });
        }, 5000);

        try {
            set({ isSubmittingCode: true, submissions: [] });

            const endpoint = contestId 
                ? `/execute/submit-code/${contestId}` 
                : `/execute/submit-code`;

            const payload = { sourceCode, languageId, problemId }; 

            const result = await axiosInstanceSubmissionService.post(endpoint, payload);
            
            set(state => ({
                submissions: [result.data.submission, ...state.submissions]
            }));

            // 5s cooldown
            get().startCooldown('submit', 5);

            if (result.data.submission?.status === "Accepted") {
                const { solvedProblemsIds } = useProblemStore.getState();
                if (!solvedProblemsIds.includes(problemId)) {
                    useProblemStore.setState({
                        solvedProblemsIds: [...solvedProblemsIds, problemId]
                    });
                }
            }

        } catch (error) {
            if (error.httpStatus === 429) {
                const ttl = error.normalizedMessage?.match(/\d+/)?.[0] || 5;
                get().startCooldown('submit', parseInt(ttl));
                toast.error(error.normalizedMessage || "Too many requests.");
            } else {
                console.error(`[useSubmissionStore] submitCode [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
                toast.error(error.normalizedMessage || "Error submitting code");
            }
        } finally {
            clearTimeout(autoResetTimer);
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