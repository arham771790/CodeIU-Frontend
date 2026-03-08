"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X, Plus, Search, ChevronUp, ChevronDown,
  Trash2, Database, ListChecks, Hash, Settings2
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useBundleStore } from "@/store/useBundleStore";
import { toast } from "react-toastify";
// Server Actions
import { fetchAllProblemsAction, fetchProblemDetailsAction } from "@/actions/problemBridge";

// --- Logic Helpers (Preserved) ---
const tcRow = (row) => {
  if (!row) return { input: "1", output: "1" };
  if (typeof row === "string") {
    const [i, o] = row.split("|");
    return { input: i?.trim() ?? "1", output: o?.trim() ?? "1" };
  }
  return {
    input: String(row.input ?? row.in ?? row.stdin ?? "1").trim(),
    output: String(row.output ?? row.out ?? row.stdout ?? "1").trim()
  };
};

const extractTC = (src) => {
  const keys = ['testcases', 'testCases', 'publicTestcases', 'hiddenTestcases', 'privateTestcases', 'visibleTestcases'];
  const merged = keys.flatMap(k => Array.isArray(src?.[k]) ? src[k] : []);
  return (merged.length ? merged : [{ input: "1", output: "1" }]).map(tcRow);
};

const toInlineSnapshot = (p) => {
  const norm = JSON.parse(JSON.stringify(p || {}));
  ['codeSnippets', 'referenceSolutions', 'examples'].forEach(k => {
    if (norm[k]?.['C++']) { norm[k].CPP = norm[k]['C++']; delete norm[k]['C++']; }
  });
  const ensureEx = (e) => ({ input: e?.input ?? "1", output: e?.output ?? "1", explanation: e?.explanation ?? "" });
  const ensureStr = (s, def) => (typeof s === "string" && s.trim().length ? s : def);

  return {
    title: ensureStr(norm.title, "Untitled"),
    description: ensureStr(norm.description, "No description."),
    difficulty: norm.difficulty || "EASY",
    tags: Array.isArray(norm.tags) ? norm.tags.filter(Boolean) : ["misc"],
    constraints: ensureStr(norm.constraints, "N/A"),
    hints: norm.hints || "",
    editorial: norm.editorial || "",
    testcases: extractTC(norm),
    examples: {
      JAVASCRIPT: ensureEx(norm.examples?.JAVASCRIPT),
      PYTHON: ensureEx(norm.examples?.PYTHON),
      JAVA: ensureEx(norm.examples?.JAVA),
      ...(norm.examples?.CPP ? { CPP: ensureEx(norm.examples.CPP) } : {}),
    },
    codeSnippets: norm.codeSnippets || {},
    referenceSolutions: norm.referenceSolutions || {},
    judge: {
      timeLimitMs: norm.judge?.timeLimitMs ?? 2000,
      memoryLimitMb: norm.judge?.memoryLimitMb ?? 256
    },
    source: { kind: "INLINE", sourceProblemId: p?.id },
  };
};

