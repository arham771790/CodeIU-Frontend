"use client";
import React, { useEffect, useState } from "react";
import { Compass, Zap, Loader2, Plus } from "lucide-react";
import GridHighlights from "@/components/atoms/GridHighlights";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { useAuthStore } from "@/store/useAuthStore";
import dynamic from "next/dynamic";

const PlaylistCard = dynamic(() => import("@/components/organisms/PlaylistCard"), {
    loading: () => <div className="min-w-[300px] h-64 bg-base-200 rounded-[2.5rem] animate-pulse" />
});

const CreatePlaylistDialog = dynamic(() => import("@/components/organisms/CreatePlaylistDialog"), {
    ssr: false
});

const CourseSection = ({ title, children, isEmpty, isAdmin, onCreateClick }) => (
    <section className="relative">
        <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--p),0.5)]" />
                <h2 className="text-2xl font-black uppercase tracking-tight text-base-content">
                    {title} <span className="opacity-20">Modules</span>
                </h2>
            </div>
            {isAdmin && (
                <button
                    onClick={onCreateClick}
                    className="btn btn-primary btn-sm rounded-full gap-2"
                >
                    <Plus size={16} /> Create Playlist
                </button>
            )}
        </div>
        {isEmpty ? (
            <div className="flex items-center justify-center py-16 opacity-20">
                <span className="text-sm font-black uppercase tracking-widest">
                    No playlists available yet
                </span>
            </div>
        ) : (
            <div className="flex gap-8 pb-6 -mx-4 px-4 overflow-x-auto custom-scrollbar">
                {children}
            </div>
        )}
    </section>
);

const ExploreView = () => {
    const { playlists, isPlaylistsLoading, fetchAllPlaylists } =
        usePlaylistStore();
    const { authUser } = useAuthStore();
    const isAdmin = authUser?.role === "ADMIN";
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        fetchAllPlaylists();
    }, [fetchAllPlaylists]);

    return (
        <div className="min-h-screen bg-base-300 text-base-content font-sans overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-20 pointer-events-none" />

            <div className="absolute top-0 left-0 w-full h-[100vh] [mask-image:linear-gradient(to_bottom,black_40%,transparent)] pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <GridHighlights />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24">
                <header className="relative z-10 text-center mb-10 py-12 md:py-24">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-primary/60 blur-[100px] rounded-full animate-pulse pointer-events-none" />

                    <div className="flex flex-col items-center relative z-10">
                        <h1 className="relative text-5xl md:text-7xl font-black tracking-tighter mb-4 flex items-center justify-center">
                            <span className="text-base-content">Explore</span>
                            <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-primary/60 mx-4 animate-pulse">
                                X
                                <div className="absolute -top-6 -right-5 md:-top-7 md:-right-6 flex items-end pointer-events-none">
                                    <div className="relative p-2 bg-base-200 border-2 border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(var(--p),0.5)] animate-bounce">
                                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse pointer-events-none" />
                                        <div className="absolute inset-[-8px] border border-dashed border-primary/40 rounded-full animate-[spin_10s_linear_infinite] opacity-50" />
                                        <Compass className="text-primary w-5 h-5 md:w-6 md:h-6 relative z-10 drop-shadow-[0_0_8px_rgba(var(--p),0.8)]" />
                                    </div>
                                </div>
                            </span>
                        </h1>

                        <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mt-2">
                            Master coding through curated playlists and patterns.
                        </p>

                        <div className="h-1.5 w-24 bg-primary mt-6 rounded-full shadow-[0_0_20px_rgba(var(--p),0.6)] mx-auto" />
                    </div>
                </header>

                {isPlaylistsLoading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-40" />
                    </div>
                ) : (
                    <div className="space-y-24">
                        <CourseSection
                            title="Playlists"
                            isEmpty={playlists.length === 0}
                            isAdmin={isAdmin}
                            onCreateClick={() => setIsCreateOpen(true)}
                        >
                            {playlists.map((playlist) => (
                                <PlaylistCard key={playlist.id} playlist={playlist} progress={playlist.progress} />
                            ))}
                        </CourseSection>

                        <div className="flex flex-col items-center justify-center py-20 border-t border-base-content/5">
                            <div className="flex items-center gap-3 mb-4 opacity-20">
                                <Zap size={20} className="text-primary" />
                                <span className="text-xs font-black uppercase tracking-[0.5em]">
                                    Future Updates
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-base-content opacity-10 uppercase tracking-tighter">
                                Coming soon...
                            </h1>
                        </div>
                    </div>
                )}
            </div>
            <CreatePlaylistDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </div>
    );
};

export default ExploreView;
