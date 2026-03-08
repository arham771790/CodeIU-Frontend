"use client";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Code2, Expand, Book, CheckCircle, CheckCircle2, Circle, Loader2, Clock, Trophy, Youtube, Play, BookOpen, Layout } from "lucide-react";
import "katex/dist/katex.min.css";
import PreviousSubmissions from "@/components/molecules/PreviousSubmissions";
import ProblemLeaderboard from "@/components/molecules/ProblemLeaderboard";
import EditorialContent from "@/components/atoms/EditorialContent";
import { useProblemStore } from "@/store/useProblemStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import { Pencil, Save, X as CloseIcon } from "lucide-react";
import { motion, Reorder, AnimatePresence } from "framer-motion";

const VideoEmbed = ({ url }) => {
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  const videoId = ytMatch ? ytMatch[1] : null;

  if (videoId) {
    return (
      <div className="my-8 space-y-3">
        <div className="flex items-center gap-2 text-error">
          <Youtube size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Related Video</span>
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

const markdownComponents = {
  a: ({ href, children }) => {
    if (href?.includes("youtube.com") || href?.includes("youtu.be")) {
      return <VideoEmbed url={href} />;
    }
    return <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>;
  },
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-base-content/5 bg-base-300/30">
      <table className="table table-sm min-w-full">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-base-content/5">{children}</thead>,
  th: ({ children }) => <th className="p-3 text-[10px] font-black uppercase tracking-widest border-r border-base-content/5 last:border-0">{children}</th>,
  td: ({ children }) => <td className="p-3 border-r border-base-content/5 last:border-0">{children}</td>,
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <div className="my-4 rounded-xl overflow-hidden border border-base-content/10 shadow-lg">
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, padding: '1rem', fontSize: '0.8rem' }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-base-300 px-1.5 py-0.5 rounded text-primary font-bold" {...props}>
        {children}
      </code>
    );
  },
};

