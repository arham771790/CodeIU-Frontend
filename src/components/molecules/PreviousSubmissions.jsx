"use client";

import { useEffect, useState } from "react";
import { axiosInstanceSubmissionService } from "@/lib/axios";
import { Loader2, CheckCircle2, XCircle, Clock, Code, Terminal, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Editor from "@monaco-editor/react";

export default function PreviousSubmissions({ problemId }) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedSub, setSelectedSub] = useState(null);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!problemId) return;
            setLoading(true);
            setError("");
            try {
                const res = await axiosInstanceSubmissionService.get(`/submission/get-Submissions-For-Problem/${problemId}`);
                if (res.data?.success) {
                    setSubmissions(res.data.submissions || []);
                } else {
                    setSubmissions(res.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch submissions:", err);
                setError("Failed to load submission history.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [problemId]);

    const fetchDetail = async (id) => {
        setIsFetchingDetail(true);
        try {
            const res = await axiosInstanceSubmissionService.get(`/submission/${id}`);
            if (res.data?.success) {
                setSelectedSub(res.data.submission);
            }
        } catch (err) {
            console.error("Failed to fetch details:", err);
        } finally {
            setIsFetchingDetail(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-primary opacity-50" size={24} />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-error opacity-70 text-xs font-bold">{error}</div>;
    }

    if (!submissions?.length) {
        return (
            <div className="text-center py-10 text-xs font-bold opacity-30 italic">
                No previous submissions found. Run or submit your code!
            </div>
        );
    }

    return (
        <div className="space-y-3 relative">
            {submissions.map((sub, idx) => (
                <div
                    key={sub.id || idx}
                    onClick={() => fetchDetail(sub.id)}
                    className="flex items-center justify-between p-4 bg-base-300 rounded-2xl border border-base-content/5 hover:border-primary/30 transition-all cursor-pointer group"
                >
                    <div className="flex items-center gap-4">
                        {sub.status === "Accepted" ? (
                            <CheckCircle2 className="text-success" size={20} />
                        ) : (
                            <XCircle className="text-error" size={20} />
                        )}
                        <div>
                            <p className={`text-sm font-bold ${sub.status === "Accepted" ? "text-success" : "text-error"}`}>
                                {sub.status || "Unknown"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] uppercase font-black tracking-widest bg-base-100 px-2 py-0.5 rounded-md opacity-70">
                                    {sub.language || "Code"}
                                </span>
                                <span className="text-[10px] text-base-content/40 flex items-center gap-1">
                                    <Clock size={10} />
                                    {sub.createdAt ? formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true }) : "Unknown time"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 text-right items-center">
                        <div className="hidden group-hover:block transition-all mr-2">
                            <div className="btn btn-ghost btn-xs btn-circle bg-primary/10 text-primary">
                                <Code size={14} />
                            </div>
                        </div>
                        {sub.time && (
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Time</span>
                                <span className="text-xs font-mono">{sub.time}ms</span>
                            </div>
                        )}
                        {sub.memory && (
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Memory</span>
                                <span className="text-xs font-mono">{sub.memory}KiB</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Detailed View Modal */}
            {selectedSub && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-base-200 w-full max-w-5xl h-[85vh] rounded-[2.5rem] border border-base-content/10 flex flex-col overflow-hidden shadow-2xl relative">
                        {/* Header */}
                        <div className="bg-base-300/50 p-6 flex justify-between items-center border-b border-base-content/5">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-2xl ${selectedSub.status === 'Accepted' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                    {selectedSub.status === 'Accepted' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                </div>
                                <div>
                                    <h2 className={`text-xl font-black uppercase tracking-tight ${selectedSub.status === 'Accepted' ? 'text-success' : 'text-error'}`}>
                                        {selectedSub.status}
                                    </h2>
                                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                        {selectedSub.language} • {new Date(selectedSub.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedSub(null)}
                                className="btn btn-ghost btn-circle hover:bg-error/10 hover:text-error transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Split */}
                        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                            {/* Left: Code Editor (Read only) */}
                            <div className="flex-[3] border-r border-base-content/5 flex flex-col">
                                <div className="px-6 py-3 bg-base-300/30 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                                    <Code size={12} /> Source Code
                                </div>
                                <div className="flex-1">
                                    <Editor
                                        height="100%"
                                        language={selectedSub.language.toLowerCase()}
                                        theme="vs-dark"
                                        value={typeof selectedSub.sourceCode === 'string' ? selectedSub.sourceCode : JSON.stringify(selectedSub.sourceCode, null, 2)}
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            automaticLayout: true,
                                            padding: { top: 20 }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Right: Diagnostics */}
                            <div className="flex-[2] bg-base-300/20 flex flex-col overflow-hidden">
                                <div className="px-6 py-3 bg-base-300/30 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                                    <Terminal size={12} /> Diagnostics
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {/* Summary Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-base-100 p-3 rounded-2xl border border-base-content/5">
                                            <p className="text-[9px] font-black uppercase opacity-30 tracking-widest mb-1">Total Time</p>
                                            <p className="font-mono text-sm">{selectedSub.time || 'N/A'}s</p>
                                        </div>
                                        <div className="bg-base-100 p-3 rounded-2xl border border-base-content/5">
                                            <p className="text-[9px] font-black uppercase opacity-30 tracking-widest mb-1">Max Memory</p>
                                            <p className="font-mono text-sm">{selectedSub.memory || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Individual Test Cases */}
                                    <div className="space-y-2">
                                        {selectedSub.testcases?.map((tc, i) => (
                                            <div key={i} className="bg-base-100/50 rounded-xl border border-base-content/5 overflow-hidden">
                                                <div className={`px-4 py-2 flex justify-between items-center ${tc.passed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                                    <span className="text-[10px] font-black uppercase">Case {tc.testCase}</span>
                                                    <span className="text-[10px] font-bold">{tc.status}</span>
                                                </div>
                                                {!tc.passed && (
                                                    <div className="p-3 space-y-2 text-[10px] font-mono">
                                                        <div>
                                                            <p className="opacity-30 uppercase font-black tracking-tighter mb-1">Expected</p>
                                                            <pre className="bg-base-300 p-2 rounded-lg truncate">{tc.expected}</pre>
                                                        </div>
                                                        <div>
                                                            <p className="opacity-30 uppercase font-black tracking-tighter mb-1">Actual</p>
                                                            <pre className="bg-base-300 p-2 rounded-lg truncate text-error">{tc.stdout || 'No Output'}</pre>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Compile Error details */}
                                        {(selectedSub.compileOutput || selectedSub.stderr) && (
                                            <div className="bg-error/10 border border-error/20 p-4 rounded-2xl">
                                                <p className="text-[10px] font-bold text-error uppercase mb-2">Error Log</p>
                                                <pre className="text-[11px] font-mono text-error/80 whitespace-pre-wrap">{selectedSub.compileOutput || selectedSub.stderr}</pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
