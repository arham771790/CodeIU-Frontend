// src/app/components/ProblemSearchBar.jsx
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useSearchStore } from "@/app/store/useSearchStore";


export default function ProblemSearchBar() {
  // Get all functions and state from the store
  const { searchTerm, setSearchTerm, search, clearSearch } = useSearchStore();

  // Create local state for the input to enable debouncing
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Implement the debouncing effect
  useEffect(() => {
    // Update the store's searchTerm immediately for persistence
    setSearchTerm(localSearch);

    const timer = setTimeout(() => {
      if (localSearch.trim() !== "") {
        search(); // Fire the API search
      } else {
        clearSearch(); // Clear results if input is empty
      }
    }, 500); // 500ms debounce

    // Cleanup: clear the timer if the user types again
    return () => {
      clearTimeout(timer);
    };
  }, [localSearch, setSearchTerm, search, clearSearch]);

  return (
    <div className="relative w-full sm:w-auto flex-grow max-w-lg ">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        type="text"
        placeholder="Search problems"
        className="w-full bg-gray-800 border border-gray-700/50 rounded-full pl-12 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </div>
  );
}