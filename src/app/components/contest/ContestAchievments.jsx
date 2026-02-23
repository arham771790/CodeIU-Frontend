"use client";
import { Medal, Sparkles, Plus, Zap, Target, Crown, TerminalSquare } from "lucide-react";

// Updated with highly gamified, DSA-specific achievements and custom icons
const rows = [
  { 
    title: "Participation", 
    points: 10, 
    description: "Awarded for submitting at least one attempt during the contest.",
    icon: TerminalSquare,
    color: "text-blue-500",
    bg: "group-hover:bg-blue-500/10"
  },
  { 
    title: "First-Time Hacker", 
    points: 50, 
    description: "Welcome bonus for participating in your very first CodeIU contest.",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "group-hover:bg-purple-500/10"
  },
  { 
    title: "Flawless Execution", 
    points: 25, 
    description: "Get an 'Accepted' verdict on your very first submission for a problem.",
    icon: Target,
    color: "text-green-500",
    bg: "group-hover:bg-green-500/10"
  },
  { 
    title: "First Blood", 
    points: 100, 
    description: "Be the very first participant in the arena to solve a specific problem.",
    icon: Zap,
    color: "text-yellow-500",
    bg: "group-hover:bg-yellow-500/10"
  },
  { 
    title: "The Finisher", 
    points: 200, 
    description: "Successfully solve all problems assigned in the contest sector.",
    icon: Crown,
    color: "text-orange-500",
    bg: "group-hover:bg-orange-500/10"
  },
];

export default function ContestAchievements() {
  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header with Neon Accent */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--p),0.5)]" />
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Medal className="text-primary" size={24} /> 
            Achievements <span className="opacity-20">& Rewards</span>
          </h2>
        </div>

        {/* Achievement List with Glassmorphism */}
        <div className="bg-base-200/50 border border-base-content/10 rounded-[2rem] overflow-hidden shadow-xl backdrop-blur-md">
          <div className="divide-y divide-base-content/5">
            {rows.map((r, i) => {
              const IconComponent = r.icon; // Extract the specific icon

              return (
                <div 
                  key={i} 
                  className="group flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-base-content/5 transition-all duration-300 gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Dynamic Icon Styling */}
                    <div className={`w-12 h-12 rounded-2xl bg-base-300 flex items-center justify-center opacity-40 group-hover:opacity-100 ${r.color} ${r.bg} transition-all duration-500`}>
                      <IconComponent size={20} />
                    </div>
                    
                    <div>
                      <p className="text-base font-bold text-base-content group-hover:text-primary transition-colors">
                        {r.title}
                      </p>
                      <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest mt-0.5 max-w-lg">
                        {r.description}
                      </p>
                    </div>
                  </div>

                  {/* Points Badge */}
                  <div className="flex items-center self-start md:self-auto gap-1 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 shrink-0">
                    <Plus size={14} className="text-primary" />
                    <p className="text-xl font-black text-primary font-mono leading-none">
                      {r.points}
                    </p>
                    <span className="text-[10px] font-black uppercase text-primary/60 ml-1">Pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Hint */}
        <p className="mt-4 ml-4 text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">
          * Points are credited within 1 week of contest end
        </p>
      </div>
    </section>
  );
}