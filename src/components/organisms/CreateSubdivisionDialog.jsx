"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Loader2, Edit3 } from "lucide-react";
import { usePlaylistStore } from "@/store/usePlaylistStore";

const CreateSubdivisionDialog = ({ isOpen, onClose, playlistId, editingSubdivision = null }) => {
    const { addSubdivision, updateSubdivision } = usePlaylistStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        order: 0,
    });

    useEffect(() => {
        if (editingSubdivision) {
            setFormData({
                title: editingSubdivision.title || "",
                order: editingSubdivision.order || 0,
            });
        } else {
            setFormData({ title: "", order: 0 });
        }
    }, [editingSubdivision, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        try {
            setIsSubmitting(true);
            if (editingSubdivision) {
                await updateSubdivision(playlistId, editingSubdivision.id, formData);
            } else {
                await addSubdivision(playlistId, formData);
            }
            onClose();
        } catch (error) {
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-base-200 w-full max-w-md rounded-2xl border border-base-content/10 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-base-content/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            {editingSubdivision ? <Edit3 size={20} /> : <Plus size={20} />}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{editingSubdivision ? "Edit Subdivision" : "Create Subdivision"}</h2>
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
                <div className="p-6">
                    <form id="create-subdivision-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control w-full">
                            <label className="label cursor-pointer text-sm font-bold opacity-70">
                                Title <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Arrays and Strings"
                                className="input input-bordered w-full bg-base-300 transition-all focus:bg-base-100"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-control w-full">
                            <label className="label cursor-pointer text-sm font-bold opacity-70">
                                Order
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                className="input input-bordered w-full bg-base-300 transition-all focus:bg-base-100"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                            />
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
                        form="create-subdivision-form"
                        className="btn btn-primary"
                        disabled={isSubmitting || !formData.title.trim()}
                    >
                        {isSubmitting ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            editingSubdivision ? "Save Changes" : "Create"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateSubdivisionDialog;
