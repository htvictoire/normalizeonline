"use client";

import { useEffect, useState } from "react";
import BlogPostListItem from "@/app/components/blog/post-list-item";
import type { BlogCategory, BlogPost, BlogTag } from "@/app/lib/blog";

type BlogDirectoryProps = {
  posts: BlogPost[];
  categories: readonly BlogCategory[];
  tags: readonly BlogTag[];
};

const allCategoriesOption = "All categories" as const;
const allTagsOption = "All tags" as const;

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
] as const;

type SortOption = (typeof sortOptions)[number]["value"];
type CategoryFilter = BlogCategory | typeof allCategoriesOption;
type TagFilter = BlogTag | typeof allTagsOption;

function toggleSelection<T extends string>(values: T[], value: T): T[] {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }

  return [...values, value];
}

function toggleFilter<T extends string>(
  values: T[],
  value: T,
  allLabel: T,
): T[] {
  if (value === allLabel) {
    return [allLabel];
  }

  const scopedValues = values.filter((item) => item !== allLabel);
  const nextValues = toggleSelection(scopedValues, value as T);

  return nextValues.length > 0 ? nextValues : [allLabel];
}

function getTriggerLabel(baseLabel: string, values: string[]) {
  if (values.length === 0) {
    return baseLabel;
  }

  if (values.length === 1) {
    return values[0];
  }

  return `${baseLabel} (${values.length})`;
}

export default function BlogDirectory({
  posts,
  categories,
  tags,
}: BlogDirectoryProps) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryFilter[]>([
    allCategoriesOption,
  ]);
  const [selectedTags, setSelectedTags] = useState<TagFilter[]>([allTagsOption]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [openPopover, setOpenPopover] = useState<"topic" | "tags" | "order" | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPopover(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const categoryOptions: readonly CategoryFilter[] = [allCategoriesOption, ...categories];
  const tagOptions: readonly TagFilter[] = [allTagsOption, ...tags];
  const activeCategories: BlogCategory[] = selectedCategories.includes(allCategoriesOption)
    ? []
    : (selectedCategories as BlogCategory[]);
  const activeTags: BlogTag[] = selectedTags.includes(allTagsOption)
    ? []
    : (selectedTags as BlogTag[]);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        post.title,
        post.description,
        post.category,
        ...post.tags,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

    const matchesCategory =
      activeCategories.length === 0 || activeCategories.includes(post.category);

    const matchesTags =
      activeTags.length === 0 || activeTags.some((tag) => post.tags.includes(tag));

    return matchesQuery && matchesCategory && matchesTags;
  });

  const orderedPosts = [...filteredPosts].sort((left, right) => {
    if (sortBy === "oldest") {
      return new Date(left.publishedAt).getTime() - new Date(right.publishedAt).getTime();
    }

    if (sortBy === "title") {
      return left.title.localeCompare(right.title);
    }

    if (sortBy === "title-desc") {
      return right.title.localeCompare(left.title);
    }

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });

  return (
    <>
      <section className="sticky top-14 z-30 bg-canvas/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-canvas/85">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative w-full md:w-[21rem] lg:w-[24rem]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                />
              </svg>
            </span>
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles"
              className="w-full rounded-xl border border-border bg-canvas py-2.5 pl-12 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand"
            />
          </div>

          <div className="flex flex-col gap-2 md:ml-auto md:flex-row">
            <div
              className="relative"
              onMouseEnter={() => setOpenPopover("topic")}
              onMouseLeave={() =>
                setOpenPopover((value) => (value === "topic" ? null : value))
              }
            >
              <button
                type="button"
                aria-expanded={openPopover === "topic"}
                onClick={() =>
                  setOpenPopover((value) => (value === "topic" ? null : "topic"))
                }
                className="flex min-h-10 min-w-[12rem] cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-ink transition-colors hover:border-ink"
              >
                <span>{getTriggerLabel("Topic", selectedCategories)}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 text-ink-muted transition-transform ${
                    openPopover === "topic" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openPopover === "topic" ? (
                <div className="absolute left-0 top-full z-10 pt-2">
                  <div className="w-[min(16rem,calc(100vw-2rem))] rounded-xl border border-border bg-canvas p-2 shadow-[0_24px_50px_-35px_rgba(15,30,53,0.7)]">
                    <div className="space-y-1">
                      {categoryOptions.map((category) => (
                        <button
                          type="button"
                          key={category}
                          onClick={() =>
                            setSelectedCategories((values) =>
                              toggleFilter(values, category, allCategoriesOption),
                            )
                          }
                          className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                            selectedCategories.includes(category)
                              ? "bg-brand text-canvas"
                              : "text-ink-muted hover:bg-brand/5 hover:text-ink"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOpenPopover("tags")}
              onMouseLeave={() =>
                setOpenPopover((value) => (value === "tags" ? null : value))
              }
            >
              <button
                type="button"
                aria-expanded={openPopover === "tags"}
                onClick={() =>
                  setOpenPopover((value) => (value === "tags" ? null : "tags"))
                }
                className="flex min-h-10 min-w-[13rem] cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-ink transition-colors hover:border-ink"
              >
                <span>{getTriggerLabel("Tags", selectedTags)}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 text-ink-muted transition-transform ${
                    openPopover === "tags" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openPopover === "tags" ? (
                <div className="absolute left-0 top-full z-10 pt-2">
                  <div className="w-[min(16rem,calc(100vw-2rem))] rounded-xl border border-border bg-canvas p-2 shadow-[0_24px_50px_-35px_rgba(15,30,53,0.7)]">
                    <div className="space-y-1">
                      {tagOptions.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() =>
                            setSelectedTags((values) =>
                              toggleFilter(values, tag, allTagsOption),
                            )
                          }
                          className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-brand text-canvas"
                              : "text-ink-muted hover:bg-brand/5 hover:text-ink"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOpenPopover("order")}
              onMouseLeave={() =>
                setOpenPopover((value) => (value === "order" ? null : value))
              }
            >
              <button
                type="button"
                aria-expanded={openPopover === "order"}
                onClick={() =>
                  setOpenPopover((value) => (value === "order" ? null : "order"))
                }
                className="flex min-h-10 min-w-[10rem] cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-ink transition-colors hover:border-ink"
              >
                <span>{getTriggerLabel("Order by", [sortOptions.find((item) => item.value === sortBy)?.label ?? "Newest"])}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 text-ink-muted transition-transform ${
                    openPopover === "order" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openPopover === "order" ? (
                <div className="absolute left-0 top-full z-10 pt-2">
                  <div className="w-[min(12rem,calc(100vw-2rem))] rounded-xl border border-border bg-canvas p-2 shadow-[0_24px_50px_-35px_rgba(15,30,53,0.7)]">
                    <div className="space-y-1">
                      {sortOptions.map((option) => (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                            sortBy === option.value
                              ? "bg-brand text-canvas"
                              : "text-ink-muted hover:bg-brand/5 hover:text-ink"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        {orderedPosts.length > 0 ? (
          <div className="divide-y divide-border">
            {orderedPosts.map((post) => (
              <BlogPostListItem key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-canvas px-6 py-12 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              No articles match those filters.
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Try a broader search term or clear one of the selected topics or tags.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
