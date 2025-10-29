import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function  Section3() {
  return (
    <div className="min-h-screen max-w-screen bg-black text-white overflow-hidden">
      {/* Main container */}
      <div className="flex items-center justify-between px-12 py-16 max-w-7xl mx-auto">
        {/* Left side - Text content */}
        <div className="flex-1 max-w-md">
          <h1 className="text-5xl font-bold mb-6">Start Exploring</h1>
          <p className="text-gray-300 text-md leading-relaxed mb-8">
            Explore is a well-organized tool that helps you get the most out of LeetCode by providing structure to guide your progress towards the next step in your programming career.
          </p>
          <button className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition">
            Get Started
          </button>
        </div>

        {/* Right side - Card showcase */}
        <div className="flex-1 w-fit flex justify-end">
          <div className="w-2/3 bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Card header */}
            <div className="bg-gray-50 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-xs text-gray-500 ml-2">CodeUI Explore</span>
            </div>

            {/* Card content */}
            <div className="p-6">
              <h3 className="text-gray-800 text-sm font-semibold mb-6">Featured</h3>

              {/* Course cards grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Card 1 - Data Structures */}
                <div className="bg-gradient-to-bl from-purple-500 via-yellow-500 to-purple-600 rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition">
                  <div className="text-sm font-semibold mb-3 opacity-90">
                  DSA Crash Course
                  </div>
                  <h4 className="text-sm font-bold mb-4">Data Structures and Algorithms</h4>
                  <div className="flex justify-between text-xs">
                    <span>13</span>
                    <span>149</span>
                  </div>
                  <div className="flex gap-1 mt-1 text-xs">
                    <span>Chapters</span>
                    <span>0%</span>
                  </div>
                </div>

                {/* Card 2 - System Design */}
                <div className="bg-gradient-to-br from-green-500 via-blue-400 to-green-400 rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition">
                  <div className="text-sm font-semibold mb-3 opacity-90">
                  Specialised Interviews Crash Course
                  </div>
                  <h4 className="text-sm font-bold mb-4">System Design for Interviews and Beyond</h4>
                  <div className="flex justify-between text-xs">
                    <span>16</span>
                    <span>81</span>
                  </div>
                  <div className="flex gap-1 mt-1 text-xs">
                    <span>Chapters</span>
                    <span>0%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}