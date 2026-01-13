import { cookies } from "next/headers";

const DIRECT_ALB_URL = "http://codeiu-314732537.ap-south-1.elb.amazonaws.com";

const getBaseUrl = () => {
  return `${DIRECT_ALB_URL}/contest/api/v1/contest`;
};

export async function getLeaderboardService(contestId, limit = 100) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // Cache Strategy: 
    // We use 'no-store' because leaderboards change constantly.
    // If your traffic is huge, you can change this to: next: { revalidate: 5 }
    const res = await fetch(`${getBaseUrl()}/contest/contests/${contestId}/leaderboard?limit=${limit}`, {
      cache: 'no-store', 
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader
      }
    });

    if (!res.ok) return { ok: false, rows: [] };

    const data = await res.json();
    return { 
      ok: true, 
      rows: data.rows || [],
      updatedAt: data.updatedAt || Date.now(),
      source: data.source || null
    };

  } catch (error) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error("Leaderboard Fetch Error:", error);
    return { ok: false, rows: [] };
  }
}