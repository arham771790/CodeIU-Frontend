import { PROBLEM_API_URL } from "@/lib/urls";

const DEFAULT_REVALIDATE_SECONDS = 60;

const getBaseUrl = () => PROBLEM_API_URL;

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function normalizeError(response, payload, fallbackMessage) {
  const backendError = payload?.error;
  return {
    status: response.status,
    code: backendError?.code || "SRV_001",
    message: backendError?.message || fallbackMessage,
  };
}

function applyProblemFilters(problems, searchQuery = "", difficulty = "") {
  let filteredProblems = Array.isArray(problems) ? [...problems] : [];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProblems = filteredProblems.filter(
      (problem) =>
        problem.title?.toLowerCase().includes(query) ||
        problem.slug?.toLowerCase().includes(query) ||
        String(problem.problemNo).includes(query),
    );
  }

  if (difficulty) {
    filteredProblems = filteredProblems.filter(
      (problem) => problem.difficulty === difficulty.toUpperCase(),
    );
  }

  filteredProblems.sort((left, right) => (left.problemNo || 0) - (right.problemNo || 0));
  return filteredProblems;
}

async function fetchProblemsResource(searchQuery = "", difficulty = "") {
  try {
    const response = await fetch(`${getBaseUrl()}/problem/getAllProblem`, {
      headers: { "Content-Type": "application/json" },
      next: {
        revalidate: DEFAULT_REVALIDATE_SECONDS,
        tags: ["problems-list"],
      },
    });

    const payload = await safeJson(response);

    if (!response.ok) {
      return {
        problems: [],
        meta: payload?.meta || null,
        error: normalizeError(
          response,
          payload,
          "Problem catalog is temporarily unavailable",
        ),
      };
    }

    return {
      problems: applyProblemFilters(payload?.problems || [], searchQuery, difficulty),
      meta: payload?.meta || null,
      error: null,
    };
  } catch (error) {
    console.error("Server Fetch Error (Problems):", error.message);
    return {
      problems: [],
      meta: null,
      error: {
        status: 0,
        code: "SRV_001",
        message: "Problem catalog is temporarily unavailable",
      },
    };
  }
}

async function fetchProblemResource(slug) {
  try {
    const response = await fetch(`${getBaseUrl()}/problem/getProblem/${slug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: {
        revalidate: DEFAULT_REVALIDATE_SECONDS,
        tags: [`problem-${slug}`],
      },
    });

    const payload = await safeJson(response);

    if (!response.ok) {
      return {
        problem: null,
        meta: payload?.meta || null,
        error: normalizeError(
          response,
          payload,
          response.status === 404
            ? "Problem not found"
            : "Problem detail is temporarily unavailable",
        ),
      };
    }

    return {
      problem: payload?.problem || null,
      meta: payload?.meta || null,
      error: null,
    };
  } catch (error) {
    console.error("Server Fetch Error (Single Problem):", error.message);
    return {
      problem: null,
      meta: null,
      error: {
        status: 0,
        code: "SRV_001",
        message: "Problem detail is temporarily unavailable",
      },
    };
  }
}

export async function getProblems(searchQuery = "", difficulty = "") {
  const { problems } = await fetchProblemsResource(searchQuery, difficulty);
  return problems;
}

export async function getProblemsPageData(searchQuery = "", difficulty = "") {
  return fetchProblemsResource(searchQuery, difficulty);
}

export async function getProblemById(slug) {
  const { problem } = await fetchProblemResource(slug);
  return problem;
}

export async function getProblemPageData(slug) {
  return fetchProblemResource(slug);
}

export async function getPlaylists() {
  try {
    const response = await fetch(`${getBaseUrl()}/playlist`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: {
        revalidate: DEFAULT_REVALIDATE_SECONDS,
        tags: ["playlists-list"],
      },
    });

    if (!response.ok) return [];

    const payload = await response.json();
    return payload.playlists || [];
  } catch (error) {
    console.error("Server Fetch Error (Playlists):", error.message);
    return [];
  }
}
