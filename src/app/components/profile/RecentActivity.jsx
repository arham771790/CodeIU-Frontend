import React from 'react';
import { BarChart, List, FileCheck, BrainCircuit, ChevronRight, Activity } from 'lucide-react';
import { useProfileStore } from '@/app/store/useProfileStore';
import { useAuthStore } from '@/app/store/useAuthStore';

const FilterBtn = ({ icon: Icon, label }) => (
  <button className="px-3 py-1.5 hover:bg-gray-800 rounded-md flex items-center gap-2 text-sm text-gray-300 transition-colors">
    <Icon className="w-4 h-4 text-gray-500" /> {label}
  </button>
);

const RecentActivity = () => {
  const { authUser } = useAuthStore();
  const { activities, fetchRecentSubmissions, isLoadingActivity } = useProfileStore();

  React.useEffect(() => {
    if (authUser?.id) {
      fetchRecentSubmissions(authUser.id);
    }
  }, [authUser, fetchRecentSubmissions]);

  // Format data for standard view
  const formattedActivities = (activities || []).slice(0, 10).map(sub => ({
    title: sub.problemId.substring(0, 15) + "...", // Problem names would be better if we had them
    status: sub.status === "Accepted" ? "AC" : "WA",
    time: new Date(sub.createdAt).toLocaleDateString(),
    id: sub.id
  }));

  return (
    <div className="bg-gradient-to-b from-gray-900 via-black to-black border border-gray-700/50 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-1 border border-gray-800 bg-gray-900/50 rounded-lg p-1 overflow-x-auto max-w-full">
          <button className="px-3 py-1.5 bg-gray-800 rounded-md flex items-center gap-2 text-white text-sm shadow-sm">
            <BarChart className="w-4 h-4" /> Recent AC
          </button>
          <FilterBtn icon={List} label="List" />
          <FilterBtn icon={FileCheck} label="Solutions" />
          <FilterBtn icon={BrainCircuit} label="Discuss" />
        </div>
        <a href="#" className="text-sm text-blue-500 hover:text-blue-400 flex items-center font-medium transition-colors">
          View all <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-1">
        {isLoadingActivity ? (
          <div className="py-12 flex justify-center"><span className="loading loading-spinner loading-md opacity-20"></span></div>
        ) : formattedActivities.length > 0 ? (
          formattedActivities.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 hover:bg-gray-800/30 rounded-lg transition-colors cursor-pointer group">
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