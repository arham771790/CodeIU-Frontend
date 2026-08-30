"use server";

import { cookies } from "next/headers";

import { PROBLEM_API_URL } from "@/lib/urls";

function getProblemServiceBaseUrl() {
  return PROBLEM_API_URL;
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

export async function fetchProblemDetailsAction(slugOrId) {
  const payload = await fetchWithSession(`/problem/getProblem/${slugOrId}`);
  return payload.problem || null;
}
