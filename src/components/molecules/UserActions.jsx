// src/components/UserActions.jsx
"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import ThemeController from "@/components/atoms/ThemeController";
import Profile from "@/components/organisms/Profile";
import { Flame, User2 } from "lucide-react";
import Link from "next/link";
export default function UserActions() {
  const { authUser, logout, isLoggingOut, isCheckingAuth } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <ThemeController />
      {isCheckingAuth ? (
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" />
        </div>
      ) : authUser ? (
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