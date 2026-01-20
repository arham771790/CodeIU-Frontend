import { getProblems } from "@/lib/services/problemService";

export default async function sitemap() {
  const baseUrl = "https://codeiu.in";

  // Static routes
  const routes = ["", "/problems", "/Explore", "/Leaderboard"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes (Problems)
  try {
    const problems = await getProblems();
    const problemRoutes = problems.map((problem) => ({
      url: `${baseUrl}/Each-problem/${problem._id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...routes, ...problemRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
