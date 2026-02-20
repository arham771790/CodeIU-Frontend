import { cookies } from "next/headers";

const DIRECT_ALB_URL = process.env.NEXT_PUBLIC_DIRECT_ALB_URL || "https://api.codeiu.in";

// Helper to get Base URL
const getBaseUrl = () => {
  return `${DIRECT_ALB_URL}/submission/api/v1`;
};

export async function getSubmissionForProblem(problemId) {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();
        const BASE_URL = getBaseUrl();

        const res = await fetch(`${BASE_URL}/submission/get-Submissions-For-Problem/${problemId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Cookie": cookieHeader },
            next: { revalidate: 3600, tags: [`problem-${problemId}`] }
        });

        const data = await res.json();
        return data.submission || [];
    } catch (error) {
        
    }
}