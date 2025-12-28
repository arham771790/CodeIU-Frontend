import { cookies } from "next/headers";

const getBaseUrl = () => process.env.NEXT_CONTESTSERVICE_URL;

export async function getContests() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    // Server-side fetch with cookies (so Admin sees hidden contests too)
    const res = await fetch(`${getBaseUrl()}/contest/contests`, {
      cache: 'no-store', // Admin needs fresh data always
      headers: { 
        "Content-Type": "application/json",
        "Cookie": cookieHeader
      }
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.contests || [];
  } catch (error) {
    console.error("Server Fetch Error:", error);
    return [];
  }
}

export async function getContestById(id) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // Cache: Revalidate every 60s. 
    // We don't need real-time data here because the Socket handles updates!
    const res = await fetch(`${getBaseUrl()}/contest/contests/${id}`, {
      next: { revalidate: 60, tags: [`contest-${id}`] }, 
      headers: { 
        "Content-Type": "application/json",
        "Cookie": cookieHeader 
      }
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.contest || null;
  } catch (error) {
    console.error(`Fetch Contest ${id} Error:`, error);
    return null;
  }
}