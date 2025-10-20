"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Plus, Search, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useBundleStore } from "@/app/store/useBundleStore";
import { useProblemStore } from "@/app/store/useProblemStore";
import { toast } from "react-hot-toast";

/** Normalize "C++" keys → "CPP" */
function normalizeLangKeys(problem) {
  const deep = JSON.parse(JSON.stringify(problem || {}));
  const fix = (obj, from, to) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, from)) {
      obj[to] = obj[from];
      delete obj[from];
    }
  };
  fix(deep?.codeSnippets, "C++", "CPP");
  fix(deep?.referenceSolutions, "C++", "CPP");
  fix(deep?.examples, "C++", "CPP");
  return deep;
}

function nonEmptyString(s, fallback) {
  return typeof s === "string" && s.trim().length ? s : fallback;
}

function ensureExample(e, defIn = "1", defOut = "1") {
  return {
    input: nonEmptyString(e?.input, defIn),
    output: nonEmptyString(e?.output, defOut),
    explanation: e?.explanation || "",
  };
}

/** Convert problem → inline snapshot with safe defaults */
function toInlineSnapshot(p) {
  const norm = normalizeLangKeys(p);

  const code = norm.codeSnippets || {};
  const ref  = norm.referenceSolutions || {};
  const ex   = norm.examples || {};
  const tags = Array.isArray(norm.tags) ? norm.tags.filter(Boolean) : [];

  return {
    title: nonEmptyString(norm.title, "Untitled"),
    description: nonEmptyString(norm.description, "No description provided."),
    difficulty: norm.difficulty || "EASY",
    tags: tags.length ? tags : ["misc"],
    constraints: nonEmptyString(norm.constraints, "N/A"),
    hints: norm.hints || "",
    editorial: norm.editorial || "",

    testcases:
      Array.isArray(norm.testcases) && norm.testcases.length
        ? norm.testcases.map((t) => ({
            input: nonEmptyString(t?.input, "1"),
            output: nonEmptyString(t?.output, "1"),
          }))
        : [{ input: "1", output: "1" }],

    examples: {
      JAVASCRIPT: ensureExample(ex.JAVASCRIPT),
      PYTHON:     ensureExample(ex.PYTHON),
      JAVA:       ensureExample(ex.JAVA),
      ...(ex.CPP ? { CPP: ensureExample(ex.CPP) } : {}),
    },

    codeSnippets: {
      JAVASCRIPT: nonEmptyString(code.JAVASCRIPT, "// js starter"),
      PYTHON:     nonEmptyString(code.PYTHON, "# py starter"),
      JAVA:       nonEmptyString(code.JAVA, "// java starter"),
      ...(code.CPP ? { CPP: code.CPP } : {}),
    },

    referenceSolutions: {
      JAVASCRIPT: nonEmptyString(ref.JAVASCRIPT, "// js ref"),
      PYTHON:     nonEmptyString(ref.PYTHON, "# py ref"),
      JAVA:       nonEmptyString(ref.JAVA, "// java ref"),
      ...(ref.CPP ? { CPP: ref.CPP } : {}),
    },

    judge: {
      timeLimitMs: norm.judge?.timeLimitMs ?? 2000,
      memoryLimitMb: norm.judge?.memoryLimitMb ?? 256,
    },

    source: { kind: "INLINE", sourceProblemId: p?.id },
  };
}

export default function AdminAttachProblemsDialog({ contestId }) {
  const { authUser } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";

  const { problems, isProblemsLoading, getAllProblems, getProblemById } = useProblemStore();
  const { attachInlineProblems, fetchBundle, isLoading } = useBundleStore();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [pointsDefault, setPointsDefault] = useState(100);

  useEffect(() => {
    if (open && (!problems || problems.length === 0)) {
      getAllProblems();
    }
  }, [open]); // eslint-disable-line

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return problems || [];
    return (problems || []).filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase?.().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [problems, query]);

  const alreadySelected = new Set(selected.map((s) => s.id));

//   const addProblem = async (p) => {
//   if (alreadySelected.has(p.id)) return;

//   try {
//     // Fetch full problem details
//     const result = await getProblemById(p.id); 
//     const fullProblem = result.problem;

//     if (!fullProblem) {
//       toast.error("Failed to fetch problem details.");
//       return;
//     }

