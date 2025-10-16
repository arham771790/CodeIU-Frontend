// src/app/components/contest/ContestAchievements.jsx
"use client";

const rows = [
  { title: "Participation", points: 5 },
  { title: "First Time Participant", points: 200 },
  { title: "Participate in Biweekly + Weekly Contests in Same Week", points: 35 },
];

export default function ContestAchievements() {
  return (
    <section className="px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">🏅 Achievements</h2>
        <div className="divide-y divide-gray-800 border border-gray-800 rounded-xl overflow-hidden">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black">
              <p className="text-gray-200">{r.title}</p>
              <p className="text-emerald-400 font-semibold">{r.points}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
