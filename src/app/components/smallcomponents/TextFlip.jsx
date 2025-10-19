"use client";

import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "motion/react";

export function TextFlip() {
  return (
    <div>
      <motion.div
        className=" flex flex-col border-none mr-2 items-center justify-center">
        <LayoutTextFlip
          words={["MAKE", "CODE", "WORK"]} />
      </motion.div>
   
    </div>
  );
}
