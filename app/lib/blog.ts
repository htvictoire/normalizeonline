import type { Locale } from "@/i18n/config";

export const blogCategories = [
  "Workflow Design",
  "Operations",
  "Data Quality",
] as const;

export const blogTags = [
  "CSV",
  "Schema inference",
  "Data quality",
  "Validation",
  "Exports",
  "Quality control",
  "Null handling",
  "Analytics",
  "Pipelines",
] as const;

export type BlogCategory = (typeof blogCategories)[number];
export type BlogTag = (typeof blogTags)[number];

export const POST_REGISTRY = [
  {
    id: "post-001",
    publishedAt: "2026-03-24",
    category: "Workflow Design" as BlogCategory,
    tags: ["CSV", "Schema inference", "Data quality"] as BlogTag[],
    ogImage: "https://normalizeonline.com/blog/post-001-og.png",
  },
  {
    id: "post-002",
    publishedAt: "2026-03-17",
    category: "Operations" as BlogCategory,
    tags: ["Validation", "Exports", "Quality control"] as BlogTag[],
    ogImage: "https://normalizeonline.com/blog/post-002-og.png",
  },
  {
    id: "post-003",
    publishedAt: "2026-03-09",
    category: "Data Quality" as BlogCategory,
    tags: ["Null handling", "Analytics", "Pipelines"] as BlogTag[],
    ogImage: "https://normalizeonline.com/blog/post-003-og.png",
  },
] as const;

export type PostId = (typeof POST_REGISTRY)[number]["id"];

export type BlogPost = {
  id: PostId;
  slug: string;
  title: string;
  description: string;
  readingTime: string;
  publishedAt: string;
  category: BlogCategory;
  tags: BlogTag[];
  ogImage: string;
};

type PostJson = {
  slug: string;
  title: string;
  description: string;
  readingTime: string;
  headings: string[];
  content: Record<string, Record<string, string>>;
};

async function loadPostJson(id: PostId, locale: Locale): Promise<PostJson> {
  const mod = await import(`@/i18n/messages/${locale}/posts/${id}.json`);
  return mod.default as PostJson;
}

export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const posts = await Promise.all(
    POST_REGISTRY.map(async (entry) => {
      const json = await loadPostJson(entry.id, locale);
      return {
        id: entry.id,
        slug: json.slug,
        title: json.title,
        description: json.description,
        readingTime: json.readingTime,
        publishedAt: entry.publishedAt,
        category: entry.category,
        tags: entry.tags,
        ogImage: entry.ogImage,
      } satisfies BlogPost;
    }),
  );
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function resolveSlugToId(
  slug: string,
  locale: Locale,
): Promise<PostId | null> {
  for (const entry of POST_REGISTRY) {
    const json = await loadPostJson(entry.id, locale);
    if (json.slug === slug) return entry.id;
  }
  return null;
}

export async function loadPost(
  id: PostId,
  locale: Locale,
): Promise<{
  post: BlogPost;
  tocItems: { id: string; title: string }[];
  t: (key: string) => string;
}> {
  const json = await loadPostJson(id, locale);
  const entry = POST_REGISTRY.find((e) => e.id === id)!;
  return {
    post: {
      id,
      slug: json.slug,
      title: json.title,
      description: json.description,
      readingTime: json.readingTime,
      publishedAt: entry.publishedAt,
      category: entry.category,
      tags: entry.tags,
      ogImage: entry.ogImage,
    },
    tocItems: json.headings.map((title, i) => ({ id: `s${i + 1}`, title })),
    t: (key: string) =>
      getNestedValue(json.content as Record<string, unknown>, key),
  };
}

export async function getRelatedPosts(
  id: PostId,
  locale: Locale,
  limit = 2,
): Promise<BlogPost[]> {
  const all = await getBlogPosts(locale);
  return all.filter((p) => p.id !== id).slice(0, limit);
}

export function getAllPostParams() {
  return POST_REGISTRY.map(({ id }) => id);
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const result = path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj,
    );
  return typeof result === "string" ? result : "";
}

export function tKey(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "_");
}

export function formatBlogDate(value: string, locale: Locale = "en"): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
