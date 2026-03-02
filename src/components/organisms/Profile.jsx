// src/components/smallcomponents/Profile.jsx
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, LogOut, User, Settings, UserStar } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { authUser, logout, isLoggingOut } = useAuthStore();
  const navigate = useRouter();

  const handleLogout = async () => {
    await logout();
    navigate.push("/");
  }

  const LogoutButton = () => {
    return (
      <button
        /* SENIOR FIX: Removed bg-black. Used btn-error with ghost style for transparency */
        className="btn btn-ghost btn-sm w-full hover:bg-error hover:text-error-content transition-all duration-300 mt-2 hover:rounded-lg"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </div>
        )}
      </button>
    );
  };

  return (
    /* SENIOR FIX: Changed bg-black to bg-transparent */
    <div className="bg-transparent text-base-content p-2 w-full">
      <div className="flex flex-col">
        <ul className="menu menu-sm p-0">
          <li>
            <Link href="/profile" className="flex items-center gap-3 p-2 hover:bg-base-content/10 rounded-lg">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </li>
          <li>
            <div className="flex items-center gap-3 p-2 hover:bg-base-content/10 rounded-lg cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </div>
          </li>
          {authUser?.role === "ADMIN" && (
            <li>
              <Link href="/admin" className="flex items-center gap-3 p-2 hover:bg-base-content/10 rounded-lg">
                <UserStar className="h-4 w-4 text-success" />
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="border-t border-base-content/10 my-1"></div>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Profile;