'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Terminal, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-base-300 text-base-content font-sans overflow-hidden relative flex flex-col items-center justify-center px-4">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />

            <div className="relative z-10 text-center max-w-2xl">
                {/* 404 Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-error/10 border border-error/20 px-4 py-1.5 rounded-full mb-8"
                >
                    <AlertTriangle size={14} className="text-error" />
                    <span className="text-error text-[10px] font-black tracking-[0.2em] uppercase">
                        Protocol Error // 404
                    </span>
                </motion.div>

                {/* Hero Title */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-7xl md:text-9xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-primary/60"
                >
                    LOST IN <br /> SPACE
                </motion.h1>

                {/* Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-base-content/60 text-lg md:text-xl font-medium mb-12 max-w-lg mx-auto leading-relaxed"
                >
                    The requested coordinate does not exist within the CodeIU matrix.
                    Your current trajectory has lead you outside the known boundary.
                </motion.p>

                {/* Visual Decoration */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative mb-16"
                >
                    <div className="h-0.5 w-32 bg-primary mx-auto rounded-full shadow-[0_0_20px_rgba(var(--p),0.6)]" />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-base-200 border border-primary/30 p-3 rounded-2xl animate-bounce">
                        <Terminal className="text-primary w-6 h-6" />
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-base-200 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-base-100 transition-all hover:border-primary/40 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Previous Node
                    </button>

                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all"
                    >
                        <Home size={14} />
                        Command Center
                    </Link>
                </motion.div>
            </div>

            {/* Footer System Status */}
            <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-20">
                    Global Matrix Status // Operational // CodeIU_404_Handler
                </p>
            </div>
        </div>
    );
}
