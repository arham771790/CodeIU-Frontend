"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Plus, Search, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useBundleStore } from "@/app/store/useBundleStore";
import { toast } from "react-hot-toast";
// ✅ Import the Server Actions
import { fetchAllProblemsAction , fetchProblemDetailsAction } from "@/actions/problemBridge";

// --- Helpers (Optimized & Minified) ---
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
  // Simple deep clone
  const norm = JSON.parse(JSON.stringify(p || {}));
  
  // Normalize C++ -> CPP
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
  
  // ✅ Removed useProblemStore entirely!
  const { attachInlineProblems, fetchBundle, isLoading: isBundleLoading } = useBundleStore();

  const [open, setOpen] = useState(false);
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [pointsDefault, setPointsDefault] = useState(100);

  // ✅ Fetch using Server Action when dialog opens
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
    const toastId = toast.loading("Fetching details...");
    
    try {
      // ✅ Fetch single details using Server Action
      const fullProblem = await fetchProblemDetailsAction(p.id);
      
      if (!fullProblem) throw new Error("Not found");

      setSelected((prev) => [
        ...prev,
        { id: fullProblem.id, title: fullProblem.title, points: pointsDefault, order: prev.length, fullProblem },
      ]);
      toast.success("Added", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Error fetching details", { id: toastId });
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
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <button onClick={() => setOpen(true)} className="font-semibold inline-flex items-center gap-2 rounded-full text-white hover:text-blue-400 p-2 border border-white hover:border-blue-400 transition-colors">
        <Plus className="w-5 h-5" /> Attach Problems
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-5xl mx-4 rounded-xl bg-[#111315] border border-gray-800 p-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-white font-semibold">Attach Problems to Contest</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Left Column: Search & List */}
              <div className="lg:col-span-3 space-y-3">
                <div className="flex items-center gap-2 bg-black/40 border border-gray-700 rounded px-2 py-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-gray-200 outline-none" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-400">Default Points</label>
                  <input type="number" min={1} value={pointsDefault} onChange={(e) => setPointsDefault(Math.max(1, Number(e.target.value) || 1))} className="w-24 bg-black/40 border border-gray-700 rounded px-2 py-1 text-gray-200" />
                </div>
                <div className="h-[360px] overflow-auto rounded border border-gray-800">
                  {loadingProblems ? (
                    <div className="p-4 text-gray-400 animate-pulse">Loading library...</div>
                  ) : filtered.length === 0 ? (
                    <div className="p-4 text-gray-400">No problems found.</div>
                  ) : (
                    <ul className="divide-y divide-gray-800">
                      {filtered.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-3 p-3 hover:bg-white/5">
                          <div className="min-w-0">
                            <div className="text-sm text-white truncate">{p.title}</div>
                            <div className="text-[11px] text-gray-400 truncate">{p.difficulty} • {p.slug || "no-slug"}</div>
                          </div>
                          <button type="button" disabled={alreadySelected.has(p.id)} onClick={() => addProblem(p)} className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50">
                            {alreadySelected.has(p.id) ? "Added" : "Add"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Right Column: Selected */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-sm">Selected ({selected.length})</div>
                  <button type="button" onClick={() => setSelected([])} className="text-xs text-gray-400 hover:text-white">Clear</button>
                </div>
                <div className="h-[420px] overflow-auto rounded border border-gray-800">
                  {selected.length === 0 ? (
                    <div className="p-4 text-gray-400">No problems selected.</div>
                  ) : (
                    <ul className="divide-y divide-gray-800">
                      {selected.map((s, idx) => (
                        <li key={s.id} className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-sm text-white truncate">{String.fromCharCode(65 + idx)}. {s.title}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button type="button" onClick={() => move(idx, -1)} className="p-1 rounded hover:bg-white/10"><ChevronUp className="w-4 h-4 text-gray-300" /></button>
                              <button type="button" onClick={() => move(idx, 1)} className="p-1 rounded hover:bg-white/10"><ChevronDown className="w-4 h-4 text-gray-300" /></button>
                              <button type="button" onClick={() => removeProblem(s.id)} className="p-1 rounded hover:bg-red-500/20"><Trash2 className="w-4 h-4 text-red-300" /></button>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <label className="text-[11px] text-gray-400">Points</label>
                            <input type="number" min={1} value={s.points} onChange={(e) => setPoints(s.id, e.target.value)} className="w-24 bg-black/40 border border-gray-700 rounded px-2 py-1 text-gray-200" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</button>
                  <button type="submit" onClick={onSubmit} disabled={isBundleLoading || selected.length === 0} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60">
                    {isBundleLoading ? "Attaching…" : "Attach"}
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