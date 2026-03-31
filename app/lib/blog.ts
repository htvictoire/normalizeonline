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

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  category: BlogCategory;
  tags: BlogTag[];
};

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const posts: BlogPost[] = [
  {
    slug: "normalize-csv-without-losing-meaning",
    title: "How to normalize CSV data without losing meaning",
    description:
      "A practical workflow for cleaning inconsistent CSVs while preserving the semantics analysts and downstream systems actually depend on.",
    publishedAt: "2026-03-24",
    readingTime: "6 min read",
    category: "Workflow Design",
    tags: ["CSV", "Schema inference", "Data quality"],
  },
  {
    slug: "column-checks-before-export",
    title: "Seven column-level checks before you export a clean dataset",
    description:
      "The review checklist we use to catch the most expensive normalization mistakes before they leave the browser.",
    publishedAt: "2026-03-17",
    readingTime: "5 min read",
    category: "Operations",
    tags: ["Validation", "Exports", "Quality control"],
  },
  {
    slug: "null-tokens-break-analytics",
    title: "Why local null tokens quietly break analytics pipelines",
    description:
      "Blank strings are only the start. Teams also inherit domain-specific placeholders that need to be normalized before metrics and joins become reliable.",
    publishedAt: "2026-03-09",
    readingTime: "4 min read",
    category: "Data Quality",
    tags: ["Null handling", "Analytics", "Pipelines"],
  },
];

export function getBlogPosts(): BlogPost[] {
  return [...posts].sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function requireBlogPost(slug: string): BlogPost {
  const post = getBlogPost(slug);

  if (!post) {
    throw new Error(`Missing blog post metadata for slug: ${slug}`);
  }

  return post;
}

export function getRelatedBlogPosts(slug: string, limit = 2): BlogPost[] {
  return getBlogPosts()
    .filter((post) => post.slug !== slug)
    .slice(0, limit);
}

export function formatBlogDate(value: string): string {
  return formatter.format(new Date(value));
}
