import { getProblems } from "@/lib/services/problemService";

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
    { url: "/leaderboard", changeFrequency: "daily", priority: 0.8 },
  ].map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 2. Dynamic Problem Routes
  let problemRoutes = [];
  try {
    // getProblems uses next: { revalidate: 3600 } internally
    const problems = await getProblems();
    problemRoutes = problems.map((problem) => ({
      url: `${BASE_URL}/Each-problem/${problem._id}`,
      lastModified: new Date(problem.updatedAt || new Date()),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap dynamic fetch error (Problems):", error);
  }

  // 3. Future Modules (Placeholders)
  // To extend: fetch data from respective services and map to SitemapEntry
  const contestRoutes = []; // TODO: fetchContests()
  const userRoutes = [];    // TODO: fetchActiveUsers()
  const blogRoutes = [];    // TODO: fetchBlogs()

  return [
    ...staticRoutes,
    ...problemRoutes,
    ...contestRoutes,
    ...userRoutes,
    ...blogRoutes,
  ];
}

// SEO Tip: If the sitemap exceeds 50k URLs, use multiple sitemaps via generateSitemaps
// https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