const ProblemDescription = ({
  problemNo,
  title,
  description,
  examples,
  constraints,
  problemId,
  editorial,
}) => {
  const [activeTab, setActiveTab] = useState("description");
  const [tabOrder, setTabOrder] = useState(["description", "submissions", "leaderboard", "editorial"]);
  const { solvedProblemsIds, UpdateProblem, isUpdatingProblem } = useProblemStore();
  const { authUser } = useAuthStore();

  const [isEditingEditorial, setIsEditingEditorial] = useState(false);
  const [editedEditorial, setEditedEditorial] = useState(editorial || "");

  const isAdmin = authUser?.role === "ADMIN";
  const isSolved = solvedProblemsIds.includes(problemId);

  // Load tab order from storage
  useEffect(() => {
    const savedOrder = localStorage.getItem(`desc-tab-order-${problemId}`);
    if (savedOrder) {
      try {
        setTabOrder(JSON.parse(savedOrder));
      } catch (e) { }
    }
  }, [problemId]);

  const onTabReorder = (newOrder) => {
    setTabOrder(newOrder);
    localStorage.setItem(`desc-tab-order-${problemId}`, JSON.stringify(newOrder));
  };

  const handleSaveEditorial = async () => {
    try {
      await UpdateProblem(problemId, { editorial: editedEditorial });
      setIsEditingEditorial(false);
    } catch (error) {
      // Error toast handled by store
    }
  };

  const handleCancelEdit = () => {
    setEditedEditorial(editorial || "");
    setIsEditingEditorial(false);
  };

  return (
    <div className="bg-base-200 text-base-content flex flex-col h-full overflow-hidden rounded-xl border border-base-content/10 group/desc">
      <div className="bg-base-300/50 px-2 py-1 flex items-center justify-between border-b border-base-content/10">
        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
          <Reorder.Group axis="x" values={tabOrder} onReorder={onTabReorder} className="flex gap-0.5">
            {tabOrder.map((tab) => (
              <Reorder.Item
                key={tab}
                value={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                    cursor-pointer px-4 py-2 flex items-center gap-2 font-black uppercase tracking-tighter text-[10px] transition-all rounded-lg
                    ${activeTab === tab ? "bg-base-100 text-primary shadow-sm" : "opacity-40 hover:opacity-100 hover:bg-base-content/5"}
                `}
              >
                {tab === 'description' && <Book size={12} />}
                {tab === 'submissions' && <Clock size={12} />}
                {tab === 'leaderboard' && <Trophy size={12} />}
                {tab === 'editorial' && <BookOpen size={12} />}
                {tab}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
        <div className="flex gap-3 opacity-20 group-hover/desc:opacity-100 transition-opacity pr-2">
          <div title="Drag Tabs to Reorder" className="cursor-help"><Layout size={14} /></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {activeTab === "description" ? (
              <div className="p-6 space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="opacity-20 font-black tracking-tighter">
                    {String(problemNo || "").padStart(2, "0")}
                  </span>
                  {title}
                  {isSolved && (
                    <CheckCircle2 className="w-5 h-5 text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  )}
                </h2>

                <div className="leading-relaxed opacity-90 prose prose-sm max-w-none prose-headings:text-base-content prose-p:text-base-content prose-strong:text-base-content prose-li:text-base-content prose-code:text-primary prose-code:bg-base-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    components={markdownComponents}
                  >
                    {description}
                  </ReactMarkdown>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Examples</h3>
                  {examples &&
                    Object.entries(examples).map(([language, data], i) => (
                      <div
                        key={i}
                        className="bg-base-300/50 p-4 rounded-xl border border-base-content/5 space-y-2"
                      >
                        <p className="text-sm font-mono whitespace-pre-wrap">
                          <span className="opacity-50 font-bold">Input:</span>{" "}
                          {data.input}
                        </p>
                        <p className="text-sm font-mono whitespace-pre-wrap">
                          <span className="opacity-50 font-bold">Output:</span>{" "}
                          {data.output}
                        </p>
                        {data.explanation && (
                          <p className="text-sm italic opacity-70">
                            <span className="font-bold">Explanation:</span>{" "}
                            {data.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">Constraints</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm font-mono bg-base-300 px-4 py-3 rounded-lg border border-base-content/5">
                    {constraints &&
                      constraints
                        .split("\n")
                        .filter(Boolean)
                        .map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                </div>
              </div>
            ) : activeTab === "submissions" ? (
              <div className="p-2 h-full">
                <PreviousSubmissions problemId={problemId} />
              </div>
            ) : activeTab === "leaderboard" ? (
              <div className="p-4 h-full">
                <ProblemLeaderboard problemId={problemId} />
              </div>
            ) : (
              <div className="p-6 h-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary">
                    <Book size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">
                      {isEditingEditorial ? "Editing Editorial" : "Editorial"}
                    </span>
                  </div>
                  {isAdmin && !isEditingEditorial && (
                    <button
                      onClick={() => setIsEditingEditorial(true)}
                      className="btn btn-primary btn-xs rounded-lg font-black uppercase tracking-widest gap-2"
                    >
                      <Pencil size={12} /> Edit Editorial
                    </button>
                  )}
                  {isEditingEditorial && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-ghost btn-xs rounded-lg font-black uppercase tracking-widest gap-2 text-base-content/40 hover:text-base-content"
                      >
                        <CloseIcon size={12} /> Cancel
                      </button>
                      <button
                        onClick={handleSaveEditorial}
                        disabled={isUpdatingProblem}
                        className="btn btn-primary btn-xs rounded-lg font-black uppercase tracking-widest gap-2"
                      >
                        {isUpdatingProblem ? <span className="loading loading-spinner loading-xs" /> : <><Save size={12} /> Save Changes</>}
                      </button>
                    </div>
                  )}
                </div>
                {isEditingEditorial ? (
                  <textarea
                    className="flex-1 w-full bg-base-300 rounded-2xl p-6 text-sm font-mono border border-base-content/10 focus:border-primary outline-none resize-none"
                    value={editedEditorial}
                    onChange={(e) => setEditedEditorial(e.target.value)}
                    placeholder="Enter editorial markdown here..."
                  />
                ) : (
                  <EditorialContent editorial={editorial} />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProblemDescription;