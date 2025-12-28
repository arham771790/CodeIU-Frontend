// src/app/components/contest/ContestPrizes.jsx
"use client";

import { Trophy } from "lucide-react";

const items = [
  { place: "1st Place", amount: "5,000" },
  { place: "2nd Place", amount: "2,500" },
  { place: "3rd Place", amount: "1,000" },
  { place: "4th - 50th Place", amount: "300" },
  { place: "51st - 100th Place", amount: "100" },
  { place: "101st - 200th Place", amount: "50" },
];

export default function ContestPrizes() {
  return (
    <section>
      <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
        <Trophy size={20} className="text-primary" /> Prizes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((it) => (
          <div key={it.place} className="bg-base-300/30 border border-base-content/5 rounded-2xl p-5 hover:bg-base-300/50 transition-colors">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{it.place}</p>
            <p className="text-2xl font-black text-primary font-mono">{it.amount}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
