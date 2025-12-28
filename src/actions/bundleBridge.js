"use server";

import { attachInlineProblemsService , fetchBundleService , getContestProblemService } from "@/lib/services/bundleService";
export async function attachProblemsAction(contestId, problems) {
  return await attachInlineProblemsService(contestId, problems);
}

export async function fetchBundleAction(contestId, userId) {
  return await fetchBundleService(contestId, userId);
}

export async function getContestProblemAction(contestId, problemId, userId) {
  return await getContestProblemService(contestId, problemId, userId);
}