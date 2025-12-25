"use client"; // This is the ONLY component that needs "use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Plus } from "lucide-react";
import { useDebouncedCallback } from "use-debounce"; // npm install use-debounce

export default function ProblemFilters({ isAdmin }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // This function updates the URL when you type
  // e.g. /problems -> /problems?q=two+sum
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    
    // replace() updates the URL without reloading the page
    router.replace(`?${params.toString()}`);
  }, 300); // Wait 300ms after typing stops

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative w-full sm:w-auto flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          placeholder="Search problems..."
          className="w-full bg-gray-900 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
          defaultValue={searchParams.get("q")?.toString()} 
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        {isAdmin && (
           <button className="p-2.5 bg-gray-800 border border-gray-700/50 rounded-full hover:bg-gray-800 transition-colors">
             <Plus className="w-5 h-5 text-gray-400" />
           </button>
        )}
        
        <button className="p-2.5 bg-gray-800 border border-gray-700/50 rounded-full hover:bg-gray-800 transition-colors">
          <Filter className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}