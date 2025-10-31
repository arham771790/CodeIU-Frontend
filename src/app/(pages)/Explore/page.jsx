
import React from 'react';
import { PlayCircle, Bookmark, Star, ChevronRight, Lock } from 'lucide-react';

// --- Mock Data ---
const courses = {
  continuePrevious: [
    {
      title: 'Data Structures and Algorithms',
      gradient: 'from-purple-600 to-blue-500',
      chapters: 13,
      items: 149,
      progress: 0,
    },
  ],
  featured: [
    { title: 'Data Structures and Algorithms', gradient: 'from-purple-600 to-blue-500', chapters: 13, items: 149, progress: 0 },
    { title: 'System Design for Interviews and Beyond', gradient: 'from-gray-700 via-gray-900 to-black', chapters: 16, items: 81, progress: 0 },
    { title: 'The CodeIU Beginner\'s Guide', gradient: 'from-red-500 to-orange-500', chapters: 4, items: 17, progress: 12 },
    { title: 'Top Interview Questions', gradient: 'from-green-500 to-teal-500', chapters: 9, items: 48, progress: 0 },
    { title: 'Dynamic Programming', gradient: 'from-teal-400 to-cyan-600', chapters: 6, items: 55, progress: 0 },
    { title: 'Introduction to Data Structure: Arrays 101', gradient: 'from-blue-500 to-indigo-600', chapters: 6, items: 31, progress: 0 },
    { title: 'Get Well Prepared for Google Interview', gradient: 'from-yellow-400 via-red-500 to-pink-500', chapters: 9, items: 85, progress: 0, isLocked: true, isPremium: true },
    { title: 'Detailed Explanation of SQL Language', gradient: 'from-sky-400 to-cyan-300', chapters: 4, items: 36, progress: 0, isPremium: true },
  ],
  interview: [
     { title: 'Top Questions from Facebook', gradient: 'from-blue-600 to-blue-800', chapters: 7, items: 75, progress: 0, isPremium: true },
     { title: 'Crack the Coding Interview', gradient: 'from-orange-500 to-red-600', chapters: 12, items: 150, progress: 0 },
     { title: 'Data Structures: Advanced', gradient: 'from-indigo-500 to-purple-700', chapters: 8, items: 92, progress: 0 },
     { title: 'Get Well Prepared for Amazon', gradient: 'from-yellow-500 to-orange-400', chapters: 10, items: 110, progress: 0, isPremium: true },
  ]
};

// --- Reusable Components ---

const CourseCard = ({ course, isLarge = false }) => (
  <div className={`relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg group transition-transform duration-300 hover:-translate-y-1 ${isLarge ? 'w-80 h-48' : 'w-64 h-40'}`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient}`}></div>
    <div className="absolute inset-0 bg-black/20"></div>
    <div className="relative h-full flex flex-col justify-between p-4 text-white">
      <h3 className={`font-bold ${isLarge ? 'text-2xl' : 'text-lg'}`}>{course.title}</h3>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <PlayCircle className="w-16 h-16 text-white/30 transition-all duration-300 group-hover:text-white/80 group-hover:scale-110" />
      </div>

      <div className="text-sm">
        <div className="flex justify-between items-center">
          <span>{course.chapters} Chapters</span>
          <span>{course.items} Items</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-1.5 mt-2">
          <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
        </div>
        <p className="text-right mt-1">{course.progress}%</p>
      </div>

      {course.isPremium && (
          <span className="absolute top-2 right-2 text-xs bg-yellow-400/80 text-black font-bold px-2 py-0.5 rounded-md">Premium</span>
      )}
      {course.isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white/80"/>
          </div>
      )}
    </div>
  </div>
);

const CourseSection = ({ title, courseList, children }) => (
    <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button className="flex items-center text-sm text-blue-400 hover:text-blue-300">
                More <ChevronRight className="w-4 h-4" />
            </button>
        </div>
        <div className="flex gap-6 pb-2 -mx-4 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {children ? children : courseList.map((course, index) => <CourseCard key={index} course={course} />)}
        </div>
    </section>
);


// --- Main Page Component ---

const ExplorePage = () => {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <p className="text-sm text-gray-400">Welcome to</p>
            <h1 className="text-3xl font-bold text-white">CodeIU Explore </h1>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-white"><Bookmark className="w-6 h-6"/></button>
            <button className="hover:text-white"><Star className="w-6 h-6"/></button>
          </div>
        </header>

        <div>
            <h2></h2>
        </div>


        {/* Spacing */}
        <div className="my-12"></div>

        {/* Interview Section */}
        <CourseSection title="Interview" courseList={courses.interview} />

      </div>
      <div className='flex items-center justify-center text-5xl font-bold text-white mt-20'>
        <h1>Coming soon...</h1>
      </div>
    </div>
  );
};

export default ExplorePage;
