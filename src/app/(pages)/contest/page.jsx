"use client";

import React, { useState, useEffect } from 'react';


// You can fetch this data from an API
const contests = [
  {
    id: 1,
    title: 'Weekly Contest 471',
    date: '2025-10-12T08:00:00', 
    displayDate: 'Saturday 7:30 PM PDT',
    imageUrl: 'https://placehold.co/600x400/020d2e/FFF?text=|',
  },
  {
    id: 2,
    title: 'Biweekly Contest 115',
    date: '2025-10-21T18:30:00',
    displayDate: 'Tuesday 6:30 PM PDT',
    imageUrl: 'https://placehold.co/600x400/020d2e/FFF?text=|',
  },
  {
    id: 3,
    title: 'Weekly Contest 472',
    date: '2025-10-19T08:00:00',
    displayDate: 'Saturday 7:30 PM PDT',
    imageUrl: 'https://placehold.co/600x400/020d2e/FFF?text=|',
  },
   {
    id: 4,
    title: 'Biweekly Contest 116',
    date: '2025-11-04T18:30:00',
    displayDate: 'Tuesday 6:30 PM PDT',
    imageUrl: 'https://placehold.co/600x400/020d2e/FFF?text=|',
  },
];

const ContestCard = ({ contest }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(contest.date) - +new Date();
      let newTimeLeft = {};

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
         return null; // Contest has started or is over
      }
      return newTimeLeft;
    };
    
    // Set initial time
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [contest.date]);

  const formatTime = () => {
      if (!timeLeft) return "Contest Started!";
      
      let parts = [];
      if(timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
      if(timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
      if(timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}m`);
      parts.push(`${timeLeft.seconds}s`);

      return `Starts in ${parts.slice(0, 3).join(' ')}`;
  }

  return (
     <div className="bg-[#1e1e1e] border border-gray-700/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-blue-500/20 group hover cursor-pointer">
        <div 
            className="relative h-40 bg-gradient-to-b from-[#020d2e]  to-black" 
        >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 flex flex-col justify-between h-full p-4 text-white">
                <div className="flex justify-end">
                    <div className="bg-gray-900/60 p-2 rounded-md backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTime()}</span>
                </div>
            </div>
        </div>
        <div className="p-4 bg-gray-900">
            <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-300 transition-colors">{contest.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{contest.displayDate}</p>
        </div>
     </div>
  );
};

const ContestPage = () => {
  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      {/* Header Section with Gradient */}
      <header className="relative text-center py-20 md:py-32 lg:py-40 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020d2e] via-black to-black"></div>
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/40 via-transparent to-transparent"></div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_2px,transparent_2px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_2px,transparent_4px)] bg-[size:1.5rem_1.5rem] opacity-80"></div>

        <div className="absolute  bg-[radial-gradient(circle,rgba(96,165,250,0.15)_0%,transparent_60%)]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">

          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight space-x-2">
            <span className="font-mono bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
              CodeIU
            </span>
            <span className="ml-2">X</span>
            <span className="ml-2">Contest</span>
          </h1>
          <div className="w-32 h-0.5 bg-blue-500/50 mt-6 mb-4 rounded-full"></div>
          <p className="text-md md:text-lg text-gray-300 max-w-2xl">
            A space where learning meets competition every week.
          </p>
          <p className="text-sm md:text-md text-gray-400 mt-2 font-mono">
            Code fast. Think smart. Rise high
          </p>
        </div>
      </header>

      {/* Weekly Contest Section */}
      <main className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8  pl-4">
            Weekly Contest
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContestPage;
