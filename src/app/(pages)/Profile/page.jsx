"use client";

import React from 'react';
import { User, Edit, Eye, CheckSquare, MessageSquare, Star, ChevronRight, BarChart, List, FileCheck, BrainCircuit, Calendar, ChevronDown } from 'lucide-react';

// A placeholder for the circular progress bar using SVG
const CircularProgress = ({ percentage, solved, total }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="transform -rotate-90" width="140" height="140" viewBox="0 0 120 120">
        <circle
          className="text-gray-700"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="text-yellow-400"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-bold text-white">{solved}</span>
        <span className="text-gray-400">/{total}</span>
        <p className="text-gray-400 text-sm">Solved</p>
      </div>
    </div>
  );
};

// Heatmap calendar for submissions
const ActivityCalendar = () => {
  const days = Array.from({ length: 365 }, (_, i) => {
    const intensity = Math.random();
    if (intensity > 0.9) return 4; // High activity
    if (intensity > 0.7) return 3; // Medium-high
    if (intensity > 0.4) return 2; // Medium
    if (intensity > 0.1) return 1; // Low
    return 0; // No activity
  });
  const colors = ['bg-gray-800', 'bg-green-900', 'bg-green-700', 'bg-green-500', 'bg-green-400'];

  // Create a grid layout with empty squares to align weeks properly (assuming year starts on a Wednesday for this layout)
  const emptySquares = Array(3).fill(null);

  return (
    <div className="relative">
      <div className="grid grid-cols-53 grid-rows-7 grid-flow-col gap-1">
        {emptySquares.map((_, i) => <div key={`empty-${i}`} className="w-2.5 h-2.5" />)}
        {days.map((level, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-sm ${colors[level]}`}></div>
        ))}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-600 p-2 rounded-md text-center text-xs whitespace-nowrap">
        <p className="font-bold">0 submission on Feb 20, 2020</p>
      </div>
    </div>
  );
};


const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900via-black to-black text-gray-300 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-500"/>
            </div>
            <h1 className="text-xl font-bold text-white">Username</h1>
            <p className="text-gray-400">Rank <span className="text-white font-semibold">Rank</span></p>
            <button className="mt-4 w-full bg-green-600/20 text-green-400 border border-green-600/30 font-semibold py-2 px-4 rounded-lg hover:bg-green-600/30 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Community Stats</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center"><span className="flex items-center gap-2"><Eye className="w-4 h-4 text-gray-500"/> Views</span> <span className="font-semibold">0</span></li>
              <li className="text-xs text-gray-500 pl-6">Last week 0</li>
              <li className="flex justify-between items-center"><span className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-gray-500"/> Solution</span> <span className="font-semibold">0</span></li>
              <li className="text-xs text-gray-500 pl-6">Last week 0</li>
              <li className="flex justify-between items-center"><span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-gray-500"/> Discuss</span> <span className="font-semibold">0</span></li>
               <li className="text-xs text-gray-500 pl-6">Last week 0</li>
              <li className="flex justify-between items-center"><span className="flex items-center gap-2"><Star className="w-4 h-4 text-gray-500"/> Reputation</span> <span className="font-semibold">0</span></li>
               <li className="text-xs text-gray-500 pl-6">Last week 0</li>
            </ul>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Languages</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>C++</span>
                <span className="text-gray-400">10 problems solved</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: '75%'}}></div></div>
            </div>
             <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span>JavaScript</span>
                <span className="text-gray-400">9 problems solved</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5"><div className="bg-yellow-500 h-1.5 rounded-full" style={{width: '25%'}}></div></div>
            </div>
          </div>
          
           <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Skills</h2>
            <div className="space-y-3">
                <p className="font-semibold text-sm text-red-400">Advanced</p>
                <div className="flex justify-between items-center text-sm">
                    <span>Recursion</span>
                    <span className="text-gray-400">x10</span>
                </div>
                 <div className="w-full bg-gray-700 rounded-full h-1.5"><div className="bg-red-500 h-1.5 rounded-full" style={{width: '60%'}}></div></div>
            </div>
           </div>

        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 flex items-center justify-around">
                <CircularProgress percentage={2.9} solved={10} total={3716}/>
                <div className="text-center">
                    <p className="text-2xl font-bold text-white">5</p>
                    <p className="text-gray-400">Attempting</p>
                </div>
            </div>
             <div className="space-y-2">
                <div className="bg-green-600/20 border border-green-600/30 p-3 rounded-lg flex justify-between items-center"><span>Easy</span> <span className="font-semibold">41/907</span></div>
                <div className="bg-yellow-600/20 border border-yellow-600/30 p-3 rounded-lg flex justify-between items-center"><span>Med.</span> <span className="font-semibold">62/1933</span></div>
                <div className="bg-red-600/20 border border-red-600/30 p-3 rounded-lg flex justify-between items-center"><span>Hard</span> <span className="font-semibold">5/876</span></div>
             </div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Badges</h2>
            <div className="flex items-center gap-8">
                <span className="text-5xl font-bold">0</span>
                <div className="border-l border-gray-700 pl-8">
                    <p className="text-gray-400">Locked Badge</p>
                    <p className="text-white font-semibold">Oct CodeIU Challenge</p>
                </div>
                <div className="ml-auto opacity-20 text-gray-600 text-6xl font-bold">30</div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 overflow-x-auto">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">207 submissions in the past one year</h2>
                <div className="flex items-center gap-4 text-sm">
                    <p>Total active days: <span className="text-white">37</span></p>
                    <p>Max streak: <span className="text-white">6</span></p>
                     <button className="flex items-center gap-1 bg-gray-700/50 px-3 py-1 rounded-md hover:bg-gray-700">Current <ChevronDown className="w-4 h-4"/></button>
                </div>
             </div>
             <ActivityCalendar />
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
             </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 border border-gray-700 rounded-lg p-1">
                <button className="px-3 py-1.5 bg-gray-700 rounded-md flex items-center gap-2 text-white text-sm"><BarChart className="w-4 h-4"/>Recent AC</button>
                <button className="px-3 py-1.5 hover:bg-gray-700/50 rounded-md flex items-center gap-2 text-sm"><List className="w-4 h-4"/>List</button>
                <button className="px-3 py-1.5 hover:bg-gray-700/50 rounded-md flex items-center gap-2 text-sm"><FileCheck className="w-4 h-4"/>Solutions</button>
                <button className="px-3 py-1.5 hover:bg-gray-700/50 rounded-md flex items-center gap-2 text-sm"><BrainCircuit className="w-4 h-4"/>Discuss</button>
              </div>
              <a href="#" className="text-sm text-blue-400 hover:underline flex items-center">View all submissions <ChevronRight className="w-4 h-4"/></a>
            </div>
            <div className="space-y-3">
                {[
                    {title: 'Check if Array is Sorted and Rotated', time: '4 days ago'},
                    {title: 'Unique Number of Occurrences', time: '8 days ago'},
                    {title: 'Remove Duplicates from Sorted Array', time: '8 days ago'},
                    {title: 'Max Consecutive Ones', time: '8 days ago'},
                ].map(item => (
                    <div key={item.title} className="flex justify-between items-center p-3 hover:bg-gray-700/30 rounded-lg">
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-sm text-gray-400">{item.time}</p>
                    </div>
                ))}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default ProfilePage;
