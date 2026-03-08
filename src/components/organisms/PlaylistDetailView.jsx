"use client";
import { useEffect } from "react";
import { ArrowLeft, Layers, Target, Trophy } from "lucide-react";
import Link from "next/link";
import SubdivisionAccordion from "@/components/molecules/SubdivisionAccordion";
import ProgressRing from "@/components/atoms/ProgressRing";
import GridHighlights from "@/components/atoms/GridHighlights";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import Loader from "@/components/atoms/Loader";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2 } from "lucide-react";
import CreateSubdivisionDialog from "@/components/organisms/CreateSubdivisionDialog";
import CreatePlaylistDialog from "@/components/organisms/CreatePlaylistDialog";
import React, { useState } from "react";

const PlaylistDetailView = ({ slug }) => {
    const { currentPlaylist, isPlaylistLoading, fetchPlaylistDetail, deletePlaylist } =
        usePlaylistStore();
    const { authUser } = useAuthStore();
    const isAdmin = authUser?.role === "ADMIN";
    const router = useRouter();

    const [isEditPlaylistOpen, setIsEditPlaylistOpen] = useState(false);
    const [isAddSubdivisionOpen, setIsAddSubdivisionOpen] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchPlaylistDetail(slug);
        }
    }, [slug, fetchPlaylistDetail]);

    if (isPlaylistLoading || !currentPlaylist) {
        return (
            <div className="min-h-screen bg-base-300 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    const playlist = currentPlaylist;
    const progress = playlist.progress || {
        solvedIds: [],
        solved: 0,
        total: 0,
        percentage: 0,
    };
    const totalProblems = playlist.subdivisions?.reduce(
        (sum, s) => sum + (s.problems?.length || 0),
        0,
    ) || 0;

    const handleDeletePlaylist = async () => {
        if (!confirm("Are you sure you want to delete this playlist?")) return;
        await deletePlaylist(playlist.id);
        router.push("/explore");
    };

    return (
        <div className="min-h-screen bg-base-300 text-base-content font-sans overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-20 pointer-events-none" />

            <div className="absolute top-0 left-0 w-full h-[100vh] [mask-image:linear-gradient(to_bottom,black_40%,transparent)] pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <GridHighlights />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-20">
                {/* Back button */}
                <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 text-sm opacity-40 hover:opacity-100 hover:text-primary transition-all mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">
                        Back to Explore
                    </span>
                </Link>

                {/* Header */}
                <header className="mb-16">
                    <div className="flex justify-between items-start">
                        <div>
                            <div
                                className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${playlist.coverGradient || "from-blue-600 to-blue-800"} bg-opacity-20 mb-4`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content opacity-60">
                                    Playlist
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">
                                {playlist.title}
                            </h1>
                            {playlist.description && (
                                <p className="text-sm opacity-50 max-w-2xl leading-relaxed">
                                    {playlist.description}
                                </p>
                            )}
                        </div>
                        {isAdmin && (
                            <div className="flex items-center gap-2 relative z-20">
                                <button
                                    onClick={() => setIsEditPlaylistOpen(true)}
                                    className="btn btn-sm btn-ghost hover:bg-base-content/10 rounded-xl"
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                <button
                                    onClick={handleDeletePlaylist}
                                    className="btn btn-sm btn-ghost text-error hover:bg-error/10 rounded-xl"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-6 mt-8">
                        <div className="flex items-center gap-2">
                            <ProgressRing percentage={progress.percentage} size={48} strokeWidth={3} />
                        </div>
                        <div className="flex items-center gap-2 opacity-50">
                            <Layers className="w-4 h-4" />
                            <span className="text-xs font-bold">
                                {playlist.subdivisions?.length || 0} Patterns
                            </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-50">
                            <Target className="w-4 h-4" />
                            <span className="text-xs font-bold">
                                {totalProblems} Problems
                            </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-50">
                            <Trophy className="w-4 h-4" />
                            <span className="text-xs font-bold">
                                {progress.solved}/{progress.total} Solved
                            </span>
                        </div>
                    </div>
                </header>

                {isAdmin && (
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Patterns</h3>
                        <button
                            onClick={() => setIsAddSubdivisionOpen(true)}
                            className="btn btn-primary btn-sm rounded-full gap-2 relative z-20"
                        >
                            <Plus size={16} /> Add Subdivision
                        </button>
                    </div>
                )}

                {/* Subdivisions */}
                <div className="space-y-4 relative z-20">
                    {playlist.subdivisions?.map((subdivision) => (
                        <SubdivisionAccordion
                            key={subdivision.id}
                            playlistId={playlist.id}
                            subdivision={subdivision}
                            solvedIds={progress.solvedIds}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {(!playlist.subdivisions || playlist.subdivisions.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-32 opacity-20">
                        <Layers className="w-10 h-10 mb-4" />
                        <span className="text-sm font-black uppercase tracking-widest">
                            No patterns added yet
                        </span>
                    </div>
                )}
            </div>
            {isAdmin && (
                <>
                    <CreatePlaylistDialog
                        isOpen={isEditPlaylistOpen}
                        onClose={() => setIsEditPlaylistOpen(false)}
                        editingPlaylist={playlist}
                    />
                    <CreateSubdivisionDialog
                        isOpen={isAddSubdivisionOpen}
                        onClose={() => setIsAddSubdivisionOpen(false)}
                        playlistId={playlist.id}
                    />
                </>
            )}
        </div>
    );
};

export default PlaylistDetailView;
