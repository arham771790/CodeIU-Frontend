// src/app/(pages)/contest/manage/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useContestStore } from "@/app/store/useContestStore";
import EditContestDialog from "@/app/components/contest/EditContestDialog";
import { useRouter } from "next/navigation";

export default function ManageContestsPage() {
  const router = useRouter();
  const { authUser } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";

  const { contests, fetchContests, deleteContest, isLoading } = useContestStore();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // contest object being edited

  useEffect(() => {
    if (!isAdmin) router.replace("/"); // quick guard
  }, [isAdmin, router]);

  useEffect(() => {
    fetchContests(""); // load all
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contests;
    return contests.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q)
    );
  }, [search, contests]);

  const onDelete = async (id) => {
    if (!confirm("Delete this contest?")) return;
    await deleteContest(id);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black  px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="overflow-x-auto border border-gray-800 rounded-xl ">
          <table className="min-w-full text-sm ">
            <thead className="bg-gradient-to-b from-[#020d2e] via-black to-black text-gray-300">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Slug</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Starts</th>
                <th className="text-left px-4 py-3">Ends</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((c) => (
                  <tr key={c.id} className="border-t border-gray-800 bg-gradient-to-b from-[#020d2e] via-black to-black">
                    <td className="px-4 py-3 text-gray-100">{c.title}</td>
                    <td className="px-4 py-3 text-gray-400">{c.slug}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-gray-800 px-2 py-1 text-xs">
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {new Date(c.startsAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {new Date(c.endsAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditing(c)}
                          className="px-3 py-1.5 rounded-md border border-gray-700 bg-gray-900 hover:bg-gray-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(c.id)}
                          className="px-3 py-1.5 rounded-md border border-red-700/60 bg-red-900/30 hover:bg-red-900/40 text-red-300"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => router.push(`/contest/${c.id}`)}
                          className="px-3 py-1.5 rounded-md border border-blue-700/60 bg-blue-900/30 hover:bg-blue-900/40 text-blue-300"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No contests found.
                  </td>
                </tr>
              )}
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
