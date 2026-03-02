import React from 'react';

const CircularProgress = ({ percentage, solved }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-32 h-32">
        <circle className="text-base-300" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="64" cy="64" />
        <circle
          className="text-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--p),0.5)]"
          strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset || circumference}
          strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="64" cy="64"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-black text-base-content block">{solved}</span>
        <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Solved</span>
      </div>
    </div>
  );
};

const StatCard = ({ label, solved, total, color }) => (
  <div className="p-4 rounded-2xl bg-base-300 border border-base-content/5 flex justify-between items-center group hover:border-primary/30 transition-all">
    <div className="flex flex-col">
      <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</span>
      <span className="text-lg font-black text-base-content">{solved}<span className="text-xs opacity-20 font-bold">/{total}</span></span>
    </div>
    <div className={`w-1 h-8 rounded-full ${color.replace('text', 'bg')} opacity-20 group-hover:opacity-100 transition-opacity`} />
  </div>
);

const SubmissionStats = ({ stats }) => {
  const solvedTotal = stats?.solved?.total || 0;
  const totalQuestions = stats?.totalQuestions?.total || 100;
  const percentage = ((solvedTotal / totalQuestions) * 100).toFixed(1);

  return (
    <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2.5rem] p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center shadow-xl">
      <div className="md:col-span-1 flex items-center justify-center gap-10">
        <CircularProgress percentage={percentage} solved={solvedTotal} />
        <div className="h-12 w-px bg-base-content/10 hidden md:block" />
      </div>

      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Easy" solved={stats?.solved?.easy || 0} total={stats?.totalQuestions?.easy || 0} color="text-emerald-400" />
        <StatCard label="Medium" solved={stats?.solved?.medium || 0} total={stats?.totalQuestions?.medium || 0} color="text-amber-400" />
        <StatCard label="Hard" solved={stats?.solved?.hard || 0} total={stats?.totalQuestions?.hard || 0} color="text-rose-400" />
      </div>
    </div>
  );
};
export default SubmissionStats;