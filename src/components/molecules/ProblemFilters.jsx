"use client"; // This is the ONLY component that needs "use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Plus } from "lucide-react";
import { useDebouncedCallback } from "use-debounce"; // npm install use-debounce
import { useAuthStore } from "@/store/useAuthStore";

export default function ProblemFilters() {
  const searchParams = useSearchParams();
  const navigate = useRouter();
  const { authUser } = useAuthStore();


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
    navigate.replace(`?${params.toString()}`);
  }, 300); // Wait 300ms after typing stops


  const handleCreateProblem = () => {
    navigate.push(`/problems/CreateProblem`);
  };


  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative w-full sm:w-[40%]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 w-4 h-4" />
        <input
          placeholder="Search problems..."
          /* SENIOR FIX: bg-base-200 and border-base-content/20 */
          className="w-full bg-base-200 border border-base-content/20 rounded-full py-2.5 pl-10 pr-4 text-sm text-base-content focus:outline-none focus:border-primary transition-all"
          defaultValue={searchParams.get("q")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        {authUser?.role === "ADMIN" && (
          <button onClick={handleCreateProblem} className="btn btn-circle btn-ghost border border-base-content/10 bg-base-200 hover:bg-base-300">
            <Plus className="w-5 h-5 opacity-70" />
          </button>
        )}

        <button className="btn btn-circle btn-ghost border border-base-content/10 bg-base-200 hover:bg-base-300">
          <Filter className="w-5 h-5 opacity-70" />
        </button>
      </div>
    </div>
  );
}