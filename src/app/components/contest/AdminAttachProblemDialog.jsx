// src/app/components/contest/AdminAttachProblemsDialog.jsx
"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useBundleStore } from "@/app/store/useBundleStore";

const PROBLEM_INDEXES = ["A", "B", "C", "D"];

export default function AdminAttachProblemsDialog({ contestId }) {
  const { authUser } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";
  const { attachFrozen, isLoading } = useBundleStore();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    PROBLEM_INDEXES.map((idx) => ({
      index: idx,
      points: 100,
      problemId: "",
      title: "",
      slug: "",
      version: 1,
      judge: { timeLimitMs: 2000, memoryLimitMb: 256 },
    }))
  );

  if (!isAdmin) return null;

  const update = (i, field, value) => {
    setItems((arr) => {
      const copy = [...arr];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // minimal validation
    for (const it of items) {
      if (!it.problemId || !it.title || !it.points) return;
    }
    const ok = await attachFrozen({ contestId, problems: items });
    if (ok) setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white p-2"
      >
        <Plus className="w-5 h-5 font-semibold" />
        Add-Problems
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-3xl mx-4 rounded-xl bg-[#121212] border border-gray-800 p-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-white font-semibold">Attach Frozen Problems</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {items.map((it, i) => (
                <div key={it.index} className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-black/30 p-3 rounded-lg border border-gray-800">
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-400 mb-1">Index</label>
                    <input disabled value={it.index} className="w-full bg-black/40 border border-gray-700 rounded px-2 py-2 text-gray-200" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Problem ID</label>
                    <input
                      value={it.problemId}
                      onChange={(e) => update(i, "problemId", e.target.value)}
                      className="w-full bg-black/40 border border-gray-700 rounded px-2 py-2 text-gray-200"
                      placeholder="uuid or numeric id"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs text-gray-400 mb-1">Title</label>
                    <input
                      value={it.title}
                      onChange={(e) => update(i, "title", e.target.value)}
                      className="w-full bg-black/40 border border-gray-700 rounded px-2 py-2 text-gray-200"
                      placeholder="Two Sum"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Slug (optional)</label>
                    <input
                      value={it.slug}
                      onChange={(e) => update(i, "slug", e.target.value)}
                      className="w-full bg-black/40 border border-gray-700 rounded px-2 py-2 text-gray-200"
                      placeholder="two-sum"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-400 mb-1">Points</label>
                    <input
                      type="number"
                      min={1}
                      value={it.points}
                      onChange={(e) => update(i, "points", Number(e.target.value))}
                      className="w-full bg-black/40 border border-gray-700 rounded px-2 py-2 text-gray-200"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-400 mb-1">Version</label>
                    <input
                      type="number"
                      min={1}
                      value={it.version}
                      onChange={(e) => update(i, "version", Number(e.target.value))}
                      className="w-full bg-black/40 border border-gray-700 rounded px-2 py-2 text-gray-200"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-400 mb-1">TL (ms)</label>
                    <input
                      type="number"
                      min={1}
                      value={it.judge.timeLimitMs}
                      onChange={(e) =>
                        update(i, "judge", { ...it.judge, timeLimitMs: Number(e.target.value) })
                      }
                      className="w-full bg-black/40 border border-gray-700 rounded px-2 py-2 text-gray-200"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-400 mb-1">ML (MB)</label>
                    <input
                      type="number"
                      min={1}
                      value={it.judge.memoryLimitMb}
                      onChange={(e) =>
                        update(i, "judge", { ...it.judge, memoryLimitMb: Number(e.target.value) })
                      }
                      className="w-full bg-black/40 border border-gray-700 rounded px-2 py-2 text-gray-200"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60"
                >
                  {isLoading ? "Attaching…" : "Attach"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
