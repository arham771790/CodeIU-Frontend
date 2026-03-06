"use client";
import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger" // danger, warning, info
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: "bg-error/10",
            text: "text-error",
            btn: "btn-error",
            icon: <AlertTriangle className="w-8 h-8" />
        },
        warning: {
            bg: "bg-warning/10",
            text: "text-warning",
            btn: "btn-warning",
            icon: <AlertTriangle className="w-8 h-8" />
        },
        info: {
            bg: "bg-primary/10",
            text: "text-primary",
            btn: "btn-primary",
            icon: <AlertTriangle className="w-8 h-8" />
        }
    };

    const style = colors[type] || colors.danger;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <div className="bg-base-100 border border-base-content/10 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl transform animate-in fade-in zoom-in duration-200 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-base-content/5 rounded-full transition-colors opacity-40 hover:opacity-100"
                >
                    <X size={20} />
                </button>

                <div className="text-center space-y-4">
                    <div className={`w-16 h-16 ${style.bg} ${style.text} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                        {style.icon}
                    </div>

                    <h3 className="text-xl font-black uppercase tracking-tighter text-base-content">
                        {title}
                    </h3>

                    <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest leading-relaxed">
                        {message}
                    </p>

                    <div className="flex flex-col gap-3 pt-6">
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`btn ${style.btn} btn-md rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-md rounded-xl font-black uppercase tracking-widest text-[10px] text-base-content/40 hover:text-base-content"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
