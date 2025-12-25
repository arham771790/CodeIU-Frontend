import React, { useEffect, useState } from "react";
import { TextFlip } from "./smallcomponents/TextFlip";

const Landingpage = () => {
  const words = ["CodeIU", "CodeBetter", "CodeFast", "CodeSmart"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setFadeOut(false);
      }, 40);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
   
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-base-100 transition-colors duration-500">
      
      {/* Dynamic Background Glow that follows the theme's primary color */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)] from-primary/10 to-transparent pointer-events-none" />

      <div className="flex flex-col items-center justify-around mb-15 z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold uppercase px-4 mb-6 text-base-content tracking-tight">
            <div className="inline-block md:w-[150px] relative md:mr-2">
              <span
                className={`text-primary w-full mr-2 text-center font-extrabold inline-block transition-all duration-500 ${
                  fadeOut ? "opacity-0 scale-90" : "opacity-100 scale-100"
                }`}
              >
                <TextFlip />
              </span>
            </div>
            {" with next\n generation developer"} <br />
          </h1>

          <div className="flex flex-col items-center justify-center gap-2">
            <p className="max-w-2xl mx-auto text-sm md:text-xl font-medium text-base-content/70">
              Ultimate Platform For Next-Gen Coding Contests
            </p>
            
            <div className="flex items-center gap-2 max-w-2xl mx-auto text-sm md:text-lg font-semibold text-base-content/60">
              Developed by Students of 
              <span className="text-primary font-bold">Integral University</span>
            </div>
          </div>
        </div>

        {/* SENIOR FIX: Replaced hardcoded buttons with DaisyUI semantic buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6">
          <button className="bg-transparent btn btn-outline btn-primary px-8 h-auto py-4 text-lg hover:scale-105 transition-transform rounded-lg">
            <span>Start Coding</span>
            <div className="badge badge-primary ml-2 p-3">{"</>"}</div>
          </button>

          <button className="btn btn-primary px-8 h-auto py-4 text-lg shadow-lg shadow-primary/20 hover:scale-105 transition-transform rounded-lg">
            Join a Contest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;