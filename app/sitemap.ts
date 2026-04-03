import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { buildUrl } from "@/i18n/seo";
import { getRouteHref, ROUTE_DEFS, isRouteIndexable } from "@/i18n/routes";
import { getBlogPosts } from "@/app/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsByLocale = await Promise.all(
    locales.map(async (locale) => ({ locale, posts: await getBlogPosts(locale) })),
  );

  const staticEntries: MetadataRoute.Sitemap = ROUTE_DEFS.filter(
    (route) => route.key !== "BLOG_POST" && isRouteIndexable(route.key),
  ).flatMap((route) =>
    locales.map((locale) => ({
      url: buildUrl(getRouteHref(route.key, locale)),
      lastModified: new Date(),
      changeFrequency: (
        route.key === "HOME" || route.key === "BLOG" ? "weekly" : "monthly"
      ) as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: route.key === "HOME" ? 1 : route.key === "BLOG" ? 0.8 : 0.4,
    })),
  );

  const postEntries: MetadataRoute.Sitemap = postsByLocale.flatMap(
    ({ locale, posts }) =>
      posts.map((post) => ({
        url: buildUrl(getRouteHref("BLOG_POST", locale, { slug: post.slug })),
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  );

  return [...staticEntries, ...postEntries];
}
