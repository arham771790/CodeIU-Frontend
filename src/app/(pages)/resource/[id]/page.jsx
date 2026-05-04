"use client";

import { useEffect, useState } from "react";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { ArrowLeft, ExternalLink, FileText, Image as ImageIcon, Link as LinkIcon, Video } from "lucide-react";
import Link from "next/link";

export default function ResourceViewerPage({ params }) {
    const { currentPlaylist } = usePlaylistStore();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);

    const resourceId = params.id;

    useEffect(() => {
        if (!currentPlaylist || !currentPlaylist.subdivisions) {
            setLoading(false);
            return;
        }

        let foundResource = null;
        for (const sub of currentPlaylist.subdivisions) {
            if (sub.resources) {
                foundResource = sub.resources.find((r) => r.id === resourceId);
                if (foundResource) break;
            }
        }

        setResource(foundResource);
        setLoading(false);
    }, [currentPlaylist, resourceId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-300 flex items-center justify-center">
                <span className="loading loading-spinner text-secondary w-10 h-10"></span>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="min-h-screen bg-base-300 flex flex-col items-center justify-center gap-4">
                <div className="text-error font-bold">Resource not found</div>
                <Link href="/explore" className="btn btn-primary btn-sm">
                    Back to Explore
                </Link>
            </div>
        );
    }

    const { type, url, title } = resource;

    const renderViewer = () => {
        if (type === "VIDEO") {
            return (
                <video
                    controls
                    className="w-full h-full max-h-[80vh] rounded-xl shadow-2xl bg-black"
                    src={url}
                >
                    Your browser does not support the video tag.
                </video>
            );
        }

        if (type === "IMAGE") {
            return (
                <div className="flex items-center justify-center w-full h-[80vh] bg-base-100 rounded-xl overflow-hidden shadow-2xl">
                    <img
                        src={url}
                        alt={title}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            );
        }

        const isPdf = url && url.toLowerCase().includes('.pdf');

        if (isPdf || type === "FILE") {
            if (isPdf) {
                return (
                    <div className="w-full h-[85vh] rounded-xl overflow-hidden shadow-2xl border border-base-content/10">
                        <object data={url} type="application/pdf" className="w-full h-full border-none bg-base-100">
                            <iframe
                                src={url}
                                className="w-full h-full border-none bg-base-100"
                                title={title}
                                sandbox="allow-scripts allow-same-origin"
                            />
                        </object>
                    </div>
                );
            }
            if (url.match(/\.(doc|docx|ppt|pptx|xls|xlsx)$/i)) {
                return (
                    <div className="w-full h-[85vh] rounded-xl overflow-hidden shadow-2xl border border-base-content/10">
                        <iframe
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
                            className="w-full h-full border-none bg-base-100"
                            title={title}
                        />
                    </div>
                );
            }
        }

        // Generic fallback for file/link
        return (
            <div className="w-full flex justify-center py-20 px-6">
                <div className="card w-full max-w-lg bg-base-200 shadow-2xl border border-base-content/5">
                    <div className="card-body items-center text-center gap-6">
                        <div className="w-20 h-20 bg-secondary/10 flex items-center justify-center rounded-full text-secondary">
                            {type === 'LINK' ? <LinkIcon size={32} /> : <FileText size={32} />}
                        </div>
                        <div>
                            <h2 className="card-title justify-center text-2xl font-black mb-2">{title}</h2>
                            <p className="opacity-50 text-sm">This resource opens in a new tab.</p>
                        </div>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full gap-2">
                            Open Resource <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-base-300 flex flex-col">
            {/* Header */}
            <header className="h-16 px-6 bg-base-200/50 backdrop-blur-md border-b border-base-content/5 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-ghost btn-circle btn-sm hover:bg-base-content/10 text-base-content opacity-70 hover:opacity-100"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">{type}</span>
                        <h1 className="font-bold text-sm sm:text-base max-w-[200px] sm:max-w-md truncate">{title}</h1>
                    </div>
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm gap-2 text-xs opacity-60 hover:opacity-100"
                >
                    <ExternalLink size={14} className="hidden sm:block" />
                    Open Source
                </a>
            </header>

            {/* Viewer Stage */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-500">
                {renderViewer()}
            </main>
        </div>
    );
}

