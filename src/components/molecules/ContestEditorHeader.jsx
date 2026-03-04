import React from "react";
import { RefreshCw, Expand } from "lucide-react";

const ContestEditorHeader = ({
    selectedLanguage,
    setSelectedLanguage,
    codeSnippets,
    setUserCode,
    problemId,
}) => {
    return (
        <div className="px-4 py-2 border-b border-base-content/5 flex items-center justify-between bg-base-300/30">
            <select
                className="bg-transparent text-xs font-bold uppercase tracking-widest text-primary focus:outline-none"
                value={selectedLanguage}
                onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                }}
            >
                {Object.keys(codeSnippets || {}).map((lang) => (
                    <option key={lang} value={lang} className="bg-base-200">
                        {lang}
                    </option>
                ))}
            </select>
            <div className="flex gap-1">
                <button
                    onClick={() =>
                        setUserCode(
                            codeSnippets[selectedLanguage],
                            problemId,
                            selectedLanguage
                        )
                    }
                    className="p-2 hover:bg-base-content/10 rounded-xl opacity-40 transition-all hover:opacity-100"
                >
                    <RefreshCw size={14} />
                </button>
                <button className="p-2 hover:bg-base-content/10 rounded-xl opacity-40 transition-all hover:opacity-100">
                    <Expand size={14} />
                </button>
            </div>
        </div>
    );
};

export default ContestEditorHeader;
