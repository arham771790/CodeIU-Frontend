"use client";
import Link from "next/link";
import { Lock, Layers } from "lucide-react";

const PlaylistCard = ({ playlist, progress }) => {
    const percentage = progress?.percentage || 0;

    return (
        <Link
            href={`/explore/${playlist.slug}`}
            className="relative flex-shrink-0 w-72 h-44 rounded-[2rem] overflow-hidden group border border-base-content/10 bg-base-200 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10 block"
        >
            {/* Background Gradient */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${playlist.coverGradient || "from-blue-600 to-blue-800"} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6 z-10">
                <div>
                    <h3 className="font-black text-lg text-base-content tracking-tight leading-tight line-clamp-2">
                        {playlist.title}
                    </h3>
                    <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest opacity-40 mt-2">
                        <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {playlist.subdivisionsCount || 0} Patterns
                        </span>
                        <span>{playlist.totalProblems || 0} Problems</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full">
                    <div className="w-full bg-base-content/5 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(var(--p),0.5)] transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-tighter">
                            Progress
                        </span>
                        <span className="text-[10px] font-black text-primary uppercase">
                            {percentage}%
                        </span>
                    </div>
                </div>

                {/* Premium Badge */}
                {playlist.isPremium && (
                    <div className="absolute top-4 right-4 p-1.5 bg-base-100/80 rounded-lg border border-primary/20">
                        <Lock className="w-3.5 h-3.5 text-primary" />
                    </div>
                )}
            </div>
        </Link>
    );
};

export default PlaylistCard;
