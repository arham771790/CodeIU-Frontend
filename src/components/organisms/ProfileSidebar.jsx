import React from 'react';
import { User, Eye, CheckSquare, MessageSquare, Star, Cpu, Github, Linkedin } from 'lucide-react';

const StatRow = ({ icon: Icon, label, value }) => (
  <li className="flex justify-between items-center text-xs py-2 border-b border-base-content/5 last:border-0">
    <span className="flex items-center gap-2 opacity-50 font-bold uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5 text-primary" /> {label}
    </span>
    <span className="font-black text-base-content">{value}</span>
  </li>
);

const ProfileSidebar = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden group">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
        
        {/* Avatar with Neon Orbit */}
        <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-dashed border-primary/40 rounded-full animate-[spin_15s_linear_infinite]" />
            <div className="absolute inset-2 bg-base-300 rounded-full flex items-center justify-center border-2 border-primary/20 shadow-[0_0_20px_rgba(var(--p),0.2)]">
                <User className="w-12 h-12 text-primary opacity-50" />
            </div>
        </div>

        <h1 className="text-2xl font-black text-base-content tracking-tighter">{user?.username || "Synchronizing..."}</h1>
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2 mb-6">System {user?.role || "USER"}</p>
        
        <div className="flex justify-center gap-3 mb-6">
             <button className="p-2 bg-base-300 border border-base-content/5 rounded-xl hover:text-primary transition-colors"><Github size={18}/></button>
             <button className="p-2 bg-base-300 border border-base-content/5 rounded-xl hover:text-primary transition-colors"><Linkedin size={18}/></button>
        </div>

        <button className="w-full btn btn-primary btn-sm rounded-xl font-black uppercase tracking-widest text-[10px]">
          Edit Protocol
        </button>
      </div>

      <div className="bg-base-200/50 backdrop-blur-md border border-base-content/10 rounded-[2rem] p-6">
        <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Community Matrix</h2>
        <ul className="space-y-1">
          <StatRow icon={Eye} label="Views" value="0" />
          <StatRow icon={CheckSquare} label="Solutions" value="0" />
          <StatRow icon={MessageSquare} label="Discuss" value="0" />
          <StatRow icon={Star} label="Reputation" value="0" />
        </ul>
      </div>
    </div>
  );
};
export default ProfileSidebar;