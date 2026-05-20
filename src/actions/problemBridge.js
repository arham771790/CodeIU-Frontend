"use server";

import { cookies } from "next/headers";

const DIRECT_ALB_URL =
  process.env.NEXT_PUBLIC_DIRECT_ALB_URL || "https://api.codeiu.in";
const isLocal =
  !process.env.NEXT_PUBLIC_DIRECT_ALB_URL ||
  process.env.NEXT_PUBLIC_DIRECT_ALB_URL.includes("localhost");

function getProblemServiceBaseUrl() {
  return isLocal
    ? "http://localhost:8000/problem/api/v1"
    : `${DIRECT_ALB_URL}/problem/api/v1`;
}

async function fetchWithSession(pathname) {
  const cookieStore = await cookies();
  const response = await fetch(`${getProblemServiceBaseUrl()}${pathname}`, {
    headers: {
      "Content-Type": "application/json",
      cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Problem bridge request failed with ${response.status}`);
  }

  return response.json();
}

export async function fetchAllProblemsAction() {
  const payload = await fetchWithSession("/problem/getAllProblem");
  return payload.problems || [];
}

export async function fetchProblemDetailsAction(id) {
  const payload = await fetchWithSession(`/problem/getProblem/${id}`);
  return payload.problem || null;
}
