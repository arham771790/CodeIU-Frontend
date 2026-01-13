// lib/services/problemService.js
import { cookies } from "next/headers";

// Helper to get Base URL
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_MODE === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL + "/problem"
    : "/api/v1";
};

// 1. Fetch ALL Problems (for the list/dropdown)
export async function getProblems(searchQuery = '', difficulty = '') {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const BASE_URL = getBaseUrl();

    const res = await fetch(`${BASE_URL}/problem/getAllProblem`, {
      headers: { "Content-Type": "application/json", "Cookie": cookieHeader },
      next: { revalidate: 3600, tags: ['problems-list'] }
    });

    if (!res.ok) return [];
    
    const data = await res.json();
    let problems = data.problems || [];

    // Simple Server-Side Filter
    if (searchQuery) problems = problems.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (difficulty) problems = problems.filter(p => p.difficulty === difficulty.toUpperCase());

    return problems;
  } catch (error) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error("Server Fetch Error:", error.message);
    return [];
  }
}

// 2. Fetch SINGLE Problem (BFF Pattern)
export async function getProblemById(id) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const BASE_URL = getBaseUrl();

    const res = await fetch(`${BASE_URL}/problem/getProblem/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Cookie": cookieHeader },
      next: { revalidate: 3600, tags: [`problem-${id}`] }
    });

    if (!res.ok) {
      console.error(`Backend Error ${res.status}: ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    return data.problem || null;

  } catch (error) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error("Server Fetch Error (Single Problem):", error.message);
    return null;
  }
}