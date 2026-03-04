// src/app/components/contest/ManageContestsButton.jsx
"use client";
import { useRouter } from "next/navigation";

export default function ManageContestsButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/contest/manage")}
      className="btn btn-sm btn-outline rounded-full border-base-content/20 text-base-content hover:bg-base-content hover:text-base-100"
    >
      Manage Contests
    </button>
  );
}
