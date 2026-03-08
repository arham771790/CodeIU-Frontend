const DIRECT_ALB_URL = process.env.NEXT_PUBLIC_DIRECT_ALB_URL || "https://api.codeiu.in";
const isLocal = !process.env.NEXT_PUBLIC_DIRECT_ALB_URL || process.env.NEXT_PUBLIC_DIRECT_ALB_URL.includes("localhost");

// Helper to get Base URL
const getBaseUrl = () => {
  return isLocal ? "http://localhost:8000/problem/api/v1" : `${DIRECT_ALB_URL}/problem/api/v1`;
};

// 1. Fetch ALL Problems (Fully Cached, No Cookies)
export async function getProblems(searchQuery = '', difficulty = '') {
  try {
    const BASE_URL = getBaseUrl();

    const res = await fetch(`${BASE_URL}/problem/getAllProblem`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600, tags: ['problems-list'] }
    });

    if (!res.ok) return [];
    
    const data = await res.json();
    let problems = data.problems || [];

    // Simple Server-Side Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      problems = problems.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.slug?.toLowerCase().includes(q) ||
        String(p.problemNo).includes(q)
      );
    }
    if (difficulty) problems = problems.filter(p => p.difficulty === difficulty.toUpperCase());

    // Sort by problemNo ascending
    problems.sort((a, b) => (a.problemNo || 0) - (b.problemNo || 0));

    return problems;
  } catch (error) {
    console.error("Server Fetch Error:~", error.message);
    return [];
  }
}

// 2. Fetch SINGLE Problem
export async function getProblemById(id) {
  try {
    const BASE_URL = getBaseUrl();

    // Note: If single problems are public, you shouldn't need cookies here either
    const res = await fetch(`${BASE_URL}/problem/getProblem/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600, tags: [`problem-${id}`] }
    });

    if (!res.ok) {
      console.error(`Backend Error ${res.status}: ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    return data.problem || null;

  } catch (error) {
    console.error("Server Fetch Error (Single Problem):", error.message);
    return null;
  }
}

// 3. Fetch ALL Playlists (For SEO/Sitemap)
export async function getPlaylists() {
  try {
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/playlist`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600, tags: ['playlists-list'] }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.playlists || [];
  } catch (error) {
    console.error("Server Fetch Error (Playlists):", error.message);
    return [];
  }
}