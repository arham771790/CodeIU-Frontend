"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { CreateProblemForm } from "@/app/components/CreateProblemForm";
import { useAuthStore } from "@/app/store/useAuthStore";

const AddProblem = () => {
  const router = useRouter();
  const { authUser, isCheckingAuth } = useAuthStore();

  if (authUser && authUser.role !== "ADMIN") {
 // Redirect if not an admin
    return (
      <div className="flex items-center justify-center h-screen  font-bold text-4xl ">
        <p>404 Page Not Found 😔</p>
      </div>
    );
  }
  return (
    <div>
      <CreateProblemForm />
    </div>
  );
};

export default AddProblem;
