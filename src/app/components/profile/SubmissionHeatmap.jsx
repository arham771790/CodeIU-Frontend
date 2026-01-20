import React from 'react';
import { ChevronDown, Zap } from 'lucide-react';

const SubmissionHeatmap = ({ data = [] }) => {
  const getIntensityColor = (value) => {
    if (value > 0) return 'bg-primary shadow-[0_0_10px_rgba(var(--p),0.5)]'; 
    return 'bg-base-300 border border-base-content/5';
  };

  return (
    <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2.5rem] p-8">
      {/* 1. Matrix Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
            <Zap size={16} className="text-primary animate-pulse" />
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                Submission Matrix
            </h2>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest opacity-40">
          <p>Total: <span className="text-base-content">0</span></p>
          <p>Max Streak: <span className="text-base-content text-primary">0</span></p>
          <button className="flex items-center gap-2 bg-base-300 border border-base-content/10 text-base-content px-3 py-1.5 rounded-xl hover:text-primary transition-colors">
            Year 2024 <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. The Technical Grid */}
      <div className="relative overflow-x-auto pb-4 custom-scrollbar">
        <div className="grid grid-cols-53 grid-rows-7 grid-flow-col gap-1.5 min-w-[750px]">
          {data.map((level, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-[3px] transition-all duration-300 cursor-crosshair
                ${getIntensityColor(level)} 
                hover:scale-125 hover:z-20 hover:border-primary/50`} 
              title={`Data Point ${i}: ${level} submissions`}
            />
          ))}
        </div>
      </div>
      
      {/* 3. Timeline Labels */}
      <div className="flex justify-between text-[9px] font-black text-base-content opacity-20 mt-4 px-1 font-mono uppercase tracking-[0.2em]">
        {['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'].map(m => (
            <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
};

export default SubmissionHeatmap;