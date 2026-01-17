// app/page.js
import { ArrowRight, Play, Check } from 'lucide-react';
import Link from 'next/link';

export default function Section2() {
  return (
    <div className="min-h-screen w-screen bg-base-300 transition-colors">
      {/* Header */}
      <div className="text-center pt-12 pb-20">
        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-base-content">
          The Developer Skills Platform
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Section */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-block">
              <span className="bg-primary text-primary-content px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase">
                🌊ODEIU Community
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-light text-base-content leading-tight">
              Prepare and apply for your dream job
            </h2>

            {/* Description */}
            <li className="text-md text-base-content leading-relaxed max-w-md">

<span className=' font-bold mr-1 text-md'>
⁠  ⁠CodeIU Practice
</span>
  Solve coding problems, aptitude quizzes, and DSA challenges. <span className='bg-gradient-to-b from-blue-500 to-purple-400 bg-clip-text text-transparent font-bold mr-1'>Track your progress</span> and improve with real-time feedback.

            </li>

 <li className="text-md text-base-content leading-relaxed max-w-md">
        
⁠  ⁠CodeIU Contests
  Compete in 
 <span className='bg-gradient-to-b from-blue-500 to-purple-400 bg-clip-text text-transparent font-bold mr-1'> AI-monitored live contests </span>with real-time leaderboards. Sharpen your problem-solving and time-management skills.

•</li>

 <li className="text-md text-base-content leading-relaxed max-w-md">
           ⁠CodeIU Community
  Join peers in forums, blogs, and group-solving rooms. Share knowledge, discuss solutions, and learn multiple approaches.

            </li>
            {/* Learn More Link */}
            <Link
              href="/"
              className="inline-flex btn btn-ghost border border-base-content/20 text-base-content p-2 rounded-2xl hover:bg-transparent items-center gap-2  hover:gap-4 transition-all font-medium text-lg group"
            >
              Learn more
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Section - Code Editor */}
          <div className="relative">
            <div className=" rounded-lg overflow-hidden shadow-2xl">
              {/* Editor Header */}
              <div className="flex justify-between items-center px-2 py-4  bg-gray-950">
                <select className="text-base-content text-white px-3 py-1 rounded text-sm  hover:border-gray-600 transition-colors cursor-pointer font-mono">
              
                  <option>C++</option>
                </select>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                  Environment details
                </a>
              </div>

              {/* Code Content */}
              <div className="px-6 py-6 bg-black text-sm  font-sans xs">
                <div className="space-y-1 text-gray-900">
                  <div className="text-purple-400">#include <span className="text-gray-600">&lt;cmath&gt;</span></div>
                  <div className="text-purple-400">#include <span className="text-gray-600">&lt;cstdio&gt;</span></div>
                  <div className="text-purple-400">#include <span className="text-gray-600">&lt;vector&gt;</span></div>
                  <div className="text-blue-300">using <span className="text-blue-400">namespace</span></div>
                  <div className="text-gray-600">std;</div>
                </div>

                <div className="mt-3 space-y-2 text-gray-400">
                  <div>
                    <span className="text-blue-300">int</span> <span className="text-yellow-300">solveFirst</span>
                    <span className="text-gray-500">(</span>
                    <span className="text-blue-300">int</span> <span className="text-gray-200">a</span>
                    <span className="text-gray-500">,</span> <span className="text-blue-300">int</span> <span className="text-gray-200">b</span>
                    <span className="text-gray-500">)</span> <span className="text-gray-500">{"{"}</span>
                  </div>
                  <div className="text-green-300 ml-4">
                    <span>Printf("@Integral University");</span>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-gray-400">
                  <div>
                    <span className="text-blue-300">int</span> <span className="text-yellow-300">main</span>
                    <span className="text-gray-500">()</span> <span className="text-gray-500">{"{"}</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-300">int</span> <span className="text-gray-200">num1, num2;</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-300">int</span> <span className="text-gray-200">sum;</span>
                  </div>
                </div>
              </div>

              {/* Footer with Buttons */}
              <div className="flex justify-between items-center px-6 py-4 bg-gray-950  border-gray-700">
               
                <div className="flex gap-5">
                  <button className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <Play size={16} />
                    Run
                  </button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded font-medium hover:bg-green-600 transition-colors">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}