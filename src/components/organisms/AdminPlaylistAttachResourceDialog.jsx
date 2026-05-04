"use client";

import { useState } from "react";
import { X, Plus, UploadCloud, Link as LinkIcon, FileCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { toast } from "react-toastify";

export default function AdminPlaylistAttachResourceDialog({ playlistId, subdivisionId }) {
    const { authUser } = useAuthStore();
    const isAdmin = authUser?.role === "ADMIN";
    const { addResourceToSubdivision, currentPlaylist } = usePlaylistStore();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form fields
    const [title, setTitle] = useState("");
    const [type, setType] = useState("FILE"); // File / Video / Link
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [uploadMode, setUploadMode] = useState("UPLOAD"); // UPLOAD | LINK

    const currentSubdivision = currentPlaylist?.subdivisions?.find(s => s.id === subdivisionId);

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const uploadToCloudinary = async (fileToUpload) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            throw new Error("Cloudinary configuration is missing. Please check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
        }

        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("upload_preset", uploadPreset);

        // using auto instead of image/video to support pdfs and docs
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "Cloudinary upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (!title.trim()) {
                toast.error("Please provide a title");
                return;
            }

            let finalUrl = url;

            if (uploadMode === "UPLOAD") {
                if (!file) {
                    toast.error("Please select a file to upload");
                    return;
                }
                const toastId = toast.loading("Uploading to Cloudinary...");
                try {
                    finalUrl = await uploadToCloudinary(file);
                    toast.update(toastId, { render: "Upload complete!", type: "success", isLoading: false, autoClose: 2000 });
                } catch (err) {
                    toast.update(toastId, { render: err.message, type: "error", isLoading: false, autoClose: 3000 });
                    return;
                }
            } else {
                if (!finalUrl.trim()) {
                    toast.error("Please provide a valid URL");
                    return;
                }
            }

            const order = currentSubdivision?.resources?.length || 0;

            await addResourceToSubdivision(playlistId, subdivisionId, {
                title,
                url: finalUrl,
                type,
                order
            });

            setOpen(false);
            // Reset state
            setTitle("");
            setFile(null);
            setUrl("");
            setUploadMode("UPLOAD");
            setType("FILE");
        } catch (e) {
            // Error handling done in store
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) return null;

    return (
        <>
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(true); }}
                className="btn btn-ghost btn-xs text-secondary hover:bg-secondary/10 gap-1 rounded-full px-3 h-7 flex items-center justify-center -ml-2"
            >
                <Plus className="w-3 h-3" /> Add Resource/File
            </button>

            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-base-100/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

                    <div className="relative w-full max-w-md bg-base-200 border border-base-content/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-base-content/5 flex items-center justify-between bg-base-300/30">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                                    <FileCheck size={16} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black tracking-tight">Attach Resource</h3>
                                    <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest">{currentSubdivision?.title}</p>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-2 hover:bg-base-content/10 rounded-full transition-colors opacity-50 hover:opacity-100">
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

                            {/* Title */}
                            <div className="form-control w-full flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-60">Resource Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Hashmap Pattern PDF"
                                    className="input input-bordered w-full bg-base-300 focus:outline-none focus:border-secondary transition-colors"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2 bg-base-300/50 p-1 rounded-xl w-full border border-base-content/10">
                                <button
                                    type="button"
                                    onClick={() => setUploadMode("UPLOAD")}
                                    className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${uploadMode === 'UPLOAD' ? 'bg-base-100 shadow-sm text-secondary' : 'opacity-50 hover:opacity-100'}`}
                                >
                                    <UploadCloud size={16} /> Upload File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUploadMode("LINK")}
                                    className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${uploadMode === 'LINK' ? 'bg-base-100 shadow-sm text-secondary' : 'opacity-50 hover:opacity-100'}`}
                                >
                                    <LinkIcon size={16} /> Direct URL Link
                                </button>
                            </div>

                            {uploadMode === "UPLOAD" ? (
                                <div className="form-control w-full flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider opacity-60">Select File</label>
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered w-full bg-base-300 transition-colors file-input-secondary"
                                        onChange={handleFileChange}
                                        required={uploadMode === "UPLOAD" && !file}
                                    />
                                    <span className="text-[10px] opacity-40 italic">Note: Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME & UPLOAD_PRESET in .env</span>
                                </div>
                            ) : (
                                <div className="form-control w-full flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider opacity-60">Direct Link</label>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="input input-bordered w-full bg-base-300 focus:outline-none focus:border-secondary transition-colors"
                                        required={uploadMode === "LINK"}
                                    />
                                </div>
                            )}

                            <div className="form-control w-full flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-60">Type of Resource</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="select select-bordered w-full bg-base-300 focus:outline-none focus:border-secondary transition-colors"
                                >
                                    <option value="FILE">Document / PDF</option>
                                    <option value="VIDEO">Video</option>
                                    <option value="IMAGE">Image</option>
                                    <option value="LINK">External Link</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-secondary mt-2 shadow-lg shadow-secondary/20"
                            >
                                {loading && <span className="loading loading-spinner w-4 h-4"></span>}
                                {loading ? "Attaching..." : "Attach Resource"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
