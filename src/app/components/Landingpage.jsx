
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
   <div className="bg-gradiend-to-t  from-green-700 via-black to-black">
     <div className="flex flex-col items-center justify-around mb-15">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold uppercase px-4  rounded mb-6">
          <div className="inline-block text-4xl md:text-5xl md:w-[125px] relative md:mr-2">
            <span
              className={`text-blue-500 w-full mr-2 text-center font-extrabold inline-block transition-all duration-500 ${
                fadeOut ? "opacity-63 scale-65" : "opacity-100 scale-100"
              }`}
            >
             <TextFlip/>
            </span>
          </div>
          {"  with next\n  generation developer"} <br />
        </h1>
        <div className="flex flex-col items-center justify-center">
          <p className="max-w-2xl mx-auto text-sm  md:text-lg font-semibold bg-gradient-to-b from-white/50  to-blue-400/90 bg-clip-text text-transparent">
          Ultimate Platform For Next-Gen Coding Contest
        </p>
        <span  className=" flex gap-2 max-w-2xl mx-auto  text-sm  md:text-lg font-semibold bg-gradient-to-b from-white/50  to-blue-400/50 bg-clip-text text-transparent">
          Devloped by Student of <p className="text-white"> Integral University  
        </p></span>
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 bg-transparent">
        <button className=" bg-transparent  border border-white/20 text-start font-semibold p-3 rounded-lg hover:bg-white/10 transition-colors duration-300 ">
          <span> Start Coding</span>{" "}
          <span className="p-2 bg-blue-600 ml-3 rounded">{"</>"}</span>
        </button>
        <button className="bg-black text-white font-semibold p-3 rounded-lg border border-white/20 hover:bg-white/10 -900 transition-colors duration-300">
          Join a Contest
        </button>
      </div>
    </div>
   </div>
  );
};

export default Landingpage;
