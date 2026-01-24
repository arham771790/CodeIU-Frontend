"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Code, Clock, Database, ChevronLeft, Shield, Lock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function SubmissionDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [submission, setSubmission] = useState(null);
    const [sourceCode, setSourceCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessError, setAccessError] = useState(null);

    useEffect(() => {
        async function fetchSubmissionData() {
            try {
                setLoading(true);
                // 1. Fetch metadata
                const metaRes = await fetch(`/api/v1/submissions/${id}`);
                const metaData = await metaRes.json();

                if (!metaRes.ok) throw new Error(metaData.error || "Failed to fetch submission");
                setSubmission(metaData.submission);

                // 2. Fetch source code (access controlled)
                const sourceRes = await fetch(`/api/v1/submissions/${id}/source`);
                const sourceData = await sourceRes.json();

                if (sourceRes.ok) {
                    setSourceCode(sourceData.sourceCode);
                } else {
                    setAccessError(sourceData.error || "Access Denied");
                }
            } catch (err) {
                console.error("Error fetching submission details:", err);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchSubmissionData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <span className="loading loading-ring loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 p-6 md:p-12 text-base-content font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Navigation / Header */}
                <div className="flex items-center justify-between mb-10">
                    <button onClick={() => router.back()} className="btn btn-ghost rounded-2xl gap-2 font-black uppercase text-[10px] tracking-widest bg-base-300">
                        <ChevronLeft size={16} /> Back
                    </button>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
                        Submission Node: <span className="font-mono text-primary">{id}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Sidebar: Metadata */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-base-200 border-2 border-base-content/5 rounded-[2.5rem] p-8 shadow-2xl">
                            <h2 className="text-xl font-black uppercase mb-8 flex items-center gap-3">
                                <Database size={20} className="text-primary" /> Metadata
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest">Problem</p>
                                    <p className="text-xl font-bold tracking-tight">{submission?.problemId}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest">Status</p>
                                    <div className={`badge badge-lg border-none font-black uppercase tracking-widest text-[10px] h-7 px-4 shadow-sm ${submission?.status === "Accepted" ? "bg-success text-success-content" : "bg-error text-error-content"
                                        }`}>
                                        {submission?.status}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest">Execution Metrics</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-base-300 p-3 rounded-2xl border border-base-content/5">
                                            <Clock size={14} className="opacity-30 mb-1" />
                                            <p className="text-xs font-bold font-mono">{submission?.time || "0ms"}</p>
                                        </div>
                                        <div className="bg-base-300 p-3 rounded-2xl border border-base-content/5">
                                            <Database size={14} className="opacity-30 mb-1" />
                                            <p className="text-xs font-bold font-mono">{submission?.memory || "0KB"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest">Language</p>
                                    <p className="text-sm font-bold opacity-80">{submission?.language}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest">Timestamp</p>
                                    <p className="text-sm font-bold opacity-80">{new Date(submission?.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Area: Source Code */}
                    <div className="lg:col-span-3">
                        <div className="bg-base-200 border-2 border-base-content/5 rounded-[2.5rem] h-full shadow-2xl flex flex-col overflow-hidden">
                            <header className="px-8 py-5 border-b border-base-content/10 bg-base-300/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Code size={18} className="text-primary" />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Source Code Viewer</h3>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-xl border border-primary/20">
                                    <Shield size={12} className="text-primary" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Secure Access</span>
                                </div>
                            </header>

                            <div className="flex-1 min-h-[500px] p-8 font-mono text-sm leading-relaxed overflow-auto bg-[#0a0a1a] text-blue-100">
                                {sourceCode ? (
                                    <pre className="whitespace-pre-wrap">
                                        <code className="block">
                                            {typeof sourceCode === "string" ? sourceCode : JSON.stringify(sourceCode, null, 2)}
                                        </code>
                                    </pre>
                                ) : accessError === "contest_not_ended" ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto p-10 bg-base-300/20 rounded-[3rem] border border-warning/10 border-dashed animate-pulse">
                                        <Lock size={64} className="text-warning mb-6" />
                                        <h4 className="text-xl font-black uppercase mb-4 text-warning">Code Is Encrypted</h4>
                                        <p className="text-xs opacity-60 font-medium leading-relaxed">
                                            This submission is part of an ongoing contest. Code access is restricted to the owner until the contest ends to maintain integrity.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                        <XCircle size={48} className="mb-4" />
                                        <p className="font-black uppercase tracking-widest text-xs">{accessError || "Failed to load buffer"}</p>
                                    </div>
                                )}
                            </div>

                            <footer className="px-8 py-4 bg-base-300/30 border-t border-base-content/5 text-[9px] font-black uppercase tracking-widest opacity-20 text-right">
                                Verified by CodeIU Integrity Node
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