export default function AdminAttachProblemsDialog({ contestId }) {
  const { authUser } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";
  const { attachInlineProblems, fetchBundle, isLoading: isBundleLoading } = useBundleStore();

  const [open, setOpen] = useState(false);
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [pointsDefault, setPointsDefault] = useState(100);

  useEffect(() => {
    if (open && problems.length === 0) {
      setLoadingProblems(true);
      fetchAllProblemsAction()
        .then((data) => setProblems(data || []))
        .catch(() => toast.error("Failed to load problems"))
        .finally(() => setLoadingProblems(false));
    }
  }, [open, problems.length]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return problems;
    return problems.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    );
  }, [problems, query]);

  const alreadySelected = new Set(selected.map((s) => s.id));

  const addProblem = async (p) => {
    if (alreadySelected.has(p.id)) return;
    const toastId = toast.loading("Fetching problem details...");
    try {
      const fullProblem = await fetchProblemDetailsAction(p.id);
      if (!fullProblem) throw new Error("Not found");
      setSelected((prev) => [
        ...prev,
        { id: fullProblem.id, title: fullProblem.title, points: pointsDefault, order: prev.length, fullProblem },
      ]);
      toast.update(toastId, {
        render: "Problem added to queue",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Error fetching details",
        type: "error",
        isLoading: false,
        autoClose: 2000
      });
    }
  };

  const removeProblem = (id) => {
    setSelected((prev) => prev.filter((x) => x.id !== id).map((x, i) => ({ ...x, order: i })));
  };

  const move = (idx, dir) => {
    setSelected((prev) => {
      const arr = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return arr.map((x, i) => ({ ...x, order: i }));
    });
  };

  const setPoints = (id, val) => {
    const v = Math.max(1, Number(val) || 1);
    setSelected((prev) => prev.map((x) => (x.id === id ? { ...x, points: v } : x)));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) return toast.error("Select at least one problem.");
    const payload = selected.map((s) => ({
      points: s.points,
      order: s.order,
      inline: toInlineSnapshot(s.fullProblem),
    }));
    const ok = await attachInlineProblems({ contestId, problems: payload });
    if (ok) {
      await fetchBundle?.({ contestId, userId: authUser.id });
      setOpen(false);
      setSelected([]);
      setQuery("");
      toast.success("Contest updated successfully!");
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-outline border-base-content/20 hover:bg-primary hover:text-white hover:border-primary rounded-2xl px-6 gap-2 transition-all font-black text-xs uppercase tracking-widest"
      >
        <Plus className="w-4 h-4" /> Attach Problems
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-base-100/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-6xl bg-base-200 border border-base-content/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

            {/* Header */}
            <div className="px-8 py-6 border-b border-base-content/5 flex items-center justify-between bg-base-300/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Attach Problem Library</h3>
                  <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Contest Builder</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-base-content/10 rounded-full transition-colors opacity-50 hover:opacity-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">

              {/* Left Column: Problem Library */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <input
                      placeholder="Search problem library..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-base-300/50 border border-base-content/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-base-300/50 border border-base-content/10 rounded-xl px-4 py-2">
                    <label className="text-[10px] font-black uppercase opacity-40 tracking-widest">Default Pts</label>
                    <input
                      type="number"
                      min={1}
                      value={pointsDefault}
                      onChange={(e) => setPointsDefault(Math.max(1, Number(e.target.value) || 1))}
                      className="w-16 bg-transparent text-sm font-bold text-primary outline-none"
                    />
                  </div>
                </div>

                <div className="h-[400px] overflow-auto rounded-2xl border border-base-content/10 bg-base-300/20">
                  {loadingProblems ? (
                    <div className="flex items-center justify-center h-full gap-3 text-sm opacity-40 italic">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Syncing library...
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-sm opacity-40 italic">No matches found.</div>
                  ) : (
                    <div className="divide-y divide-base-content/5">
                      {filtered.map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-4 p-4 hover:bg-base-content/5 transition-colors group">
                          <div className="min-w-0">
                            <div className="text-sm font-bold group-hover:text-primary transition-colors truncate">{p.title}</div>
                            <div className="text-[10px] uppercase font-bold opacity-30 flex items-center gap-2 mt-0.5">
                              {p.difficulty} <span className="w-1 h-1 rounded-full bg-current opacity-50" /> {p.slug || "no-slug"}
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={alreadySelected.has(p.id)}
                            onClick={() => addProblem(p)}
                            className={`btn btn-sm rounded-lg px-4 ${alreadySelected.has(p.id) ? 'btn-disabled opacity-30' : 'btn-primary shadow-lg shadow-primary/20'}`}
                          >
                            {alreadySelected.has(p.id) ? "Added" : "Add"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Selected Queue */}
              <div className="lg:col-span-2 space-y-6 flex flex-col">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <ListChecks size={16} className="text-primary" />
                    <span className="text-sm font-black uppercase tracking-widest">Problem Queue</span>
                    <span className="badge badge-primary badge-sm font-bold">{selected.length}</span>
                  </div>
                  <button type="button" onClick={() => setSelected([])} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:text-error hover:opacity-100 transition-all">Clear All</button>
                </div>

                <div className="flex-1 h-[360px] overflow-auto rounded-2xl border border-base-content/10 bg-base-300/20">
                  {selected.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-sm opacity-40 italic text-center px-8">Queue is empty. Select problems from the left.</div>
                  ) : (
                    <div className="divide-y divide-base-content/5">
                      {selected.map((s, idx) => (
                        <div key={s.id} className="p-4 space-y-3 bg-base-200/50">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-6 h-6 flex items-center justify-center bg-primary text-primary-content text-xs font-black rounded-lg">{String.fromCharCode(65 + idx)}</span>
                              <div className="text-sm font-bold truncate">{s.title}</div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button type="button" onClick={() => move(idx, -1)} className="p-1.5 rounded-lg hover:bg-base-content/10 opacity-50 hover:opacity-100 transition-all"><ChevronUp size={14} /></button>
                              <button type="button" onClick={() => move(idx, 1)} className="p-1.5 rounded-lg hover:bg-base-content/10 opacity-50 hover:opacity-100 transition-all"><ChevronDown size={14} /></button>
                              <button type="button" onClick={() => removeProblem(s.id)} className="p-1.5 rounded-lg hover:bg-error/10 text-error opacity-50 hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 pl-9">
                            <label className="text-[10px] font-black uppercase opacity-40 tracking-widest"><Hash size={10} className="inline mr-1" /> Points</label>
                            <input
                              type="number"
                              min={1}
                              value={s.points}
                              onChange={(e) => setPoints(s.id, e.target.value)}
                              className="w-20 bg-base-300/50 border border-base-content/10 rounded-lg px-2 py-1 text-xs font-bold outline-none text-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-base-content/5">
                  <button type="button" onClick={() => setOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold opacity-50 hover:opacity-100 hover:bg-base-content/5 transition-all">Cancel</button>
                  <button
                    type="submit"
                    disabled={isBundleLoading || selected.length === 0}
                    className="btn btn-primary rounded-xl px-8 h-12 shadow-xl shadow-primary/20 text-white font-black uppercase tracking-widest disabled:opacity-50"
                  >
                    {isBundleLoading ? "Updating..." : "Attach Problems"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}