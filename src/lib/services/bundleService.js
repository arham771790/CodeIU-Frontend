// lib/services/bundleService.js
import { cookies } from "next/headers";

const DIRECT_ALB_URL = "http://codeiu-314732537.ap-south-1.elb.amazonaws.com";

const getBaseUrl = () => {
  return `${DIRECT_ALB_URL}/contest/api/v1`;
};

// Helper to get headers with cookies
const getHeaders = async () => {
  const cookieStore = await cookies();
  return {
    "Content-Type": "application/json",
    "Cookie": cookieStore.toString()
  };
};

// 1. Attach Problems (Admin)
export async function attachInlineProblemsService(contestId, problems) {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${getBaseUrl()}/contest/contests/${contestId}/bundle/attach-inline`, {
      method: "POST",
      headers,
      body: JSON.stringify({ problems }),
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { ok: false, error: errorData.error || "Failed to attach" };
    }
    
    return { ok: true };
  } catch (error) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error("Service Error (Attach):", error);
    return { ok: false, error: "Network error" };
  }
}

// 2. Fetch Bundle (Participant/Admin)
export async function fetchBundleService(contestId, userId) {
  try {
    const headers = await getHeaders();
    // We encode the userId to be safe
    const res = await fetch(`${getBaseUrl()}/contest/contests/${contestId}/bundle?userId=${encodeURIComponent(userId)}`, {
      method: "GET",
      headers,
      cache: 'no-store' // Bundles change (e.g. registration status), so don't cache too aggressively
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { ok: false, error: errorData.error || "Failed to fetch bundle" };
    }

    const data = await res.json();
    return { ok: true, data: data.data };
  } catch (error) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error("Service Error (Fetch Bundle):", error);
    return { ok: false, error: "Network error" };
  }
}

// 3. Fetch Single Problem (Participant)
export async function getContestProblemService(contestId, problemId, userId) {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${getBaseUrl()}/contest/contests/${contestId}/problems/${problemId}?userId=${encodeURIComponent(userId)}`, {
      method: "GET",
      headers,
      cache: 'no-store'
    });

    if (!res.ok) return { ok: false };
    
    const data = await res.json();
    return { ok: true, data: data.data };
  } catch (error) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    return { ok: false };
  }
}