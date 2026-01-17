import React from "react";
import {
  Github,
  Linkedin,
  Play,
  Pause,
  Code2,
  Cpu,
  Terminal,
  Braces,
} from "lucide-react";

const developers = [
  {
    name: "Syed Wasif Hussain",
    role: "Full Stack Developer",
    description:
      "Wasif is the backbone of the development team, focusing on server-side logic, database management, and API development. He is dedicated to building robust, secure, and scalable systems that power our applications.",
    imageUrl: "me.jpg",
    social: {
      github: "https://github.com/SyedWasif1234",
      linkedin: "https://www.linkedin.com/in/wasif2345",
    },
  },
  {
    name: "Mohd Arham",
    role: "Full Stack Developer",
    description:
      "Arham is a passionate developer with expertise in building scalable web applications. He excels at turning complex problems into elegant, efficient code, focusing on both frontend and backend development to deliver complete and robust solutions.",
    imageUrl: "./arham.jpg",
    social: {
      github: "https://github.com/arham771790/",
      linkedin: "https://www.linkedin.com/in/arhamsheikh0044/",
    },
  },
  {
    name: "Shahan Siddiqui",
    role: "Full Stack Developer",
    description:
      "Shahain specializes in crafting beautiful and intuitive user interfaces. With a keen eye for design and a mastery of modern frontend technologies, he ensures a seamless and engaging user experience across all devices.",
    imageUrl: "./shahain_pic.jpg",
    social: {
      github: "#",
      linkedin: "#",
    },
  },
];

const DeveloperProfile = ({ developer, reverse = false }) => (
  <section className="container mx-auto px-6 py-20 lg:py-32 relative">
    <div
      className={`flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 ${reverse ? "md:flex-row-reverse" : ""}`}
    >
      {/* --- Text Content --- */}
      <div className="md:w-1/2 text-center md:text-left z-10">
        <p className="font-bold tracking-[0.3em] text-primary uppercase text-[10px] mb-4 flex items-center justify-center md:justify-start gap-2">
          <Cpu size={14} /> {developer.role}
        </p>

        <div className="relative inline-block mb-6">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-base-content leading-none pb-5">
            {developer.name.split(" ")[0]}
            <br />
            <span className="opacity-30">
              {developer.name.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-primary rounded-full shadow-[0_0_25px_rgba(var(--p),0.8)]" />
        </div>

        <p className="mt-8 text-base-content/70 text-lg leading-relaxed font-medium max-w-xl">
          {developer.description}
        </p>

        <div className="mt-10 flex items-center justify-center md:justify-start gap-5">
          <button className="btn btn-primary rounded-2xl px-10 h-14 shadow-xl shadow-primary/30 text-white font-black uppercase tracking-widest hover:scale-105 transition-all">
            Portfolio
          </button>
          <div className="flex items-center gap-3">
            <a
              href={developer.social.github}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 bg-base-200 hover:bg-primary/10 rounded-2xl transition-all border border-base-content/10"
            >
              <Github size={22} />
            </a>
            <a
              href={developer.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 bg-base-200 hover:bg-primary/10 rounded-2xl transition-all border border-base-content/10"
            >
              <Linkedin size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* --- Image Content with Constant Neon Glow & Orbits --- */}
      <div className="md:w-1/2 w-full mt-16 md:mt-0 flex justify-center relative">
        <div className="relative w-[300px] h-[300px] sm:w-[420px] sm:h-[420px]">
          {/* 1. Constant Pulsing Background Glow */}
          <div className="absolute inset-0 bg-primary blur-[80px] rounded-full animate-pulse pointer-events-none" />

          {/* 2. Rotating Dashed Orbit (New Interesting Element) */}
          <div className="absolute inset-0 border-2 border-dashed border-[#2AB065]/40 rounded-full animate-[spin_20s_linear_infinite] opacity-50" />

          <div className="absolute w-full h-full bg-base-300 rounded-[2.5rem] transform rotate-12 transition-transform hover:rotate-6 duration-700 shadow-[0_0_50px_rgba(42,176,101,0.25)]" />

          {/* 4. Floating Particles (New Interesting Elements) */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-base-200 rounded-2xl flex items-center justify-center shadow-xl animate-bounce z-20">
            <Terminal size={20} className="text-primary" />
          </div>
          <div className="absolute bottom-10 -left-6 w-10 h-10 bg-base-200 rounded-xl flex items-center justify-center shadow-xl animate-[pulse_3s_ease-in-out_infinite] z-20">
            <Braces size={18} className="text-primary" />
          </div>

          {/* 5. Main Profile Image Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[82%] h-[82%] rounded-full overflow-hidden shadow-2xl relative z-10 bg-base-300 border-4 border-[#2AB065]/30">
              <img
                src={developer.imageUrl}
                alt={developer.name}
                className="w-full h-full object-cover  hover:grayscale-0 transition-all duration-700 scale-105"
              />
            </div>
          </div>

          {/* Floating UI Decorative Elements */}
          <div className="absolute top-1/3 -left-12 bg-white p-3 rounded-full shadow-2xl transition-transform hover:scale-110 z-20 border-4 border-base-100">
            <Pause className="text-gray-900 w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </div>

          <div className="absolute bottom-1/4 -right-10 bg-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 transition-transform hover:scale-110 z-20 border-4 border-base-100">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Play
                size={18}
                className="text-white fill-current translate-x-0.5"
              />
            </div>
            <div className="space-y-2">
              <div className="h-1.5 w-14 bg-gray-200 rounded-full"></div>
              <div className="h-1.5 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const DeveloperPage = () => {
  return (
    <div className="min-h-screen bg-base-300 text-base-content font-sans overflow-hidden">
      {/* Background Grid Removed as per request */}

      <div className="relative border-b border-base-content/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <header className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            
             <span className="relative inline-block mx-2">
            The <span className="text-primary">Engineers</span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-primary to-primary/60 mx-2">
                X
              </span>
            </span>
          </h1>
           <div className=" h-1 w-20 bg-primary mt-6 rounded-full shadow-[0_0_15px_rgba(var(--p),0.5)] mx-auto" />
        </header>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto  ">

        <div className="space-y-5">
          {developers.map((dev, index) => (
            <DeveloperProfile
              key={dev.name}
              developer={dev}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperPage;
