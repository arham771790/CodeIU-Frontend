"use client";
import React, { useState, useEffect } from "react";
import { Search, Plus, X, Layers, Book, Check } from "lucide-react";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { toast } from "react-toastify";

const AdminAddToPlaylistDialog = ({ isOpen, onClose, problem }) => {
    const { fetchAllPlaylists, playlists, addProblemToSubdivision, fetchPlaylistDetail } = usePlaylistStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [selectedSubdivisionId, setSelectedSubdivisionId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchAllPlaylists(true);
            setSelectedPlaylistId(null);
            setSelectedPlaylist(null);
            setSelectedSubdivisionId(null);
            setSearchQuery("");
        }
    }, [isOpen, fetchAllPlaylists]);

    const handleSelectPlaylist = async (id) => {
        setSelectedPlaylistId(id);
        setIsLoading(true);
        try {
            const detail = await fetchPlaylistDetail(id);
            setSelectedPlaylist(detail);
            if (detail?.subdivisions?.length > 0) {
                setSelectedSubdivisionId(detail.subdivisions[0].id);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!selectedSubdivisionId) {
            toast.error("Please select a subdivision");
            return;
        }

        setIsLoading(true);
        try {
            await addProblemToSubdivision(selectedPlaylistId, selectedSubdivisionId, problem.id);
            onClose();
        } catch (error) {
            // Error toast handled by store
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredPlaylists = playlists.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-base-content/5 flex items-center justify-between bg-base-200/50">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter">Add to Playlist</h3>
                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mt-1">
                            Problem: <span className="text-primary">{problem?.title}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col p-8 space-y-6">
                    {!selectedPlaylistId ? (
                        <>
                            {/* Playlist Selection */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                                <input
                                    type="text"
                                    placeholder="SEARCH PLAYLISTS..."
                                    className="input input-bordered w-full pl-12 rounded-2xl text-[10px] font-black tracking-widest uppercase bg-base-200/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                                {filteredPlaylists.length > 0 ? (
                                    filteredPlaylists.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => handleSelectPlaylist(p.id)}
                                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-base-200/50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-4 text-left">
                                                <div className={`w-10 h-10 bg-gradient-to-br ${p.coverGradient || 'from-blue-600 to-blue-800'} rounded-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                                                <div>
                                                    <h4 className="text-xs font-black uppercase tracking-tighter">{p.title}</h4>
                                                    <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest flex items-center gap-1 mt-1">
                                                        <Layers size={10} /> {p.subdivisionsCount || 0} Patterns
                                                    </span>
                                                </div>
                                            </div>
                                            <Plus size={16} className="opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-12 opacity-30 space-y-4">
                                        <Book size={48} className="mx-auto" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No playlists found</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Subdivision Selection */}
                            <div className="flex items-center justify-between bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 bg-gradient-to-br ${selectedPlaylist.coverGradient || 'from-blue-600 to-blue-800'} rounded-lg`} />
                                    <h4 className="text-xs font-black uppercase tracking-tighter">{selectedPlaylist.title}</h4>
                                </div>
                                <button
                                    onClick={() => setSelectedPlaylistId(null)}
                                    className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                                >
                                    Change Playlist
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-widest opacity-30">Select Subdivision</h5>
                                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {selectedPlaylist.subdivisions?.length > 0 ? (
                                        selectedPlaylist.subdivisions.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => setSelectedSubdivisionId(s.id)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedSubdivisionId === s.id
                                                        ? 'bg-primary/20 border-primary shadow-lg shadow-primary/5'
                                                        : 'bg-base-200/50 border-transparent hover:border-base-content/10'
                                                    }`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedSubdivisionId === s.id ? 'text-primary' : 'opacity-60'}`}>
                                                    {s.title}
                                                </span>
                                                {selectedSubdivisionId === s.id && <Check size={14} className="text-primary" />}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center bg-base-200/30 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">This playlist has no subdivisions</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={isLoading || !selectedSubdivisionId}
                                className="btn btn-primary w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {isLoading ? <span className="loading loading-spinner loading-xs" /> : "Confirm Attachment"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAddToPlaylistDialog;
