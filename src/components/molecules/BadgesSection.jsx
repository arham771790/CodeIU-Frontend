import React from 'react';
import { Lock } from 'lucide-react';

const BadgesSection = () => {
  return (
    <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2.5rem] p-8 relative overflow-hidden group h-full">
      {/* 1. Header Label */}
      <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-8 relative z-10">
        Achievements X
      </h2>

      <div className="flex items-center gap-8 relative z-10">
        {/* 2. Rotated Badge Icon with Pulsing Neon Aura */}
        <div className="w-20 h-20 bg-base-300 rounded-3xl rotate-12 flex items-center justify-center text-3xl border border-base-content/10 shadow-2xl relative transition-transform group-hover:rotate-6 duration-500">
            {/* Bio-luminescent Pulse behind the lock */}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse pointer-events-none" />
            <span className="relative z-10 opacity-30 grayscale">🔒</span>
        </div>

        {/* 3. Status Info */}
        <div className="border-l border-base-content/10 pl-6 py-1">
          <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-1">
            Status: Upcoming
          </p>
          <p className="text-base-content font-black text-xl tracking-tighter">
            No Badge Earned
          </p>
        </div>
      </div>

      {/* 4. Large Decorative Background Number */}
      <div className="absolute -bottom-10 -right-6 text-[11rem] font-black text-primary/5 select-none pointer-events-none">
        0
      </div>
    </div>
  );
};

export default BadgesSection;