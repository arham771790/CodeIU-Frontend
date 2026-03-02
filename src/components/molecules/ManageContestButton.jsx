// src/app/components/contest/ManageContestsButton.jsx
"use client";
import { useRouter } from "next/navigation";

export default function ManageContestsButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/contest/manage")}
      className="font-semibold px-3 py-1.5 rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200 text-sm"
    >
      Manage Contests
    </button>
  );
}
