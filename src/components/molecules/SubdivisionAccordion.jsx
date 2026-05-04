"use client";
import { useState } from "react";
import { ChevronDown, CheckCircle, Circle, Trash2, Edit, FileText, Video, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import AdminPlaylistAttachProblemDialog from "@/components/organisms/AdminPlaylistAttachProblemDialog";
import AdminPlaylistAttachResourceDialog from "@/components/organisms/AdminPlaylistAttachResourceDialog";
import CreateSubdivisionDialog from "@/components/organisms/CreateSubdivisionDialog";

const DIFFICULTY_COLORS = {
    EASY: "text-success",
    MEDIUM: "text-warning",
    HARD: "text-error",
};

const getResourceIcon = (type) => {
    switch (type) {
        case 'VIDEO': return <Video size={16} className="text-primary" />;
        case 'LINK': return <LinkIcon size={16} className="text-secondary" />;
        case 'IMAGE': return <ImageIcon size={16} className="text-accent" />;
        default: return <FileText size={16} className="text-info" />;
    }
};

const cleanTitle = (title, problemNo) => {
    if (!title) return "";
    const prefix = `${problemNo}. `;
    if (title.startsWith(prefix)) {
        return title.slice(prefix.length);
    }
    return title;
};

const SubdivisionAccordion = ({ playlistId, subdivision, solvedIds = [] }) => {
    const { authUser } = useAuthStore();
    const isAdmin = authUser?.role === "ADMIN";
    const { deleteSubdivision, removeProblemFromSubdivision, removeResourceFromSubdivision } = usePlaylistStore();

    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const solvedSet = new Set(solvedIds);
    const solved = subdivision.problems.filter((p) =>
        solvedSet.has(p.problemId),
    ).length;
    const total = subdivision.problems.length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    return (
        <div className="border border-base-content/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-base-content/20 bg-base-200/20">
            {/* Accordion Header */}
            <div
                className="w-full flex items-center justify-between p-4 md:p-5 bg-base-200/50 hover:bg-base-200/80 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3 min-w-0 cursor-pointer flex-1">
                    <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${percentage === 100
                            ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                            : percentage > 0
                                ? "bg-primary shadow-[0_0_8px_rgba(var(--p),0.4)]"
                                : "bg-base-content/20"
                            }`}
                    />
                    <span className="text-sm font-bold truncate">
                        {subdivision.title}
                    </span>
                    <span className="text-[10px] font-mono opacity-40 flex-shrink-0">
                        {solved}/{total}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {/* Mini progress bar */}
                    <div className="hidden sm:block w-20 h-1 bg-base-content/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 cursor-pointer ${isOpen ? "rotate-180" : ""}`}
                    />
                    {isAdmin && (
                        <div className="flex items-center gap-1 ml-2 opacity-60" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="p-1.5 hover:bg-base-content/10 hover:text-primary rounded-lg transition-all"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this subdivision?")) {
                                        deleteSubdivision(playlistId, subdivision.id);
                                    }
                                }}
                                className="p-1.5 hover:bg-error/10 hover:text-error rounded-lg transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Accordion Body */}
            <div
                className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                {isAdmin && (
                    <div className="px-6 py-2 border-b border-base-content/5 bg-base-200/30 flex justify-end gap-2">
                        <AdminPlaylistAttachResourceDialog playlistId={playlistId} subdivisionId={subdivision.id} />
                        <AdminPlaylistAttachProblemDialog playlistId={playlistId} subdivisionId={subdivision.id} />
                    </div>
                )}
                <div className="divide-y divide-base-content/5">
                    {/* Render Resources first */}
                    {(subdivision.resources || []).map((resource) => (
                        <div key={resource.id} className="flex items-center hover:bg-base-content/5 transition-colors group relative bg-base-300/30">
                            <Link
                                href={`/resource/${resource.id}`}
                                className="flex items-center gap-3 px-6 py-3.5 flex-1"
                            >
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-base-100 flex-shrink-0 border border-base-content/10 shadow-sm">
                                    {getResourceIcon(resource.type)}
                                </div>
                                <span className="text-sm font-semibold group-hover:text-secondary transition-colors truncate">
                                    {resource.title}
                                </span>
                                <span className="ml-auto text-[10px] uppercase font-bold opacity-30 px-2 py-0.5 rounded-full bg-base-content/10">
                                    {resource.type}
                                </span>
                            </Link>
                            {isAdmin && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (confirm("Remove resource?")) {
                                            removeResourceFromSubdivision(playlistId, subdivision.id, resource.id);
                                        }
                                    }}
                                    className="absolute right-4 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/10 hover:text-error rounded-lg z-10"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Render Problems */}
                    {subdivision.problems.map((pp) => {
                        const isSolved = solvedSet.has(pp.problemId);
                        const problem = pp.problem;

                        return (
                            <div key={pp.id} className="flex items-center hover:bg-primary/5 transition-colors group relative">
                                <Link
                                    href={`/problems/${problem.slug || problem.id}`}
                                    className="flex items-center gap-3 px-6 py-3.5 flex-1"
                                >
                                    {isSolved ? (
                                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                                    ) : (
                                        <Circle className="w-4 h-4 opacity-20 group-hover:opacity-40 transition-colors flex-shrink-0" />
                                    )}
                                    <span className="text-xs font-mono opacity-30 flex-shrink-0">
                                        {String(problem.problemNo ?? "").padStart(2, "0")}
                                    </span>
                                    <span className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                                        {cleanTitle(problem.title, problem.problemNo)}
                                    </span>
                                    <span
                                        className={`ml-auto text-[10px] font-bold uppercase flex-shrink-0 mr-4 ${DIFFICULTY_COLORS[problem.difficulty] || "opacity-40"
                                            }`}
                                    >
                                        {problem.difficulty}
                                    </span>
                                </Link>
                                {isAdmin && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            if (confirm("Remove problem?")) {
                                                removeProblemFromSubdivision(playlistId, subdivision.id, problem.id);
                                            }
                                        }}
                                        className="absolute right-4 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/10 hover:text-error rounded-lg z-10"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {isAdmin && isEditOpen && (
                <CreateSubdivisionDialog
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    playlistId={playlistId}
                    editingSubdivision={subdivision}
                />
            )}
        </div>
    );
};

export default SubdivisionAccordion;
