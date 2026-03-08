import { getProblems, getPlaylists } from "@/lib/services/problemService";
import { getContests } from "@/lib/services/contestService";

/**
 * @typedef {Object} SitemapEntry
 * @property {string} url
 * @property {Date} lastModified
 * @property {string} changeFrequency
 * @property {number} priority
 */

const BASE_URL = "https://codeiu.in";

export default async function sitemap() {
  // 1. Static Core Routes
  const staticRoutes = [
    { url: "", changeFrequency: "daily", priority: 1 },
    { url: "/problems", changeFrequency: "daily", priority: 0.9 },
    { url: "/explore", changeFrequency: "weekly", priority: 0.8 },
  ].map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 2. Dynamic Problem Routes
  let problemRoutes = [];
  try {
    const problems = await getProblems();
    problemRoutes = problems.map((problem) => ({
      url: `${BASE_URL}/problems/${problem.slug || problem.id}`,
      lastModified: new Date(problem.updatedAt || new Date()),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap error (Problems):", error);
  }

  // 3. Dynamic Contest Routes
  let contestRoutes = [];
  try {
    const contests = await getContests();
    contestRoutes = contests.map((contest) => ({
      url: `${BASE_URL}/contest/${contest.slug || contest.id}`,
      lastModified: new Date(contest.updatedAt || new Date()),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap error (Contests):", error);
  }

  // 4. Dynamic Playlist Routes
  let playlistRoutes = [];
  try {
    const playlists = await getPlaylists();
    playlistRoutes = playlists.map((playlist) => ({
      url: `${BASE_URL}/explore/${playlist.slug || playlist.id}`,
      lastModified: new Date(playlist.updatedAt || new Date()),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap error (Playlists):", error);
  }

  return [
    ...staticRoutes,
    ...problemRoutes,
    ...contestRoutes,
    ...playlistRoutes,
  ];
}

// SEO Tip: If the sitemap exceeds 50k URLs, use multiple sitemaps via generateSitemaps
// https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
