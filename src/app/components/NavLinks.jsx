// src/app/components/NavLinks.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export default function NavLinks({ pages, isMobile, closeMenu }) {
  const { authUser } = useAuthStore();
  const pathname = usePathname();

  return (
    <ul className={`flex ${isMobile ? "flex-col items-center gap-6 space-x-0 w-full" : "justify-center items-center gap-2 space-x-6"} text-md font-mono cursor-pointer`}>
      {pages.map((page) => (
        <li key={page.link} className={isMobile ? "w-full text-center" : ""}>
          <Link
            href={page.link}
            onClick={isMobile ? closeMenu : undefined} // Closes menu on mobile click
            className={`${
              pathname === page.link ? "text-primary" : "text-base-content"
            } hover:text-primary transition-colors relative group block`}
          >
            {page.name}
          </Link>
        </li>
      ))}
      
      <li
        className={`flex items-center justify-center gap-1 ${isMobile ? "w-full" : ""}`}
        title="Under Construction"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        Blogs
      </li>
      
      <li
        className={`flex items-center justify-center gap-1 ${isMobile ? "w-full" : ""}`}
        title="Under Construction"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        <Link 
          href="/Battle" 
          onClick={isMobile ? closeMenu : undefined} 
          className="block hover:text-primary transition-colors"
        >
          Battle Mode
        </Link>
      </li>
      
      <li className={isMobile ? "w-full flex justify-center" : ""}>
        <Link 
          className="flex items-center gap-3 p-2 hover:bg-base-content/10 rounded-lg transition-colors"
          href="/Developer"
          onClick={isMobile ? closeMenu : undefined}
        >
          Developers
        </Link>
      </li>
    </ul>
  );
}