// src/app/components/contest/ContestPrizes.jsx
"use client";

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
    <section className="px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">🏆 Prizess</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.place} className="bg-[#121212] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-300">{it.place}</p>
              <p className="text-2xl font-bold text-white mt-1">{it.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
