import React from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import SubmissionResult from "@/components/molecules/SubmissionResult";

const TestResultTab = ({
    RunReslts,
    isexecuting,
    isCustomInputEnabled,
    selectedResultIndex,
    setSelectedResultIndex,
    variant = "regular" // 'regular' or 'contest'
}) => {
    const isContest = variant === "contest";

    if (!RunReslts?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-10 opacity-50 italic">
                {isexecuting ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <p className="text-xs font-black uppercase tracking-widest text-primary animate-pulse">Running...</p>
                    </div>
                ) : (
                    <p className="text-sm font-medium">Run your code to see results.</p>
                )}
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${isContest ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""}`}>
            {/* Summary View */}
            <SubmissionResult
                runResults={RunReslts}
                isCustom={isCustomInputEnabled}
            />

            {/* Detailed Case Buttons */}
            <div className="flex gap-2 flex-wrap pt-2">
                {RunReslts.map((r, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedResultIndex?.(i)}
                        className={`transition-all duration-200 flex items-center gap-2 ${isContest
                            ? `px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-transparent ${selectedResultIndex === i
                                ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                                : "bg-base-300/50 opacity-100 hover:bg-base-300"
                            }`
                            : `btn btn-xs ${selectedResultIndex === i
                                ? "btn-primary"
                                : "bg-base-300"
                            }`
                            }`}
                    >
                        {isContest ? (
                            r.passed ? <CheckCircle2 size={12} className={selectedResultIndex === i ? "text-primary-content" : "text-success"} /> : <XCircle size={12} className={selectedResultIndex === i ? "text-primary-content" : "text-error"} />
                        ) : (
                            <div className={`w-2 h-2 rounded-full ${r.passed ? "bg-success" : "bg-error"}`} />
                        )}
                        Case {i + 1}
                    </button>
                ))}
            </div>

            {/* Individual result details if selected (optional refinement) */}
            {selectedResultIndex !== undefined && RunReslts[selectedResultIndex] && !isCustomInputEnabled && (
                <div className="bg-base-300/30 rounded-2xl p-4 border border-base-content/5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Your Output</p>
                            <pre className="bg-base-300 p-3 rounded-xl text-xs font-mono overflow-auto border border-base-content/5 min-h-[40px]">
                                {RunReslts[selectedResultIndex].stdout || "No Output"}
                            </pre>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Expected</p>
                            <pre className="bg-base-300 p-3 rounded-xl text-xs font-mono overflow-auto border border-base-content/5 min-h-[40px]">
                                {RunReslts[selectedResultIndex].expected || "N/A"}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestResultTab;
