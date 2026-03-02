// src/app/components/Header.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import NavLinks from "@/components/molecules/NavLinks";
import UserActions from "@/components/molecules/UserActions";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pages = [
    { name: "Explore", link: "/explore" },
    { name: "Problems", link: "/problems" },
    { name: "Contest", link: "/contest" },
  ];

  return (
    <header className="backdrop-blur-md shadow-lg p-2 flex flex-col justify-center sticky top-0 z-50 border-b border-white/10 bg-base-300/80">
      <div className="flex justify-between w-full px-2 items-center">
        {/* Logo */}
        <div>
          <Link href="/" className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-blue-400 ml-3">
              🌊ode<span className="font-bold text-base-content">IU</span>
            </h1>
          </Link>
        </div>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:block">
          <NavLinks pages={pages} />
        </nav>

        {/* Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <UserActions />

          {/* Hamburger Icon - Only visible on mobile **/}
          <button
            className="md:hidden p-2 text-base-content hover:bg-base-content/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <nav className="md:hidden w-full pt-6 pb-4 border-t border-white/5 mt-3">
          <NavLinks
            pages={pages}
            isMobile={true}
            closeMenu={() => setIsMobileMenuOpen(false)}
          />
        </nav>
      )}
    </header>
  );
}