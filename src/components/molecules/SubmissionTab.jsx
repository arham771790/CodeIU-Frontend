import React from "react";
import { Loader2, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

/**
 * Unified SubmissionTab
 * Handles both the history list view (regular problems) 
 * and the focused latest submission view (contest arena).
 */
const SubmissionTab = ({
    submissions,
    latestSubmission, // Used for contest mode
    isSubmittingCode,
    isTimedOut,       // Used for contest mode
    variant = "regular" // 'regular' or 'contest'
}) => {
    const isContest = variant === "contest";

    // --- CONTEST MODE (Focused View) ---
    if (isContest) {
        const sub = latestSubmission;

        if (!sub && !isSubmittingCode) {
            return (
                <div className="flex flex-col items-center justify-center py-10 opacity-40 italic">
                    <p className="text-sm font-medium">No submission data found. Submit code to begin.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Status Card */}
                <div className="bg-base-300/50 rounded-[2rem] p-8 border border-base-content/5 flex flex-col items-center text-center gap-4">
                    {sub?.status === "Pending" ? (
                        <>
                            <Loader2 className="animate-spin text-primary" size={48} />
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-widest text-primary animate-pulse">Running</h2>
                                {isTimedOut && (
                                    <div className="flex items-center gap-2 mt-2 text-warning font-bold text-[10px] uppercase">
                                        <AlertTriangle size={14} /> Request is taking longer than usual...
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={`p-4 rounded-full ${sub?.status === "Accepted" ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
                                {sub?.status === "Accepted" ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                            </div>
                            <h2 className={`text-4xl font-black uppercase tracking-tight ${sub?.status === "Accepted" ? "text-success" : "text-error"}`}>
                                {sub?.status || "Unknown Status"}
                            </h2>
                        </>
                    )}
                </div>

                {/* Test Cases Grid (Contest style) */}
                {sub?.testcases && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                        {sub.testcases.map((tc, i) => (
                            <div key={i} className={`p-3 rounded-2xl border transition-all ${tc.passed
                                ? "bg-success/5 border-success/20 text-success"
                                : "bg-error/5 border-error/20 text-error"
                                }`}>
                                <div className="text-[9px] font-black uppercase opacity-40 mb-1">Case {i + 1}</div>
                                {tc.passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // --- REGULAR MODE (History List) ---
    return (
        <div className="space-y-4">
            {!submissions || submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-50 italic">
                    {isSubmittingCode ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <p className="text-sm font-bold uppercase tracking-widest">Submitting code...</p>
                        </div>
                    ) : (
                        <p className="text-sm">No submission attempts yet.</p>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {submissions.map((sub, index) => (
                        <div
                            key={sub.id || index}
                            className="bg-base-300/30 rounded-2xl border border-base-content/10 overflow-hidden transition-all hover:border-base-content/20"
                        >
                            {/* Header: Overall Result Summary */}
                            <div className="bg-base-300/50 px-6 py-4 flex justify-between items-center border-b border-base-content/10">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${sub.status === "Accepted" ? "bg-success/20 text-success"
                                        : (sub.status === "Pending") ? "bg-warning/20 text-warning"
                                            : "bg-error/20 text-error"
                                        }`}>
                                        {sub.status === "Accepted" ? <CheckCircle2 size={20} /> : (sub.status === "Pending") ? <Clock size={20} /> : <XCircle size={20} />}
                                    </div>
                                    <div>
                                        <h3 className={`font-black text-lg leading-none uppercase tracking-tight ${sub.status === "Accepted" ? "text-success" : (sub.status === "Pending") ? "text-warning" : "text-error"
                                            }`}>
                                            {sub.status}
                                        </h3>
                                        <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest mt-1 block">
                                            {sub.language} • {new Date(sub.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-mono font-bold opacity-60">
                                        {sub.testcases?.filter((t) => t.passed).length}/{sub.testcases?.length} PASSED
                                    </p>
                                </div>
                            </div>

                            {/* Individual Test Case List (Collapsible/Inner) */}
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {sub.testcases?.map((tc, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl border border-base-content/5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black opacity-30 uppercase">Test {i + 1}</span>
                                            <span className={`text-xs font-bold ${tc.passed ? "text-success" : "text-error"}`}>{tc.status}</span>
                                        </div>
                                        {tc.passed ? <CheckCircle2 size={14} className="text-success" /> : <XCircle size={14} className="text-error" />}
                                    </div>
                                ))}
                            </div>

                            {/* Error Logs */}
                            {(sub.compileOutput || sub.stderr) && (
                                <div className="px-6 pb-6 pt-2">
                                    <div className="bg-error/5 border border-error/20 p-4 rounded-xl">
                                        <p className="text-[10px] font-black text-error uppercase mb-2 tracking-widest">Error Log</p>
                                        <pre className="text-xs font-mono text-error/80 whitespace-pre-wrap">{sub.compileOutput || sub.stderr}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubmissionTab;
