"use client";

import { CreateProblemForm } from "@/app/components/CreateProblemForm";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const AddProblem = () => {
  const router = useRouter();
//   const { authUser, isCheckingAuth } = useAuthStore();

//   if (authUser && authUser.role !== "ADMIN") {
//  // Redirect if not an admin
//     return (
//       <div className="flex items-center justify-center h-screen  font-bold text-4xl ">
//         <p>404 Page Not Found 😔</p>
//       </div>
//     );
//   }
 // ✅ works for /EditProblem/prob_

  return (

    <div>
      <CreateProblemForm   />
    </div>
  );
};

export default AddProblem;
