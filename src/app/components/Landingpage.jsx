import React from 'react'

const Landingpage = () => {
  return (
     <div className="flex flex-col justify-center items-center absolute h-[112vh] bg-black/10 w-[100vw] h-min-screen text-white font-sans p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wide uppercase px-10 bg-white/15 text-white rounded mb-6">
          {"Fueling the Future of 🌊odeing."}   <span>
         
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-white tracking-wide  text-lg font-semibold">
         Ultimate Platform For Next-Gen Coding Contests
        </p>
        
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button 
          className="bg-white text-black font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors duration-300"
        >
          Sign up
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
