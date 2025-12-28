"use server";

import { getProblems , getProblemById } from "@/lib/services/problemService";

// 1. Fetch All Problems (For the list)
export async function fetchAllProblemsAction() {
  // We re-use your existing logic!
  return await getProblems();
}

// 2. Fetch Single Problem (For details when adding)
export async function fetchProblemDetailsAction(id) {
  return await getProblemById(id);
}