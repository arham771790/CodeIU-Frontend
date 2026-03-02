"use client";

import { useState } from "react";
import { X, Calendar, Type, Link2, Info, Save } from "lucide-react";
import { useContestStore } from "@/store/useContestStore";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-base-100/80 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Dialog Container */}
      <div className="relative w-full max-w-2xl bg-base-200 border border-base-content/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-base-content/5 flex items-center justify-between bg-base-300/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Type size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Edit Contest</h3>
              <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Update parameters</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-base-content/10 rounded-full transition-colors opacity-50 hover:opacity-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={submit} className="p-8 space-y-6">
          
          {/* Title & Slug Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                <Type size={12} /> Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="Enter contest title"
                className="w-full bg-base-300/50 border border-base-content/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                <Link2 size={12} /> Slug
              </label>
              <input
                name="slug"
                value={form.slug}
                onChange={onChange}
                placeholder="contest-slug-url"
                className="w-full bg-base-300/50 border border-base-content/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Status & Timing Row */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                <Info size={12} /> Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full bg-base-300/50 border border-base-content/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              >
                {statuses.map((s) => (
                  <option key={s} value={s} className="bg-base-200">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                <Calendar size={12} /> Starts At
              </label>
              <input
                type="datetime-local"
                name="startsAt"
                value={form.startsAt}
                onChange={onChange}
                className="w-full bg-base-300/50 border border-base-content/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                <Calendar size={12} /> Ends At
              </label>
              <input
                type="datetime-local"
                name="endsAt"
                value={form.endsAt}
                onChange={onChange}
                className="w-full bg-base-300/50 border border-base-content/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
              <Info size={12} /> Description (Markdown)
            </label>
            <textarea
              name="descriptionMd"
              value={form.descriptionMd}
              onChange={onChange}
              rows={5}
              placeholder="Tell users what this contest is about..."
              className="w-full bg-base-300/50 border border-base-content/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold opacity-50 hover:opacity-100 hover:bg-base-content/5 transition-all"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary text-primary-content font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Save size={18} />
                  Save Contest
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}