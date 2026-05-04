"use client";
import React, { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BookOpen, Lock, Copy, Check, Youtube, Play } from "lucide-react";
import "katex/dist/katex.min.css"; // Global math styling

/**
 * EditorialContent — Renders editorial markdown with a language-tabbed code switcher.
 *
 * The editorial is a single markdown string. Code blocks fenced with ````language
 * are extracted and grouped by language for a tabbed view. Non-code markdown
 * (explanations, images, complexity analysis) is rendered between the code sections.
 */

// Supported language display names
const LANG_LABELS = {
    javascript: "JavaScript",
    js: "JavaScript",
    python: "Python",
    py: "Python",
    java: "Java",
    cpp: "C++",
    "c++": "C++",
    c: "C",
    typescript: "TypeScript",
    ts: "TypeScript",
    go: "Go",
    rust: "Rust",
};

const getNormalizedLang = (lang) => {
    const lower = (lang || "").toLowerCase().trim();
    if (["javascript", "js"].includes(lower)) return "javascript";
    if (["python", "py"].includes(lower)) return "python";
    if (["typescript", "ts"].includes(lower)) return "typescript";
    if (["cpp", "c++"].includes(lower)) return "cpp";
    return lower;
};

const CodeBlock = ({ language, children }) => {
    const [copied, setCopied] = useState(false);
    const code = String(children).replace(/\n$/, "");

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-6 overflow-hidden rounded-2xl border border-base-content/10">
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30 text-white mr-2">
                    {language}
                </span>
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all active:scale-95"
                    title="Copy code"
                >
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                    ) : (
                        <Copy className="w-3.5 h-3.5 text-white/50" />
                    )}
                </button>
            </div>

            <SyntaxHighlighter
                language={language}
                style={atomDark}
                customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    fontSize: "0.85rem",
                    lineHeight: "1.6",
                    background: "#0d0d0d",
                }}
                codeTagProps={{
                    style: { fontFamily: 'JetBrains Mono, monospace' }
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

/**
 * Parses editorial markdown and splits it into segments:
 * - { type: 'markdown', content: '...' }
 * - { type: 'codeGroup', solutions: [{ lang, normalizedLang, code }] }
 *
 * Consecutive code blocks are grouped together so languages can be tabbed.
 */
function parseEditorial(markdown) {
    if (!markdown) return [];

    const segments = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

    let lastIndex = 0;
    let match;
    let pendingCodeGroup = [];

    const flushCodeGroup = () => {
        if (pendingCodeGroup.length > 0) {
            segments.push({ type: "codeGroup", solutions: [...pendingCodeGroup] });
            pendingCodeGroup = [];
        }
    };

    while ((match = codeBlockRegex.exec(markdown)) !== null) {
        const textBefore = markdown.slice(lastIndex, match.index).trim();

        if (textBefore) {
            // Non-trivial text between code blocks — flush any pending code group
            flushCodeGroup();
            segments.push({ type: "markdown", content: textBefore });
        }

        const lang = match[1] || "text";
        const normalizedLang = getNormalizedLang(lang);
        pendingCodeGroup.push({
            lang,
            normalizedLang,
            label: LANG_LABELS[normalizedLang] || lang,
            code: match[2],
        });

        lastIndex = match.index + match[0].length;
    }

    // Flush remaining code group
    flushCodeGroup();

    // Remaining text after the last code block
    const remaining = markdown.slice(lastIndex).trim();
    if (remaining) {
        segments.push({ type: "markdown", content: remaining });
    }

    return segments;
}

const CodeGroupSwitcher = ({ solutions }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Deduplicate by normalized language
    const uniqueSolutions = useMemo(() => {
        const seen = new Set();
        return solutions.filter((s) => {
            if (seen.has(s.normalizedLang)) return false;
            seen.add(s.normalizedLang);
            return true;
        });
    }, [solutions]);

    if (uniqueSolutions.length === 0) return null;

    return (
        <div className="rounded-2xl border border-base-content/10 overflow-hidden">
            {/* Language Tabs */}
            {uniqueSolutions.length > 1 && (
                <div className="flex bg-base-300/50 border-b border-base-content/5 overflow-x-auto">
                    {uniqueSolutions.map((sol, idx) => (
                        <button
                            key={sol.normalizedLang}
                            onClick={() => setActiveIndex(idx)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                ${idx === activeIndex
                                    ? "text-primary border-b-2 border-primary bg-base-200/50"
                                    : "opacity-40 hover:opacity-70"
                                }`}
                        >
                            {sol.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Active Code Block */}
            <CodeBlock language={uniqueSolutions[activeIndex]?.lang}>
                {uniqueSolutions[activeIndex]?.code}
            </CodeBlock>
        </div>
    );
};

const VideoEmbed = ({ url }) => {
    // Simple YouTube pattern: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const videoId = ytMatch ? ytMatch[1] : null;

    if (videoId) {
        return (
            <div className="my-8 space-y-3">
                <div className="flex items-center gap-2 text-error">
                    <Youtube size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Video Solution</span>
                </div>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-base-content/10 bg-base-300 shadow-2xl">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        );
    }

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 inline-flex">
            <Play size={12} /> {url}
        </a>
    );
};

const EditorialContent = ({ editorial }) => {
    const segments = useMemo(() => parseEditorial(editorial), [editorial]);

    // Custom renderers for ReactMarkdown
    const components = {
        // Handle a tags: if it's a YouTube link, embed it. Otherwise default a.
        a: ({ href, children }) => {
            if (href?.includes("youtube.com") || href?.includes("youtu.be")) {
                return <VideoEmbed url={href} />;
            }
            return <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>;
        },
        // Override p to use div to avoid nesting issues with block components like VideoEmbed
        p: ({ children }) => <div className="mb-4 last:mb-0">{children}</div>,
        // Polish table styles
        table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-base-content/5 bg-base-300/30">
                <table className="table table-sm min-w-full">{children}</table>
            </div>
        ),
        thead: ({ children }) => <thead className="bg-base-content/5">{children}</thead>,
        th: ({ children }) => <th className="p-3 text-[10px] font-black uppercase tracking-widest border-r border-base-content/5 last:border-0">{children}</th>,
        td: ({ children }) => <td className="p-3 border-r border-base-content/5 last:border-0">{children}</td>,
    };

    if (!editorial) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4 opacity-40">
                <Lock size={32} />
                <p className="text-sm font-bold uppercase tracking-widest">
                    No editorial available yet
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
                <BookOpen size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                    Editorial
                </span>
            </div>

            {segments.map((segment, i) => {
                if (segment.type === "markdown") {
                    return (
                        <div
                            key={i}
                            className="leading-relaxed prose prose-sm max-w-none
                                       prose-headings:text-base-content
                                       prose-p:text-base-content
                                       prose-strong:text-base-content
                                       prose-li:text-base-content
                                       prose-code:text-primary prose-code:bg-base-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                       prose-img:rounded-xl prose-img:border prose-img:border-base-content/10
                                       prose-a:text-primary prose-a:hover:underline
                                       prose-blockquote:border-l-4 prose-blockquote:border-base-content/20 prose-blockquote:pl-4 prose-blockquote:italic
                                       prose-hr:border-base-content/10
                                       prose-ol:list-decimal prose-ul:list-disc prose-li:marker:text-base-content/60
                                       prose-table:w-full prose-table:text-left prose-table:border-collapse
                                       prose-th:p-2 prose-td:p-2 prose-th:border-b prose-td:border-b prose-th:border-base-content/10 prose-td:border-base-content/10
                                       prose-th:font-semibold prose-th:text-base-content/80
                                       prose-em:italic
                                       "
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]} // Added remarkMath
                                rehypePlugins={[rehypeRaw, rehypeKatex]} // Added rehypeKatex
                                components={components}
                            >
                                {segment.content}
                            </ReactMarkdown>
                        </div>
                    );
                }

                if (segment.type === "codeGroup") {
                    return <CodeGroupSwitcher key={i} solutions={segment.solutions} />;
                }

                return null;
            })}
        </div>
    );
};

export default EditorialContent;
