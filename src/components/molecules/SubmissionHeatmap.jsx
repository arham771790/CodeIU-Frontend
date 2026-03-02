import React, { useMemo } from 'react';
import { ChevronDown, Zap } from 'lucide-react';
import { format, subDays, startOfMonth, eachMonthOfInterval, isSameMonth } from 'date-fns';

const SubmissionHeatmap = ({ data = [] }) => {
  const getIntensityColor = (value) => {
    if (value > 5) return 'bg-primary shadow-[0_0_10px_rgba(var(--p),0.6)]';
    if (value > 2) return 'bg-primary/70 shadow-[0_0_8px_rgba(var(--p),0.4)]';
    if (value > 0) return 'bg-primary/40';
    return 'bg-base-300 border border-base-content/5';
  };

  const { total, maxStreak, currentStreak } = useMemo(() => {
    let total = 0;
    let maxS = 0;
    let currS = 0;
    let tempS = 0;

    data.forEach((val, i) => {
      total += val;
      if (val > 0) {
        tempS++;
        currS = tempS;
      } else {
        if (tempS > maxS) maxS = tempS;
        tempS = 0;
      }
    });
    if (tempS > maxS) maxS = tempS;

    return { total, maxStreak: maxS, currentStreak: currS };
  }, [data]);

  const monthLabels = useMemo(() => {
    const today = new Date();
    // We are showing 371 days (53 weeks)
    const startDate = subDays(today, 370);
    const months = eachMonthOfInterval({ start: startDate, end: today });

    return months.map(m => format(m, 'MMM'));
  }, []);

  const today = new Date();

  return (
    <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2.5rem] p-4 sm:p-8 shadow-xl">
      {/* 1. Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <Zap size={16} className="text-primary animate-pulse" />
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            Submission Matrix
          </h2>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-[10px] font-black uppercase tracking-widest opacity-60 overflow-x-auto">
          <p>Total: <span className="text-base-content font-bold">{total}</span></p>
          <p>Max Streak: <span className="text-primary font-bold">{maxStreak}</span></p>
          <p>Current Streak: <span className="text-emerald-400 font-bold">{currentStreak}</span></p>
          <button className="flex-shrink-0 flex items-center gap-2 bg-base-300 border border-base-content/10 text-base-content px-3 py-1.5 rounded-xl hover:text-primary transition-colors">
            Year {new Date().getFullYear()} <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. The Technical Grid — scrollable on mobile */}
      <div className="relative overflow-x-auto pb-4 custom-scrollbar">
        <div className="grid grid-cols-53 grid-rows-7 grid-flow-col gap-1.5 min-w-[750px]">
          {data.map((level, i) => {
            const date = subDays(today, 370 - i);
            const dateStr = format(date, 'MMM do, yyyy');
            return (
              <div
                key={i}
                className={`w-3 h-3 rounded-[3px] transition-all duration-300 cursor-crosshair
                  ${getIntensityColor(level)} 
                  hover:scale-125 hover:z-20 hover:border-primary/50`}
                title={`${dateStr}: ${level} submissions`}
              />
            );
          })}
        </div>
        {/* 3. Timeline Labels — rendered inside scrollable container */}
        <div className="flex justify-between text-[9px] font-black text-base-content opacity-30 mt-4 px-1 font-mono uppercase tracking-[0.2em] min-w-[750px]">
          {monthLabels.map((m, idx) => (
            <span key={`${m}-${idx}`}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionHeatmap;