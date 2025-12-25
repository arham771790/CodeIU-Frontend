// src/app/components/Header.jsx
import Link from "next/link";
import NavLinks from "./NavLinks";
import UserActions from "./UserActions";

export default function Header() {
  const pages = [
    { name: "Explore", link: "/Explore" },
    { name: "Problems", link: "/problems" },
    { name: "Contest", link: "/contest" },
    { name: "Devloper", link: "/Devloper" },
    
  ];

  return (
    <header className="backdrop-blur-md shadow-lg p-2 flex justify-between items-center sticky top-0 z-50 border-b border-white/10 bg-base-100/80">
      <div className="flex justify-between w-full px-2 items-center">
        {/* Logo (Static - Server Rendered) */}
        <div>
          <Link href="/" className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-blue-400 ml-3">
              🌊ode<span className="font-bold text-base-content">IU</span>
            </h1>
          </Link>
        </div>

        {/* Navigation (Client Island) */}
        <nav className="hidden md:block">
          <NavLinks pages={pages} />
        </nav>

        {/* Actions (Client Island) */}
        <UserActions />
      </div>
    </header>
  );
}