"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { GripVertical, RotateCcw, Layout, Maximize2, Minimize2, ArrowLeftRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";

const ProblemWorkspace = ({ problem, allProblems }) => {
    const [layout, setLayout] = useState([50, 50]);
    const [isVertical, setIsVertical] = useState(false);
    const [order, setOrder] = useState(["description", "editor"]);
    const [isHovered, setIsHovered] = useState(false);

    // Load layout from localStorage if available
    useEffect(() => {
        const savedLayout = localStorage.getItem(`problem-layout-${problem.id}`);
        if (savedLayout) {
            try {
                const { layout: l, isVertical: v, order: o } = JSON.parse(savedLayout);
                if (l) setLayout(l);
                if (v !== undefined) setIsVertical(v);
                if (o) setOrder(o);
            } catch (e) {
                console.error("Error loading saved layout", e);
            }
        }
    }, [problem.id]);

    const saveLayout = useCallback((newLayout, newVertical, newOrder) => {
        localStorage.setItem(`problem-layout-${problem.id}`, JSON.stringify({
            layout: newLayout || layout,
            isVertical: newVertical !== undefined ? newVertical : isVertical,
            order: newOrder || order
        }));
    }, [problem.id, layout, isVertical, order]);

    const onLayoutChange = useCallback((sizes) => {
        setLayout(sizes);
        saveLayout(sizes);
    }, [saveLayout]);

    const resetLayout = () => {
        const defaultLayout = [50, 50];
        const defaultVertical = false;
        const defaultOrder = ["description", "editor"];
        setLayout(defaultLayout);
        setIsVertical(defaultVertical);
        setOrder(defaultOrder);
        localStorage.removeItem(`problem-layout-${problem.id}`);
        localStorage.removeItem(`editor-layout-${problem.id}`);
        localStorage.removeItem(`desc-tab-order-${problem.id}`);

        // Force a re-render/refresh of the layout state in children
        window.location.reload();
    };

    const toggleOrientation = () => {
        const newVertical = !isVertical;
        setIsVertical(newVertical);
        saveLayout(undefined, newVertical);
    };

    const swapOrder = () => {
        const newOrder = [...order].reverse();
        setOrder(newOrder);
        saveLayout(undefined, undefined, newOrder);
    };

    const renderPanel = (type) => {
        if (type === "description") {
            return (
                <div className="h-full overflow-hidden p-1">
                    <ProblemDescription
                        problemNo={problem.problemNo}
                        title={problem.title}
                        description={problem.description}
                        examples={problem.examples}
                        constraints={problem.constraints}
                        problemId={problem.id}
                        editorial={problem.editorial}
                    />
                </div>
            );
        }
        return (
            <div className="h-full overflow-hidden p-1">
                <CodeEditor
                    problemId={problem.id}
                    description={problem.description}
                    codeSnippets={problem.codeSnippets}
                    testcases={problem.visibleTestcases}
                />
            </div>
        );
    };

    return (
        <div
            className="flex-1 flex flex-col h-full relative group/workspace"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Workspace Controls Overlay */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, x: "-50%", scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                        exit={{ opacity: 0, y: 10, x: "-50%", scale: 0.95 }}
                        className="absolute bottom-10 left-1/2 z-[100] flex items-center gap-1 p-1.5 bg-base-300/60 backdrop-blur-2xl border border-white/5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-white/10"
                    >
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={resetLayout}
                            className="btn btn-ghost btn-square btn-sm rounded-xl text-base-content/40 hover:text-white hover:bg-white/10"
                            title="Reset Layout"
                        >
                            <RotateCcw size={14} />
                        </motion.button>
                        <div className="w-px h-4 bg-white/5 mx-1" />
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleOrientation}
                            className="btn btn-ghost btn-square btn-sm rounded-xl text-base-content/40 hover:text-white hover:bg-white/10"
                            title={isVertical ? "Horizontal Split" : "Vertical Split"}
                        >
                            <Layout size={14} className={isVertical ? "rotate-90" : ""} />
                        </motion.button>
                        <div className="w-px h-4 bg-white/5 mx-1" />
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={swapOrder}
                            className="btn btn-ghost btn-square btn-sm rounded-xl text-base-content/40 hover:text-white hover:bg-white/10"
                            title="Swap Sides"
                        >
                            <ArrowLeftRight size={14} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Group
                orientation={isVertical ? "vertical" : "horizontal"}
                onLayoutChange={onLayoutChange}
                className="flex-1"
            >
                <Panel defaultSize={layout[0]} minSize={20}>
                    {renderPanel(order[0])}
                </Panel>

                <Separator className="relative flex items-center justify-center w-2 h-full z-10 group/handle cursor-col-resize">
                    <div className={`absolute ${isVertical ? 'w-full h-[2px] cursor-row-resize' : 'h-full w-[2px] cursor-col-resize'} bg-base-content/10 group-hover/handle:bg-primary group-active/handle:bg-primary transition-all duration-300`} />

                    <div className="z-20 w-1 h-8 bg-base-content/20 group-hover/handle:bg-primary group-hover/handle:h-12 rounded-full flex items-center justify-center transition-all duration-300 group-active/handle:scale-125">
                        <div className="w-0.5 h-3 bg-white/20 rounded-full" />
                    </div>
                </Separator>

                <Panel defaultSize={layout[1]} minSize={20}>
                    {renderPanel(order[1])}
                </Panel>
            </Group>
        </div>
    );
};

export default ProblemWorkspace;