//     setSelected((prev) => [
//       ...prev,
//       { id: fullProblem.id, title: fullProblem.title, points: pointsDefault, order: prev.length, fullProblem },
//     ]);
//   } catch (error) {
//     console.error("Error fetching problem details:", error);
//     toast.error("Error fetching problem details.");
//   }
// };
  const addProblem = async (p) => {
    if (alreadySelected.has(p.id)) return;

    try {
// -     const result = await getProblemById(p.id); 
// -     const fullProblem = result.problem;
     const fullProblem = await getProblemById(p.id); // <-- now we get the real object

      if (!fullProblem) {
        toast.error("Failed to fetch problem details.");
        return;
      }

      setSelected((prev) => [
        ...prev,
        { id: fullProblem.id, title: fullProblem.title, points: pointsDefault, order: prev.length, fullProblem },
      ]);
    } catch (error) {
      console.error("Error fetching problem details:", error);
      toast.error("Error fetching problem details.");
    }
  };


  const removeProblem = (id) => {
    setSelected((prev) =>
      prev
        .filter((x) => x.id !== id)
        .map((x, i) => ({ ...x, order: i }))
    );
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

  if (selected.length === 0) {
    toast.error("⚠️ Select at least one problem to attach.");
    return;
  }

  const payload = selected.map((s) => ({
    points: s.points,
    order: s.order,
    inline: toInlineSnapshot(s.fullProblem), // use the fetched full problem
  }));

  const loadingToast = toast.loading("Attaching problems to contest…");

  try {
    const ok = await attachInlineProblems({ contestId, problems: payload });

    if (ok) {
      toast.dismiss(loadingToast);
      toast.success(`✅ ${selected.length} problem${selected.length > 1 ? "s" : ""} successfully attached.`);

      await fetchBundle?.({ contestId, userId: authUser.id });

      setOpen(false);
      setSelected([]);
      setQuery("");
    } else {
      toast.dismiss(loadingToast);
      toast.error("❌ Failed to attach problems. Please check the problem data or try again.");
    }
  } catch (error) {
    console.error("Error attaching problems:", error);
    toast.dismiss(loadingToast);
    toast.error("🚨 Unexpected error while attaching problems.");
  }
};


  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-semibold inline-flex items-center gap-2 rounded-full text-white hover:text-blue-400 p-2 border border-white hover:border-blue-400 cursor-pointer transition-colors"
      >
        <Plus className="w-5 h-5" />
        Attach Problems
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-5xl mx-4 rounded-xl bg-[#111315] border border-gray-800 p-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-white font-semibold">Attach Problems to Contest</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Left: Search + available problems */}
              <div className="lg:col-span-3 space-y-3">
                <div className="flex items-center gap-2 bg-black/40 border border-gray-700 rounded px-2 py-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    placeholder="Search by title / slug / tag…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent text-gray-200 outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-400">Default Points</label>
                  <input
                    type="number"
                    min={1}
                    value={pointsDefault}
                    onChange={(e) => setPointsDefault(Math.max(1, Number(e.target.value) || 1))}
                    className="w-24 bg-black/40 border border-gray-700 rounded px-2 py-1 text-gray-200"
                  />
                </div>

                <div className="h-[360px] overflow-auto rounded border border-gray-800">
                  {isProblemsLoading ? (
                    <div className="p-4 text-gray-400">Loading problems…</div>
                  ) : filtered.length === 0 ? (
                    <div className="p-4 text-gray-400">No problems found.</div>
                  ) : (
                    <ul className="divide-y divide-gray-800">
                      {filtered.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-3 p-3 hover:bg-white/5">
                          <div className="min-w-0">
                            <div className="text-sm text-white truncate">{p.title}</div>
                            <div className="text-[11px] text-gray-400 truncate">
                              {p.difficulty} • {p.slug || "no-slug"} • {p.tags?.join(", ")}
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={alreadySelected.has(p.id)}
                            onClick={() => addProblem(p)}
                            className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
                          >
                            {alreadySelected.has(p.id) ? "Added" : (
                              <div>
                                {isLoading ? "Adding..." : "Add"}
                              </div>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Right: Selected problems & ordering */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-sm">Selected ({selected.length})</div>
                  <button type="button" onClick={() => setSelected([])} className="text-xs text-gray-400 hover:text-white">
                    Clear
                  </button>
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
                              <div className="text-sm text-white truncate">
                                {String.fromCharCode(65 + idx)}. {s.title}
                              </div>
                              <div className="text-[11px] text-gray-500">Order: {s.order}</div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button type="button" onClick={() => move(idx, -1)} className="p-1 rounded bg-white/5 hover:bg-white/10" title="Move Up">
                                <ChevronUp className="w-4 h-4 text-gray-300" />
                              </button>
                              <button type="button" onClick={() => move(idx, 1)} className="p-1 rounded bg-white/5 hover:bg-white/10" title="Move Down">
                                <ChevronDown className="w-4 h-4 text-gray-300" />
                              </button>
                              <button type="button" onClick={() => removeProblem(s.id)} className="p-1 rounded bg-white/5 hover:bg-red-500/20" title="Remove">
                                <Trash2 className="w-4 h-4 text-red-300" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <label className="text-[11px] text-gray-400">Points</label>
                            <input
                              type="number"
                              min={1}
                              value={s.points}
                              onChange={(e) => setPoints(s.id, e.target.value)}
                              className="w-24 bg-black/40 border border-gray-700 rounded px-2 py-1 text-gray-200"
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || selected.length === 0}
                    className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60"
                  >
                    {isLoading ? "Attaching…" : `Attach ${selected.length} Problem(s)`}
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
