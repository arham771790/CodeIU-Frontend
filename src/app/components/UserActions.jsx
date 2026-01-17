// src/components/UserActions.jsx
"use client";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import ThemeController from "./ThemeController";
import Profile from "./smallcomponents/Profile";
import Image from "next/image";
import { Flame , User2} from "lucide-react";
import Link from "next/link";

export default function UserActions() {
  const { authUser, logout, isLoggingOut } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  return (
    <div className="flex items-center gap-4">
      <ThemeController />
      {authUser ? (
        <div className="flex items-center gap-4">
          <Flame className="text-orange-500" />
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="cursor-pointer relative">
            <User2
              width={30} 
              height={30} 
              className="rounded-full border-2 border-primary/20 hover:border-primary transition-colors" 
            />
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-30 rounded-xl shadow-2xl z-50 
                              bg-base-200/40 backdrop-blur-md border border-white/10 
                              overflow-hidden animate-in fade-in zoom-in duration-200">
                <Profile />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Link href="/login" className="btn btn-primary btn-sm rounded-full px-6">
          Sign In
        </Link>
      )}
    </div>
  );
}