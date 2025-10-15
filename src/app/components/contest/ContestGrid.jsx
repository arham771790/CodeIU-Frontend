"use client";
import ContestCard from "./ContestCard";

export default function ContestGrid({ items = [], onCardClick }) {
  if (!items.length) {
    return <p className="text-gray-400">No contests found.</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((c) => (
        <ContestCard key={c.id} contest={c} onClick={() => onCardClick?.(c)} />
      ))}
    </div>
  );
}
