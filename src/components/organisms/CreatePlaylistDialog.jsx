"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Loader2, Edit3 } from "lucide-react";
import { usePlaylistStore } from "@/store/usePlaylistStore";

const CreatePlaylistDialog = ({ isOpen, onClose, editingPlaylist = null }) => {
    const { createPlaylist, updatePlaylist } = usePlaylistStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        coverGradient: "from-blue-600 to-blue-800",
        isPremium: false,
        isPublished: true,
    });

    useEffect(() => {
        if (editingPlaylist) {
            setFormData({
                title: editingPlaylist.title || "",
                description: editingPlaylist.description || "",
                coverGradient: editingPlaylist.coverGradient || "from-blue-600 to-blue-800",
                isPremium: Boolean(editingPlaylist.isPremium),
                isPublished: Boolean(editingPlaylist.isPublished),
            });
        } else {
            setFormData({
                title: "",
                description: "",
                coverGradient: "from-blue-600 to-blue-800",
                isPremium: false,
                isPublished: true,
            });
        }
    }, [editingPlaylist, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        try {
            setIsSubmitting(true);
            if (editingPlaylist) {
                await updatePlaylist(editingPlaylist.id, formData);
            } else {
                await createPlaylist(formData);
            }
            onClose();
            // Reset form
            setFormData({
                title: "",
                description: "",
                coverGradient: "from-blue-600 to-blue-800",
                isPremium: false,
                isPublished: true,
            });
        } catch (error) {
            // Error handled in store
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-base-200 w-full max-w-lg rounded-2xl border border-base-content/10 shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-base-content/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            {editingPlaylist ? <Edit3 size={20} /> : <Plus size={20} />}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{editingPlaylist ? "Edit Playlist" : "Create Playlist"}</h2>
                            <p className="text-xs opacity-50">{editingPlaylist ? "Update playlist details" : "Add a new curated playlist block"}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-ghost btn-square"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="create-playlist-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control w-full">
                            <label className="label cursor-pointer text-sm font-bold opacity-70">
                                Title <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Dynamic Programming Basics"
                                className="input input-bordered w-full bg-base-300 transition-all focus:bg-base-100"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label cursor-pointer text-sm font-bold opacity-70">
                                Description
                            </label>
                            <textarea
                                placeholder="What is this playlist about?"
                                className="textarea textarea-bordered w-full bg-base-300 transition-all focus:bg-base-100"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label cursor-pointer text-sm font-bold opacity-70">
                                Cover Gradient Configuration (Tailwind classes)
                            </label>
                            <input
                                type="text"
                                placeholder="from-blue-600 to-blue-800"
                                className="input input-bordered w-full bg-base-300 transition-all focus:bg-base-100"
                                value={formData.coverGradient}
                                onChange={(e) => setFormData({ ...formData, coverGradient: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-6 mt-2">
                            <label className="cursor-pointer label gap-2 justify-start w-max border border-base-content/10 px-4 py-2 rounded-xl bg-base-300/50">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary checkbox-sm"
                                    checked={formData.isPremium}
                                    onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                                />
                                <span className="label-text font-bold">Premium Only</span>
                            </label>
                            <label className="cursor-pointer label gap-2 justify-start w-max border border-base-content/10 px-4 py-2 rounded-xl bg-base-300/50">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-success checkbox-sm"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                />
                                <span className="label-text font-bold">Published</span>
                            </label>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-base-content/10 flex justify-end gap-3 bg-base-300/30">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-playlist-form"
                        className="btn btn-primary"
                        disabled={isSubmitting || !formData.title.trim()}
                    >
                        {isSubmitting ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            editingPlaylist ? "Save Changes" : "Create Playlist"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePlaylistDialog;
