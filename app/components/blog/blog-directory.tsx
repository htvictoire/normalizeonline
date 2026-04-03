"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import BlogPostListItem from "@/app/components/blog/post-list-item";
import { blogCategories, blogTags, type BlogPost } from "@/app/lib/blog";

type SortValue = "newest" | "oldest" | "title" | "title-desc";

const SORT_VALUES: SortValue[] = ["newest", "oldest", "title", "title-desc"];

function isSortValue(v: string): v is SortValue {
  return SORT_VALUES.includes(v as SortValue);
}

export default function BlogDirectory({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("blog.directory");
  const tBlog = useTranslations("blog");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query       = searchParams.get("q") ?? "";
  const activeCats  = searchParams.get("cat")?.split(",").filter(Boolean) ?? [];
  const activeTags  = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];
  const sortRaw     = searchParams.get("ord") ?? "newest";
  const sortBy      = isSortValue(sortRaw) ? sortRaw : "newest";

  const hasActiveFilters = activeCats.length > 0 || activeTags.length > 0 || sortBy !== "newest";

  const [openPopover, setOpenPopover] = useState<"topic" | "tags" | "order" | null>(null);
  const [openFilterPanel, setOpenFilterPanel] = useState(false);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggleListParam(paramKey: string, value: string, current: string[]) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParam(paramKey, next.join(",") || null);
  }

  const sortOptions: { value: SortValue; label: string }[] = [
    { value: "newest",     label: t("newest") },
    { value: "oldest",     label: t("oldest") },
    { value: "title",      label: t("titleAZ") },
    { value: "title-desc", label: t("titleZA") },
  ];

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        post.title,
        post.description,
        tBlog(`categories.${post.category}`),
        ...post.tags.map((tag) => tBlog(`tags.${tag}`)),
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

    const matchesCategory =
      activeCats.length === 0 || activeCats.includes(post.category);

    const matchesTags =
      activeTags.length === 0 || activeTags.some((tag) => post.tags.includes(tag as (typeof post.tags)[number]));

    return matchesQuery && matchesCategory && matchesTags;
  });

  const orderedPosts = [...filteredPosts].sort((left, right) => {
    if (sortBy === "oldest")
      return new Date(left.publishedAt).getTime() - new Date(right.publishedAt).getTime();
    if (sortBy === "title") return left.title.localeCompare(right.title);
    if (sortBy === "title-desc") return right.title.localeCompare(left.title);
    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? t("newest");

  return (
    <>
      {/* ── Sticky filter bar ── */}
      <section className="sticky top-14 z-30 bg-canvas/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-canvas/85">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

          {/* Search */}
          <div className="relative w-full sm:w-[18rem] sm:shrink-0 md:w-[21rem] lg:w-[24rem]">
            <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
              </svg>
            </span>
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => updateParam("q", e.target.value || null)}
              placeholder={t("search")}
              className="w-full rounded-xl border border-border bg-canvas py-2.5 pl-12 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand"
            />
          </div>

          {/* Desktop dropdowns */}
          <div className="hidden sm:ml-auto sm:flex sm:gap-2">

            {/* Topic */}
            <div
              className="relative"
              onMouseEnter={() => setOpenPopover("topic")}
              onMouseLeave={() => setOpenPopover((v) => (v === "topic" ? null : v))}
            >
              <button
                type="button"
                aria-expanded={openPopover === "topic"}
                onClick={() => setOpenPopover((v) => (v === "topic" ? null : "topic"))}
                className="flex min-h-10 min-w-[12rem] cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-ink transition-colors hover:border-ink"
              >
                <span>
                  {activeCats.length === 0
                    ? t("topic")
                    : activeCats.length === 1
                      ? tBlog(`categories.${activeCats[0]}`)
                      : `${t("topic")} (${activeCats.length})`}
                </span>
                <svg viewBox="0 0 24 24" className={`h-4 w-4 text-ink-muted transition-transform ${openPopover === "topic" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openPopover === "topic" && (
                <div className="absolute left-0 top-full z-10 pt-2">
                  <div className="w-[min(16rem,calc(100vw-2rem))] rounded-xl border border-border bg-canvas p-2 shadow-[0_24px_50px_-35px_rgba(15,30,53,0.7)]">
                    <div className="space-y-1">
                      {blogCategories.map(({ key }) => (
                        <button
                          type="button"
                          key={key}
                          onClick={() => toggleListParam("cat", key, activeCats)}
                          className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                            activeCats.includes(key)
                              ? "bg-brand text-canvas"
                              : "text-ink-muted hover:bg-brand/5 hover:text-ink"
                          }`}
                        >
                          {tBlog(`categories.${key}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div
              className="relative"
              onMouseEnter={() => setOpenPopover("tags")}
              onMouseLeave={() => setOpenPopover((v) => (v === "tags" ? null : v))}
            >
              <button
                type="button"
                aria-expanded={openPopover === "tags"}
                onClick={() => setOpenPopover((v) => (v === "tags" ? null : "tags"))}
                className="flex min-h-10 min-w-[13rem] cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-ink transition-colors hover:border-ink"
              >
                <span>
                  {activeTags.length === 0
                    ? t("tags")
                    : activeTags.length === 1
                      ? tBlog(`tags.${activeTags[0]}`)
                      : `${t("tags")} (${activeTags.length})`}
                </span>
                <svg viewBox="0 0 24 24" className={`h-4 w-4 text-ink-muted transition-transform ${openPopover === "tags" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openPopover === "tags" && (
                <div className="absolute left-0 top-full z-10 pt-2">
                  <div className="w-[min(16rem,calc(100vw-2rem))] rounded-xl border border-border bg-canvas p-2 shadow-[0_24px_50px_-35px_rgba(15,30,53,0.7)]">
                    <div className="space-y-1">
                      {blogTags.map(({ key }) => (
                        <button
                          type="button"
                          key={key}
                          onClick={() => toggleListParam("tags", key, activeTags)}
                          className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                            activeTags.includes(key)
                              ? "bg-brand text-canvas"
                              : "text-ink-muted hover:bg-brand/5 hover:text-ink"
                          }`}
                        >
                          {tBlog(`tags.${key}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order */}
            <div
              className="relative"
              onMouseEnter={() => setOpenPopover("order")}
              onMouseLeave={() => setOpenPopover((v) => (v === "order" ? null : v))}
            >
              <button
                type="button"
                aria-expanded={openPopover === "order"}
                onClick={() => setOpenPopover((v) => (v === "order" ? null : "order"))}
                className="flex min-h-10 min-w-[10rem] cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-ink transition-colors hover:border-ink"
              >
                <span>{currentSortLabel}</span>
                <svg viewBox="0 0 24 24" className={`h-4 w-4 text-ink-muted transition-transform ${openPopover === "order" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openPopover === "order" && (
                <div className="absolute left-0 top-full z-10 pt-2">
                  <div className="w-[min(12rem,calc(100vw-2rem))] rounded-xl border border-border bg-canvas p-2 shadow-[0_24px_50px_-35px_rgba(15,30,53,0.7)]">
                    <div className="space-y-1">
                      {sortOptions.map((option) => (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() => updateParam("ord", option.value === "newest" ? null : option.value)}
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
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Post list ── */}
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

      {/* ── Mobile floating filter button ── */}
      <button
        type="button"
        onClick={() => setOpenFilterPanel(true)}
        aria-label={t("filters")}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas shadow-[0_8px_30px_rgba(15,30,53,0.35)] transition-colors hover:bg-brand-dark sm:hidden"
      >
        {hasActiveFilters && (
          <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-canvas bg-brand" />
        )}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
          <path d="M3 6h18M7 12h10M11 18h2" />
        </svg>
      </button>

      {/* ── Mobile backdrop ── */}
      <div
        aria-hidden="true"
        onClick={() => setOpenFilterPanel(false)}
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
          openFilterPanel ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* ── Mobile bottom sheet ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("filters")}
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-canvas px-6 pb-10 pt-4 shadow-[0_-12px_40px_rgba(15,30,53,0.15)] transition-transform duration-300 ease-out sm:hidden ${
          openFilterPanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpenFilterPanel(false)}
          aria-label="Close"
          className="mx-auto mb-5 flex h-5 w-full items-center justify-center"
        >
          <span className="h-1 w-10 rounded-full bg-border" />
        </button>

        <div className="space-y-7">
          {/* Topic */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">{t("topic")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {/* All — closes on click */}
              <button
                type="button"
                onClick={() => { updateParam("cat", null); setOpenFilterPanel(false); }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCats.length === 0
                    ? "border-brand bg-brand text-canvas"
                    : "border-border text-ink-muted hover:border-ink hover:text-ink"
                }`}
              >
                {t("allCategories")}
              </button>
              {blogCategories.map(({ key }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    const next = activeCats.includes(key)
                      ? activeCats.filter((v) => v !== key)
                      : [...activeCats, key];
                    updateParam("cat", next.join(",") || null);
                    if (next.length === 0) setOpenFilterPanel(false);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeCats.includes(key)
                      ? "border-brand bg-brand text-canvas"
                      : "border-border text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {tBlog(`categories.${key}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">{t("tags")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {/* All — closes on click */}
              <button
                type="button"
                onClick={() => { updateParam("tags", null); setOpenFilterPanel(false); }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTags.length === 0
                    ? "border-brand bg-brand text-canvas"
                    : "border-border text-ink-muted hover:border-ink hover:text-ink"
                }`}
              >
                {t("allTags")}
              </button>
              {blogTags.map(({ key }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    const next = activeTags.includes(key)
                      ? activeTags.filter((v) => v !== key)
                      : [...activeTags, key];
                    updateParam("tags", next.join(",") || null);
                    if (next.length === 0) setOpenFilterPanel(false);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeTags.includes(key)
                      ? "border-brand bg-brand text-canvas"
                      : "border-border text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {tBlog(`tags.${key}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort — always closes on selection */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">{t("orderBy")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    updateParam("ord", option.value === "newest" ? null : option.value);
                    setOpenFilterPanel(false);
                  }}
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
