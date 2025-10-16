// src/app/components/contest/EditContestDialog.jsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useContestStore } from "@/app/store/useContestStore";

const statuses = ["DRAFT", "SCHEDULED", "RUNNING", "ENDED"];

export default function EditContestDialog({ contest, onClose }) {
  const { updateContest, isLoading } = useContestStore();

  const [form, setForm] = useState({
    title: contest.title || "",
    slug: contest.slug || "",
    status: contest.status || "SCHEDULED",
    startsAt: contest.startsAt
      ? new Date(contest.startsAt).toISOString().slice(0, 16)
      : "",
    endsAt: contest.endsAt
      ? new Date(contest.endsAt).toISOString().slice(0, 16)
      : "",
    descriptionMd: contest.descriptionMd ?? "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      status: form.status,
      descriptionMd: form.descriptionMd,
      startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined,
    };
    const ok = await updateContest(contest.id, payload);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 rounded-xl bg-[#121212] border border-gray-800 p-4">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-white font-semibold">Edit Contest</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                className="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Slug</label>
              <input
                name="slug"
                value={form.slug}
                onChange={onChange}
                className="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-gray-200"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-gray-200"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Starts At</label>
              <input
                type="datetime-local"
                name="startsAt"
                value={form.startsAt}
                onChange={onChange}
                className="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-gray-200"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Ends At</label>
              <input
                type="datetime-local"
                name="endsAt"
                value={form.endsAt}
                onChange={onChange}
                className="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Description (Markdown)</label>
            <textarea
              name="descriptionMd"
              value={form.descriptionMd}
              onChange={onChange}
              rows={4}
              className="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-gray-200"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60"
            >
              {isLoading ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
