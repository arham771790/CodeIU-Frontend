"use client";
import React from 'react';
import EditProfileForm from '@/components/organisms/EditProfileForm';
import GridHighlights from '@/components/atoms/GridHighlights';

const EditProfilePage = () => {
    return (
        <div className="min-h-screen bg-base-300 text-base-content font-sans overflow-hidden relative pb-20">
            {/* Global Background Grid */}
            <div className="absolute top-0 left-0 w-full h-[100vh] [mask-image:linear-gradient(to_bottom,black_40%,transparent)] pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <GridHighlights />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-base-content tracking-tighter mb-4">Edit Profile</h1>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Modify System Parameters</p>
                </div>

                <EditProfileForm />
            </div>
        </div>
    );
};

export default EditProfilePage;
