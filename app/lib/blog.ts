import type { Locale } from "@/i18n/config";

export const blogCategories = [
  { key: "workflow_design", label: "Workflow Design" },
  { key: "operations",      label: "Operations" },
  { key: "data_quality",    label: "Data Quality" },
] as const;

export const blogTags = [
  { key: "csv",              label: "CSV" },
  { key: "schema_inference", label: "Schema Inference" },
  { key: "data_quality",     label: "Data Quality" },
  { key: "validation",       label: "Validation" },
  { key: "exports",          label: "Exports" },
  { key: "quality_control",  label: "Quality Control" },
  { key: "null_handling",    label: "Null Handling" },
  { key: "analytics",        label: "Analytics" },
  { key: "pipelines",        label: "Pipelines" },
] as const;

export type BlogCategory = (typeof blogCategories)[number]["key"];
export type BlogTag      = (typeof blogTags)[number]["key"];

export const POST_REGISTRY = [
  {
    id: "post-001",
    publishedAt: "2026-03-24",
    category: "workflow_design" as BlogCategory,
    tags: ["csv", "schema_inference", "data_quality"] as BlogTag[],
  },
  {
    id: "post-002",
    publishedAt: "2026-03-17",
    category: "operations" as BlogCategory,
    tags: ["validation", "exports", "quality_control"] as BlogTag[],
  },
  {
    id: "post-003",
    publishedAt: "2026-03-09",
    category: "data_quality" as BlogCategory,
    tags: ["null_handling", "analytics", "pipelines"] as BlogTag[],
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
        tags: [...entry.tags],
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
      tags: [...entry.tags],
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
  const current = POST_REGISTRY.find((e) => e.id === id)!;
  const others = all.filter((p) => p.id !== id);

  const sameCategory = others.filter((p) => p.category === current.category);

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const needed = limit - sameCategory.length;
  const byTagOverlap = others
    .filter((p) => p.category !== current.category)
    .sort(
      (a, b) =>
        b.tags.filter((t) => (current.tags as readonly string[]).includes(t)).length -
        a.tags.filter((t) => (current.tags as readonly string[]).includes(t)).length,
    )
    .slice(0, needed);

  return [...sameCategory, ...byTagOverlap];
}

export function getAllPostParams() {
  return POST_REGISTRY.map(({ id }) => id);
}

export function postOgImage(id: PostId): string {
  return `/blog/og/${id}-og.png`;
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

export function formatBlogDate(value: string, locale: Locale = "en"): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
