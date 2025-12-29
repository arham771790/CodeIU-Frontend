// app/problems/loading.jsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-black min-h-screen p-8 flex flex-col items-center justify-center">
      {/* 1. The Spinner */}
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
      
      {/* 2. Optional: Skeleton UI (Fake text lines) */}
      <p className="text-gray-500 animate-pulse">Loading contests...</p>
      
      {/* You can even copy your grid structure here with gray boxes */}
    </div>
  );
}