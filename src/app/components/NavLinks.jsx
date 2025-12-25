// src/components/NavLinks.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ pages }) {
  const pathname = usePathname();
  return (
    <ul className="flex justify-center items-center gap-2 space-x-6 text-md font-mono cursor-pointer">
      {pages.map((page) => (
        <li key={page.link}>
          <Link
            href={page.link}
            className={`${
              pathname === page.link ? "text-primary" : "text-base-content"
            } hover:text-primary transition-colors relative group`}
          >
            {page.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}