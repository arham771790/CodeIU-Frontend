// lib/services/problemService.js
import { cookies } from "next/headers"; // <--- 1. Import this

export async function getProblems(searchQuery = '', difficulty = '') {
  
  // Define Base URL
  const BASE_URL = process.env.NEXT_PUBLIC_MODE === "development"
    ? process.env.NEXT_PROBLEMSERVICE_URL 
    : "/api/v1"; 

  const finalUrl = `${BASE_URL}/problem/getAllProblem`;

  try {
    // 2. Get the cookies from the current user
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString(); // Formats them as "token=abc; session=xyz"

    const res = await fetch(finalUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader // <--- 3. PASS THE COOKIES HERE!
      },
      next: { 
        revalidate: 3600, 
        tags: ['problems-list'] 
      }
    });

    if (!res.ok) {
      // If still error, log it but don't crash the page
      console.error(`Backend Error ${res.status}: ${res.statusText}`);
      return []; 
    }
    
    const data = await res.json();
    let problems = data.problems || [];

    // Filter Logic
    if (searchQuery) {
      problems = problems.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (difficulty) {
      problems = problems.filter(p => 
        p.difficulty === difficulty.toUpperCase()
      );
    }

    return problems;

  } catch (error) {
    console.error("Server Fetch Error:", error.message);
    return []; 
  }
}