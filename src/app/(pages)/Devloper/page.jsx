"use client";

import React from 'react';
import { Github, Linkedin, Twitter, Play, Pause } from 'lucide-react';

const developers = [
  {
    name: "Mohd Arhan",
    role: "Full Stack Developer",
    description: "Arhan is a passionate developer with expertise in building scalable web applications. He excels at turning complex problems into elegant, efficient code, focusing on both frontend and backend development to deliver complete and robust solutions.",
    imageUrl: "./arham.jpg",
    social: {
      github: "#",
      linkedin: "#",
      twitter: "#",
    }
  },
  {
    name: "Shahain Siddiquie",
    role: "Full Stack Developer",
    description: "Shahain specializes in crafting beautiful and intuitive user interfaces. With a keen eye for design and a mastery of modern frontend technologies, he ensures a seamless and engaging user experience across all devices.",
    imageUrl: "./shahain_pic.jpg",
     social: {
      github: "#",
      linkedin: "#",
      twitter: "#",
    }
  },
  {
    name: "Syed Wasif Hussain",
    role: "Full Stack Developer",
    description: "Wasif is the backbone of the development team, focusing on server-side logic, database management, and API development. He is dedicated to building robust, secure, and scalable systems that power our applications.",
    imageUrl: "me.jpg",
     social: {
      github: "#",
      linkedin: "#",
      twitter: "#",
    }
  },
];

const DeveloperProfile = ({ developer, reverse = false }) => (
  <section className="container mx-auto px-4 py-12">
    <div className={`flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-20 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      {/* Text Content */}
      <div className="md:w-1/2 text-center md:text-left">
        <p className="font-semibold tracking-widest text-gray-500 uppercase">{developer.role}</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-4 leading-tight">
          {developer.name.split(' ')[0]}
          <br />
          {developer.name.split(' ').slice(1).join(' ')}
        </h1>
        <div className="w-24 h-1.5 bg-lime-300 mt-6 mx-auto md:mx-0"></div>
        <p className="mt-6 text-gray-600 text-lg">
          {developer.description}
        </p>
        <button className="mt-8 bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300">
          Learn More
        </button>
      </div>

      {/* Image Content */}
      <div className="md:w-1/2 w-full mt-10 md:mt-0 flex justify-center">
        <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px]">
          <div className="absolute w-full h-full bg-lime-200/80 rounded-3xl transform rotate-12"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[85%] h-[85%] rounded-full overflow-hidden shadow-2xl">
              <img 
                  src={developer.imageUrl} 
                  alt={developer.name} 
                  className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-1/4 -left-8 bg-white p-3 rounded-full shadow-lg transition-transform hover:scale-110">
              <Pause className="text-gray-800 w-5 h-5 sm:w-6 sm:h-6"/>
          </div>
          <div className="absolute bottom-1/4 -right-8 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 transition-transform hover:scale-110">
              <Play className="text-gray-800 w-5 h-5 sm:w-6 sm:h-6"/>
              <div className="space-y-1.5">
                  <div className="h-1.5 w-10 bg-gray-200 rounded-full"></div>
                  <div className="h-1.5 w-6 bg-gray-200 rounded-full"></div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const DeveloperPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto py-12 lg:py-24 space-y-24">
        {developers.map((dev, index) => (
          <DeveloperProfile key={dev.name} developer={dev} reverse={index % 2 !== 0} />
        ))}
      </div>
    </div>
  );
};

export default DeveloperPage;

