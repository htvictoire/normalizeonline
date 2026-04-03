"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import BlogPostListItem from "@/app/components/blog/post-list-item";
import type { BlogCategory, BlogPost, BlogTag } from "@/app/lib/blog";
import { tKey } from "@/app/lib/blog";

type BlogDirectoryProps = {
  posts: BlogPost[];
  categories: readonly BlogCategory[];
  tags: readonly BlogTag[];
};

const ALL_CATEGORIES = "__all_categories__" as const;
const ALL_TAGS = "__all_tags__" as const;

type SortValue = "newest" | "oldest" | "title" | "title-desc";

type CategoryFilter = BlogCategory | typeof ALL_CATEGORIES;
type TagFilter = BlogTag | typeof ALL_TAGS;

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
  const t = useTranslations("blog.directory");
  const tBlog = useTranslations("blog");
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryFilter[]>([ALL_CATEGORIES]);
  const [selectedTags, setSelectedTags] = useState<TagFilter[]>([ALL_TAGS]);
  const [sortBy, setSortBy] = useState<SortValue>("newest");
  const [openFilterPanel, setOpenFilterPanel] = useState(false);

  const hasActiveFilters =
    !selectedCategories.includes(ALL_CATEGORIES) ||
    !selectedTags.includes(ALL_TAGS) ||
    sortBy !== "newest";

  const sortOptions: { value: SortValue; label: string }[] = [
    { value: "newest", label: t("newest") },
    { value: "oldest", label: t("oldest") },
    { value: "title", label: t("titleAZ") },
    { value: "title-desc", label: t("titleZA") },
  ];
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

  const categoryOptions: readonly CategoryFilter[] = [ALL_CATEGORIES, ...categories];
  const tagOptions: readonly TagFilter[] = [ALL_TAGS, ...tags];
  const activeCategories: BlogCategory[] = selectedCategories.includes(ALL_CATEGORIES)
    ? []
    : (selectedCategories as BlogCategory[]);
  const activeTags: BlogTag[] = selectedTags.includes(ALL_TAGS)
    ? []
    : (selectedTags as BlogTag[]);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        post.title,
        post.description,
        tBlog(`categories.${tKey(post.category)}`),
        ...post.tags.map((tag) => tBlog(`tags.${tKey(tag)}`)),
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[18rem] sm:shrink-0 md:w-[21rem] lg:w-[24rem]">
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
              placeholder={t("search")}
              className="w-full rounded-xl border border-border bg-canvas py-2.5 pl-12 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand"
            />
          </div>

          <div className="hidden sm:ml-auto sm:flex sm:gap-2">
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
                <span>{getTriggerLabel(t("topic"), selectedCategories.map(c => c === ALL_CATEGORIES ? t("allCategories") : tBlog(`categories.${tKey(c)}`)))}</span>
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
                              toggleFilter(values, category, ALL_CATEGORIES),
                            )
                          }
                          className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                            selectedCategories.includes(category)
                              ? "bg-brand text-canvas"
                              : "text-ink-muted hover:bg-brand/5 hover:text-ink"
                          }`}
                        >
                          {category === ALL_CATEGORIES ? t("allCategories") : tBlog(`categories.${tKey(category)}`)}
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
                <span>{getTriggerLabel(t("tags"), selectedTags.map(tag => tag === ALL_TAGS ? t("allTags") : tBlog(`tags.${tKey(tag)}`)))}</span>
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
                              toggleFilter(values, tag, ALL_TAGS),
                            )
                          }
                          className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-brand text-canvas"
                              : "text-ink-muted hover:bg-brand/5 hover:text-ink"
                          }`}
                        >
                          {tag === ALL_TAGS ? t("allTags") : tBlog(`tags.${tKey(tag)}`)}
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
                <span>{getTriggerLabel(t("orderBy"), [sortOptions.find((item) => item.value === sortBy)?.label ?? t("newest")])}</span>
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
              {t("noResults.heading")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              {t("noResults.description")}
            </p>
          </div>
        )}
      </section>

      {/* Floating filter button — mobile only */}
      <button
        type="button"
        onClick={() => setOpenFilterPanel(true)}
        aria-label={t("filters")}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas shadow-[0_8px_30px_rgba(15,30,53,0.35)] transition-colors hover:bg-brand-dark sm:hidden"
      >
        {hasActiveFilters && (
          <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-canvas bg-brand" />
        )}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M3 6h18M7 12h10M11 18h2" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpenFilterPanel(false)}
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
          openFilterPanel ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("filters")}
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-canvas px-6 pb-10 pt-4 shadow-[0_-12px_40px_rgba(15,30,53,0.15)] transition-transform duration-300 ease-out sm:hidden ${
          openFilterPanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />
        <button
          type="button"
          onClick={() => setOpenFilterPanel(false)}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-border hover:text-ink"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-7">
          {/* Topic */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">{t("topic")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategories((values) => toggleFilter(values, category, ALL_CATEGORIES))}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? "border-brand bg-brand text-canvas"
                      : "border-border text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {category === ALL_CATEGORIES ? t("allCategories") : tBlog(`categories.${tKey(category)}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">{t("tags")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTags((values) => toggleFilter(values, tag, ALL_TAGS))}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? "border-brand bg-brand text-canvas"
                      : "border-border text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {tag === ALL_TAGS ? t("allTags") : tBlog(`tags.${tKey(tag)}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">{t("orderBy")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSortBy(option.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortBy === option.value
                      ? "border-brand bg-brand text-canvas"
                      : "border-border text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
