import React from 'react';
import { ChevronRight, Compass, Layout, Layers } from 'lucide-react';
import Link from 'next/link';
import {motion} from 'framer-motion';

export default function Section3() {
  return (
    <div className="min-h-screen max-w-screen bg-base-300 text-base-content overflow-hidden relative">
      
      {/* 1. SECTION DECORATION: Subtle glow behind the content */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main container */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 py-24 max-w-7xl mx-auto gap-10 relative z-10">
        
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-last lg:order-first"
          > 
        {/* LEFT SIDE: TEXT CONTENT */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          {/* Professional Meta-Tag */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
             <div className="h-[1px] w-10 bg-primary opacity-50" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
               Knowledge Hub 
             </p>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.85] mb-5">
            Start <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-primary/60 ">
              Exploring.
            </span>
          </h1>
          
          <p className="text-base-content/50 text-lg md:text-xl leading-relaxed mb-12 font-medium  max-w-md mx-auto lg:mx-0" >
            A precisely organized architecture designed to synchronize your progress with industry-standard curriculum. Build your roadmap, one module at a time.
          </p>
          
         <Link href="/Explore">
           <button className="group relative bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl active:scale-95 overflow-hidden" >
            <span className="relative z-10 flex items-center gap-2">
               Initialize Sync <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
         </Link>
        </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-last lg:order-first"
          > 
        {/* RIGHT SIDE: PROFESSIONAL INTERFACE PREVIEW */}
        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <div className="w-full lg:w-[90%] bg-base-200/40 backdrop-blur-xl rounded-[3rem] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden">
            
            {/* WINDOW HEADER: Terminal Style */}
            <div className="bg-base-300/80 px-8 py-5 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_10px_rgba(255,95,86,0.3)]" title="Close" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_10px_rgba(255,189,46,0.3)]" title="Minimize" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_10px_rgba(39,201,63,0.3)]" title="Expand" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">
                Matrix_System // Explore_v4
              </span>
            </div>

            {/* INTERFACE CONTENT */}
            <div className="p-10">
              <div className="flex items-center gap-2 mb-10 opacity-40">
                <Layers size={14} className="text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Directory // Featured
                </h3>
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* COURSE CARD 1 */}
                <div className="group bg-base-300/50 border border-white/5 rounded-[2rem] p-8 hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-500/20 transition-all" />
                  
                  <p className="text-[9px] font-black uppercase tracking-widest text-purple-400 mb-4">
                    Core Algorithm
                  </p>
                  <h4 className="text-xl font-black tracking-tighter mb-8 leading-tight">Data Structures <br/> & Algorithms</h4>
                  
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                        <span className="text-3xl font-black block">13</span>
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Modules</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-black text-purple-400 uppercase tracking-widest">Locked</span>
                    </div>
                  </div>
                </div>

                {/* COURSE CARD 2 */}
                <div className="group bg-base-300/50 border border-white/5 rounded-[2rem] p-8 hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                   <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full group-hover:bg-emerald-500/20 transition-all" />

                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-4">
                    Architecture
                  </p>
                  <h4 className="text-xl font-black tracking-tighter mb-8 leading-tight">System Design <br/> Frameworks</h4>
                  
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                        <span className="text-3xl font-black block">16</span>
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Modules</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Locked</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </div>
  );
}