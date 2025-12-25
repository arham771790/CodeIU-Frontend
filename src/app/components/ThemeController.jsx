"use client";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Palette, Check } from "lucide-react";
import { color } from "motion";

export default function ThemeController() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  // Added some cool DaisyUI themes for a developer platform
  const themes = [
    { name: "dark", color: "bg-[#1d232a]" },
    { name: "light", color: "bg-[#ffffff]" },
    { name: "nord", color: "bg-[#2e3440]" },
    { name: "forest", color: "bg-[#3b4b38]" },
    { name: "black" , color: "bg-[#000000]"},
    { name : "abyss" , color : "bg-[#1d1d1d]"},
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button - Just like your Profile icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle text-primary hover:bg-base-content/10 transition-all"
      >
        <Palette size={22} />
      </button>

      {/* Floating Dropdown - Matches your Profile box logic */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-35 bg-base-200 border border-base-300 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between p-2 border-b border-base-300">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
              Select Theme
            </span>
          </div>

          <ul className="menu menu-sm p-2">
            {themes.map((t) => (
              <li key={t.name}>
                <button
                  onClick={() => {
                    setTheme(t.name);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between py-2 px-3 hover:bg-base-300 rounded-lg mb-1 transition-colors ${
                    theme === t.name ? "bg-base-300 font-bold" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Small color preview circle */}
                    <div className={`w-4 h-4 rounded-full border border-base-content/20 ${t.color}`} />
                    <span className="capitalize">{t.name}</span>
                  </div>
                  {theme === t.name && <Check size={14} className="text-primary" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}