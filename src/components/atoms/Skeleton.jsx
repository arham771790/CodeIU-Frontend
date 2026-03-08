"use client";
import React from 'react';

const Skeleton = ({ className }) => {
    return (
        <div className={`animate-pulse bg-base-content/10 rounded-xl ${className}`} />
    );
};

export default Skeleton;
