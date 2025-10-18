import { useAuthStore } from "@/app/store/useAuthStore";
import { Loader2, LogOut, User, Settings , UserStar } from "lucide-react";
import React from "react";
import Link from "next/link";

const Profile = () => {
  const { isLoggingIn, authUser, logout, isLoggingOut } = useAuthStore();

  const Logout = () => {
    return (
      <>
        <button
          className="p-1 mb-1 cursor-pointer hover:text-white  hover:bg-red-800  rounded-lg bg-black text-white transition-all ease-in-out duration-300 relative group"
          onClick={logout}
        >
          {isLoggingOut ? (
            <>
              {" "}
              <Loader2 className="h-5 w-5 animate-spin" />
            </>
          ) : (
            <div className="flex items-center justify-center font-medium gap-1 cursor-pointer ">
              <LogOut className="h-4 w-4 font-semibold ml-1" />
              Logout
            </div>
          )}
        </button>
      </>
    );
  };
  return (
    <div className="bg-black text-white">
      <div className="flex flex-col justify-center items-center ">
        <ul>
          <li className=" font-medium cursor-pointer mb-1 mt-1  border-b-white/10  hover:text-black hover:bg-white rounded-lg transition-colors gap-1">
            <Link href="/Profile" className="flex items-center justify-center font-medium gap-2 p-1">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </li>
          <li className="flex items-center justify-center font-medium cursor-pointer mb-1 mt-1 p-1 border-b-white/10  hover:text-black hover:bg-white rounded-lg transition-colors gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </li>
          {
            authUser?.role === "ADMIN" && (
              <li className=" font-medium cursor-pointer mb-1 mt-1  border-b-white/10  hover:text-black hover:bg-white rounded-lg transition-colors gap-1">
            <Link href="/Admin" className="flex items-center justify-center font-medium gap-2 p-1 ">
              <UserStar className="h-4 w-4 text-green-500"/>
              Admin
            </Link>
          </li>
            )
          }
        </ul>

        <Logout />
      </div>
    </div>
  );
};

export default Profile;
