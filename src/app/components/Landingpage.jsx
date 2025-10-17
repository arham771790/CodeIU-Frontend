import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Landingpage = () => {
   const words = ["MAKE",   "CODE", "WORK"];


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
       <div className='flex flex-col items-center justify-around mb-15 '>
       <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold uppercase px-4  rounded mb-6">
        <div className='inline-block text-4xl md:text-5xl w-[155px] relative mr-9'>
            <span className={`text-[#2AB065] w-full font-extrabold inline-block transition-all duration-500 ${fadeOut ? 'opacity-63 scale-65' : 'opacity-100 scale-100'}`}>
              {words[currentWordIndex]}
            </span>
        </div>
          {"  with next\n  generation developer"} <br  /> 
         
        </h1>
        <p className="max-w-2xl mx-auto  text-lg font-semibold bg-gradient-to-b from-white/50  to-green-400/90 bg-clip-text text-transparent">
         Ultimate Platform For Next-Gen Coding Contest
        </p>
        
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button 
          className=" border-1 text-start font-semibold py-3 px-5 rounded-lg hover:bg-white/20 transition-colors duration-300"
        >
         <span> Start Coding</span>  <span className='p-2 bg-[#2AB065] ml-5 rounded'>{"</>"}</span>
        </button>
        <button 
          className="bg-black text-white font-semibold py-3 px-8 rounded-lg border border-white hover:bg-gray-900 transition-colors duration-300"
        >
          Join a Contest
        </button>
      </div>
   </div>
  )
}

export default Landingpage
