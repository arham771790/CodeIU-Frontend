import React from "react";

const TestCaseTab = ({
    testcases,
    selectedCaseIndex,
    setSelectedCaseIndex,
    variant = "regular" // 'regular' or 'contest'
}) => {
    const isContest = variant === "contest";

    return (
        <div className={`space-y-6 ${isContest ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""}`}>
            {/* Case Selection Buttons */}
            <div className="flex gap-2 flex-wrap">
                {testcases?.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedCaseIndex(i)}
                        className={`transition-all duration-200 ${isContest
                                ? `px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${selectedCaseIndex === i
                                    ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                                    : "bg-base-300 opacity-40 hover:opacity-100"
                                }`
                                : `btn btn-xs ${selectedCaseIndex === i
                                    ? "btn-primary shadow-md"
                                    : "btn-ghost bg-base-300 hover:bg-base-content/10"
                                }`
                            }`}
                    >
                        Case {i + 1}
                    </button>
                ))}
            </div>

            {/* Input/Output Display */}
            <div className={`grid ${isContest ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-4`}>
                <div className="space-y-2">
                    <p className={`text-[10px] font-black uppercase tracking-widest opacity-30 ${isContest ? "" : "mb-1"}`}>
                        Input
                    </p>
                    <pre className={`bg-base-300 p-4 rounded-2xl text-xs font-mono border border-base-content/5 overflow-x-auto ${isContest ? "" : "text-sm"}`}>
                        {testcases?.[selectedCaseIndex]?.input || "No Input Recorded"}
                    </pre>
                </div>
                <div className="space-y-2">
                    <p className={`text-[10px] font-black uppercase tracking-widest opacity-30 ${isContest ? "" : "mb-1"}`}>
                        Expected Output
                    </p>
                    <pre className={`bg-base-300 p-4 rounded-2xl text-xs font-mono border border-base-content/5 overflow-x-auto ${isContest ? "" : "text-sm"}`}>
                        {testcases?.[selectedCaseIndex]?.output || "No Output Recorded"}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default TestCaseTab;
