import React from 'react';
import { BarChart, List, FileCheck, BrainCircuit, ChevronRight, Activity } from 'lucide-react';

const FilterBtn = ({ icon: Icon, label }) => (
  <button className="px-3 py-1.5 hover:bg-gray-800 rounded-md flex items-center gap-2 text-sm text-gray-300 transition-colors">
    <Icon className="w-4 h-4 text-gray-500" /> {label}
  </button>
);

const RecentActivity = () => {
  // ✅ Empty array
  const activities = [];

  return (
    <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group h-full">
      <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-8 relative z-10">
        Recent Activity
      </h2>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-1 border border-base-content/10 bg-base-300/50 rounded-lg p-1 overflow-x-auto max-w-full">
          <button className="px-3 py-1.5 bg-primary/20 text-primary rounded-md flex items-center gap-2 text-sm shadow-sm font-bold">
            <BarChart className="w-4 h-4" /> Recent AC
          </button>
          <FilterBtn icon={List} label="List" />
          <FilterBtn icon={FileCheck} label="Solutions" />
          <FilterBtn icon={BrainCircuit} label="Discuss" />
        </div>
      </div>

      <div className="space-y-1">
        {activities.length > 0 ? (
          activities.map((item) => (
            <div key={item.title} className="flex justify-between items-center p-3 hover:bg-gray-800/30 rounded-lg transition-colors cursor-pointer group">
              <p className="font-semibold text-gray-300 group-hover:text-white transition-colors text-sm">{item.title}</p>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.status === 'AC' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                  {item.status}
                </span>
                <p className="text-xs text-gray-500 min-w-[80px] text-right">{item.time}</p>
              </div>
            </div>
          ))
        ) : (
          /* ✅ Empty State View */
          <div className="py-12 flex flex-col items-center justify-center text-gray-500 opacity-50">
            <Activity className="w-12 h-12 mb-3 text-gray-700" />
            <p className="text-sm">No recent activity found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;