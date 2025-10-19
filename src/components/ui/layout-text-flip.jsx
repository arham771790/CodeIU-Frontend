"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // corrected import
import clsx from "clsx";

export const LayoutTextFlip = ({
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, words.length]);

  return (
    <>
  
      <motion.span
        layout
        className="relative w-fit    px-4 py-1 font-sans text-4xl font-extra bold tracking-wide text-blue-700 mr-2 md:text-5xl bg-transparent "
      >
        <AnimatePresence mode="popLayout" >
          <motion.span
            key={currentIndex}
            initial={{ y: 10, filter: "blur(10px)" }}
            animate={{ y: 0, filter: "blur(0px)" }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
            transition={{ duration: 2 }}
            className={clsx("inline-block ")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
};
