"use client";

import React from 'react';
import { Star, Medal, Clock, ChevronDown } from 'lucide-react';
import { useParams } from 'next/navigation';

// Dummy data for the leaderboard - Placed outside the component to prevent re-creation on re-renders
const dummyUsers = [
  { contestId: 'contest-123', rank: 1, name: 'CodeMaster', avatar: 'https://placehold.co/40x40/7e22ce/ffffff?text=CM', rating: 2800, problemsSolved: 5, score: 5000 },
  { contestId: 'contest-123', rank: 2, name: 'LogicLord', avatar: 'https://placehold.co/40x40/16a34a/ffffff?text=LL', rating: 2650, problemsSolved: 5, score: 4850 },
  { contestId: 'contest-123', rank: 3, name: 'AlgoQueen', avatar: 'https://placehold.co/40x40/be123c/ffffff?text=AQ', rating: 2500, problemsSolved: 4, score: 4200 },
  { contestId: 'contest-123', rank: 4, name: 'DebugDiva', avatar: 'https://placehold.co/40x40/1d4ed8/ffffff?text=DD', rating: 2400, problemsSolved: 4, score: 4150 },
  { contestId: 'contest-123', rank: 5, name: 'SyntaxSensei', avatar: 'https://placehold.co/40x40/b45309/ffffff?text=SS', rating: 2350, problemsSolved: 4, score: 4100 },
  { contestId: 'contest-123', rank: 6, name: 'ByteBard', avatar: 'https://placehold.co/40x40/4b5563/ffffff?text=BB', rating: 2200, problemsSolved: 3, score: 3500 },
  { contestId: 'contest-123', rank: 7, name: 'ScriptSavvy', avatar: 'https://placehold.co/40x40/6d28d9/ffffff?text=SS', rating: 2150, problemsSolved: 3, score: 3400 },
];

// Helper to get medal colors and icons
const getMedal = (rank) => {
  if (rank === 1) return { color: 'text-yellow-400', icon: <Medal className="w-8 h-8" /> };
  if (rank === 2) return { color: 'text-gray-300', icon: <Medal className="w-8 h-8" /> };
  if (rank === 3) return { color: 'text-amber-600', icon: <Medal className="w-8 h-8" /> };
  return null;
};

const StarRating = ({ rating }) => {
    const starCount = Math.floor(rating / 500);
    return (
        <div className="flex justify-center">
            {[...Array(starCount)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />)}
        </div>
    );
};

const LeaderboardPage = () => {
  const params = useParams();
  // In a real app, you would use params.id to fetch data from your API
  // For this demo, we'll keep using the hardcoded contest ID to show the UI
  const contestId = 'contest-123'; 
  const leaderboardData = dummyUsers.filter(user => user.contestId === contestId);
  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-green-500 text-lg mt-2">Contest_Name</p>
          <div className="inline-flex items-center gap-2 bg-gray-900/50 border border-green-600/30 text-yellow-500 px-4 py-2 rounded-full mt-4 text-sm font-semibold">
            <Clock className="w-4 h-4"/>
            <span>Ends in 01:23:45</span>
          </div>
        </header>

        {/* Top 3 Performers */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-end">
          {topThree.map((user, index) => {
            const medal = getMedal(user.rank);
            const orderClasses = ['md:order-2', 'md:order-1', 'md:order-3'];
            const rankSpecificClasses = [
                { border: 'border-yellow-400', transform: 'md:translate-y-0' }, // Rank 1
                { border: 'border-gray-300', transform: 'md:translate-y-8' }, // Rank 2
                { border: 'border-amber-600', transform: 'md:translate-y-8' }  // Rank 3
            ];
            
            return (
              <div key={user.name} className={`flex flex-col items-center text-center ${orderClasses[index]} transform transition-transform duration-300 ${rankSpecificClasses[index].transform}`}>
                <div className={`relative flex flex-col items-center justify-end p-6 bg-gray-900 rounded-t-xl w-full h-56 border-b-4 ${rankSpecificClasses[index].border}`}>
                   {medal && <div className={`absolute -top-5 ${medal.color}`}>{medal.icon}</div>}
                   <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-gray-700 mb-3"/>
                   <p className="font-bold text-lg">{user.name}</p>
                   <StarRating rating={user.rating} />
                   <p className="font-bold text-2xl mt-2">{user.score}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gray-900 border border-green-600/30 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center bg-black/50">
                <h2 className="text-xl font-bold">All Participants</h2>
                <button className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-md hover:bg-gray-800 border border-gray-700">
                    Filter <ChevronDown className="w-4 h-4"/>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="p-4 font-semibold w-1/6">Rank</th>
                            <th className="p-4 font-semibold w-2/5">User</th>
                            <th className="p-4 font-semibold w-1/4 text-center">Problems Solved</th>
                            <th className="p-4 font-semibold w-1/5 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restOfUsers.map(user => (
                            <tr key={user.name} className="border-t border-green-600/20 hover:bg-gray-800/50 transition-colors">
                                <td className="p-4 font-semibold">{user.rank}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full"/>
                                        <div>
                                            <p className="font-bold">{user.name}</p>
                                            <StarRating rating={user.rating} />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-center font-semibold">{user.problemsSolved}/5</td>
                                <td className="p-4 text-right font-bold text-green-500">{user.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default LeaderboardPage;

