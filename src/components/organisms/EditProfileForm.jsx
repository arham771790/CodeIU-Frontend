"use client";
import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { User, Mail, Github, Linkedin, AlignLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EditProfileForm = () => {
    const { authUser, updateProfile } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: authUser?.username || "",
        bio: authUser?.bio || "",
        github: authUser?.github || "",
        linkedin: authUser?.linkedin || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await updateProfile(formData);
        setLoading(false);
        if (success) {
            router.push('/profile');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />

                <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8">Metadata Configuration</h2>

                <div className="space-y-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Username</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Universal Identifier"
                                className="input input-bordered w-full pl-12 bg-base-300/50 border-base-content/10 focus:border-primary/50 transition-all rounded-xl text-sm font-bold"
                            />
                        </div>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Biography</span>
                        </label>
                        <div className="relative">
                            <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-primary opacity-50" />
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="System Description..."
                                className="textarea textarea-bordered w-full pl-12 bg-base-300/50 border-base-content/10 focus:border-primary/50 transition-all rounded-xl text-sm font-bold min-h-[120px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">GitHub</span>
                            </label>
                            <div className="relative">
                                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                                <input
                                    type="text"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    placeholder="Source Link"
                                    className="input input-bordered w-full pl-12 bg-base-300/50 border-base-content/10 focus:border-primary/50 transition-all rounded-xl text-sm font-bold"
                                />
                            </div>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">LinkedIn</span>
                            </label>
                            <div className="relative">
                                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder="Network Node"
                                    className="input input-bordered w-full pl-12 bg-base-300/50 border-base-content/10 focus:border-primary/50 transition-all rounded-xl text-sm font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 btn btn-primary rounded-xl font-black uppercase tracking-widest text-[10px] h-12"
                    >
                        {loading ? <span className="loading loading-spinner loading-xs"></span> : <Save size={16} className="mr-2" />}
                        Commit Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/profile')}
                        className="btn btn-ghost border border-base-content/10 rounded-xl font-black uppercase tracking-widest text-[10px] h-12"
                    >
                        <X size={16} className="mr-2" />
                        Abort
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EditProfileForm;
