"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useContestStore } from "@/store/useContestStore";
import EditContestDialog from "@/components/organisms/EditContestDialog";
import { useRouter } from "next/navigation";

export default function ContestManager({ initialContests }) {
  const router = useRouter();
  const { authUser } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";

  const { contests, setContests, deleteContest, isLoading } = useContestStore();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  // 1. HYDRATE STORE: Put server data into Zustand immediately
  useEffect(() => {
    setContests(initialContests);
  }, [initialContests, setContests]);

  // Guard Clause (Client Side)
  useEffect(() => {
    if (authUser && !isAdmin) router.replace("/");
  }, [isAdmin, authUser, router]);

  // Search Logic (Instant)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contests;
    return contests.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q)
    );
  }, [search, contests]);

  const onDelete = async (id) => {
    if (!confirm("Delete this contest?")) return;
    await deleteContest(id);
  };

  // If role is loading or not admin, show nothing or skeleton
  if (!authUser || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Contests</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or slug"
            className="bg-gradient-to-b from-[#020d2e] via-black to-black text-white border border-gray-800 rounded-md px-3 py-2 text-sm w-64"
          />
        </div>
        <div className="overflow-x-auto border border-base-content/10 rounded-2xl bg-base-200/50 backdrop-blur-sm">
          <table className="table w-full">
            <thead className="bg-base-300/80 text-base-content/60 uppercase text-[10px] tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4 border-none">Contest Details</th>
                <th className="px-6 py-4 border-none">Status</th>
                <th className="px-6 py-4 border-none">Timeline</th>
                <th className="text-right px-6 py-4 border-none">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-base-content/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-base-content group-hover:text-primary transition-colors">
                      {c.title}
                    </div>
                    <div className="text-[10px] opacity-40 font-mono">
                      {c.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        c.status === "RUNNING"
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-base-300 text-base-content/50"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-base-content/60">
                    <div>Starts: {new Date(c.startsAt).toLocaleString()}</div>
                    <div className="opacity-40">
                      Ends: {new Date(c.endsAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {/* Updated Button Styles */}
                      <button
                        onClick={() => setEditing(c)}
                        className="btn btn-ghost btn-xs rounded-lg bg-base-300 hover:bg-primary hover:text-primary-content"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(c.id)}
                        className="btn btn-ghost btn-xs rounded-lg text-error hover:bg-error hover:text-error-content"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit dialog */}
      {editing && (
        <EditContestDialog contest={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
