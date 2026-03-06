import React from "react";
import { RefreshCw, Expand } from "lucide-react";

const EditorHeader = ({
    codeSnippets,
    selectedLanguage,
    setSelectedLanguage,
    formatCode,
    userTheme,
    setTheme,
}) => {
    return (
        <div className="bg-base-300/50 px-2 sm:px-4 py-2 flex items-center justify-between border-b border-base-content/10 gap-2">
            {/* Left: Language selector + format */}
            <div className="flex gap-2 sm:gap-4 items-center flex-shrink-0">
                <select
                    className="select select-ghost select-xs font-bold text-primary flex-shrink-0"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                    {Object.keys(codeSnippets || {}).map((lang) => (
                        <option
                            key={lang}
                            value={lang}
                            className="bg-base-200 text-base-content"
                        >
                            {lang.toUpperCase()}
                        </option>
                    ))}
                </select>

                <button
                    onClick={formatCode}
                    className="btn btn-ghost btn-xs gap-1 hover:text-primary transition-colors flex-shrink-0"
                >
                    <RefreshCw size={12} />
                    <span className="hidden sm:inline">Format</span>
                </button>
                <div className="divider divider-horizontal mx-0 h-4 self-center opacity-10"></div>
                <select
                    className="select select-ghost select-xs font-bold opacity-50 hover:opacity-100 flex-shrink-0"
                    value={userTheme}
                    onChange={(e) => setTheme(e.target.value)}
                >
                    <option value="vs-dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="hc-black">High Contrast</option>
                </select>
            </div>

            {/* Right: Expand */}
            <div className="flex gap-2 sm:gap-4 text-base-content/50 flex-shrink-0">
                <Expand
                    size={16}
                    className="cursor-pointer hover:text-primary transition-colors mt-1 hidden sm:block"
                />
            </div>
        </div>
    );
};

export default EditorHeader;
