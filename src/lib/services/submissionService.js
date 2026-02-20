import { cookies } from "next/headers";

// Helper to get Base URL
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_MODE === "development"
    ? process.env.NEXT_PUBLIC_SUBMISSIONSERVICE_URL
    : "/api/v1";
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