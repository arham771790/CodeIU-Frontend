"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useContestStore } from "@/app/store/useContestStore";

export default function CreateContestDialog({setOpen}) {
  const { authUser } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";
  const { createContest, isLoading } = useContestStore();

  const [form, setForm] = useState({
    slug: "",
    title: "",
    descriptionMd: "",
    startsAt: "",
    endsAt: "",
  });

  // if (!isAdmin) return null; // hide for non-admins

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.slug || !form.title || !form.startsAt || !form.endsAt) return;

    const startsISO = new Date(form.startsAt).toISOString();
    const endsISO = new Date(form.endsAt).toISOString();
    if (new Date(endsISO) <= new Date(startsISO)) {
      alert("endsAt must be after startsAt");
      return;
    }

    const ok = await createContest({
      slug: form.slug.trim(),
      title: form.title.trim(),
      descriptionMd: form.descriptionMd?.trim() || null,
      startsAt: startsISO,
      endsAt: endsISO,
      createdByUserId: authUser?.id, // required by your API
    });
    if (ok) {
      setOpen(false);
      setForm({ slug: "", title: "", descriptionMd: "", startsAt: "", endsAt: "" });
    }
  };

  return (
    <>
   
 (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg mx-4 rounded-xl bg-[#121212] border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Create Contest</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Slug</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={onChange}
                  placeholder="weekly-contest-471"
                  className="w-full bg-black/40 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Weekly Contest 471"
                  className="w-full bg-black/40 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Description (Markdown)</label>
                <textarea
                  name="descriptionMd"
                  value={form.descriptionMd}
                  onChange={onChange}
                  rows={3}
                  className="w-full bg-black/40 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
                  placeholder="Short description…"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Starts At</label>
                  <input
                    type="datetime-local"
                    name="startsAt"
                    value={form.startsAt}
                    onChange={onChange}
                    className="w-full bg-black/40 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Ends At</label>
                  <input
                    type="datetime-local"
                    name="endsAt"
                    value={form.endsAt}
                    onChange={onChange}
                    className="w-full bg-black/40 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  {isLoading ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    </>
  );
}
