"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import BlogArticleToc from "@/app/components/blog/article-toc";
import { type BlogPost, formatBlogDate } from "@/app/lib/blog";
import { type Locale } from "@/i18n/config";

type Props = {
  post: BlogPost;
  tocItems: { id: string; title: string }[];
  locale: Locale;
};

export default function ArticleMobileNav({ post, tocItems, locale }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("blog");

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("article.inThisArticle")}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas shadow-[0_8px_30px_rgba(15,30,53,0.35)] transition-colors hover:bg-brand-dark lg:hidden"
      >
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
          <path d="M4 6h16M4 12h10M4 18h7" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("article.articleDetails")}
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-[2rem] bg-canvas px-6 pb-8 pt-4 shadow-[0_-12px_40px_rgba(15,30,53,0.15)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle — tap to close */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="mx-auto mb-5 flex h-5 w-full items-center justify-center"
        >
          <span className="h-1 w-10 rounded-full bg-border" />
        </button>

        <div className="space-y-8">
          {/* Article details */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              {t("article.articleDetails")}
            </p>
            <dl className="mt-4 grid gap-y-4 text-sm">
              <div>
                <dt className="text-ink-muted">{t("article.published")}</dt>
                <dd className="mt-1 font-medium text-ink">
                  {formatBlogDate(post.publishedAt, locale)}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">{t("article.readingTime")}</dt>
                <dd className="mt-1 font-medium text-ink">{post.readingTime}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">{t("article.category")}</dt>
                <dd className="mt-1 font-medium text-ink">
                  {t(`categories.${post.category}`)}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">{t("article.tags")}</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-xs font-medium text-ink-muted"
                    >
                      {t(`tags.${tag}`)}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* TOC */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              {t("article.inThisArticle")}
            </p>
            <BlogArticleToc items={tocItems} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}
