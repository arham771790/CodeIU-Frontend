"use client";
import { Medal, Sparkles, Plus } from "lucide-react";

const rows = [
  { title: "Participation", points: 5, description: "Awarded for competing in the full duration." },
  { title: "First Time Participant", points: 200, description: "Welcome bonus for your first CodeIU arena entry." },
  { title: "Weekly Warrior", points: 35, description: "Participate in Biweekly + Weekly Contests in same week." },
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
            {rows.map((r, i) => (
              <div 
                key={i} 
                className="group flex items-center justify-between p-6 hover:bg-base-content/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-base-300 flex items-center justify-center text-primary/40 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-base-content group-hover:text-primary transition-colors">
                      {r.title}
                    </p>
                    <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest mt-0.5">
                      {r.description || "Earned upon successful completion"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                  <Plus size={14} className="text-primary" />
                  <p className="text-xl font-black text-primary font-mono leading-none">
                    {r.points}
                  </p>
                  <span className="text-[10px] font-black uppercase text-primary/60 ml-1">Pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Hint */}
        <p className="mt-4 ml-4 text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">
          * Points are credited within 24 hours of contest end
        </p>
      </div>
    </section>
  );
}