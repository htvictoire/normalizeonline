"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { type BlogPost, formatBlogDate } from "@/app/lib/blog";
import { type Locale } from "@/i18n/config";

export default function BlogPostListItem({ post }: { post: BlogPost }) {
  const t = useTranslations("blog");
  const locale = useLocale() as Locale;

  return (
    <article className="py-4 first:pt-0 last:pb-0 sm:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em] text-brand sm:gap-3 sm:tracking-[0.18em]">
            <span>{t(`categories.${post.category}`)}</span>
            <time dateTime={post.publishedAt} className="text-ink-muted">
              {formatBlogDate(post.publishedAt, locale)}
            </time>
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
            <span className="text-ink-muted">{post.readingTime}</span>
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
            <Link
              href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
              className="transition-colors hover:text-brand"
            >
              {post.title}
            </Link>
          </h2>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-ink-muted">
            <Link
              href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
              className="transition-colors hover:text-ink"
            >
              {post.description}
            </Link>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-ink-muted"
              >
                {t(`tags.${tag}`)}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:block lg:pt-1">
          <Link
            href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
            className="inline-flex items-center text-sm font-medium text-ink transition-colors hover:text-brand"
          >
            {t("readArticle")}
          </Link>
        </div>
      </div>
    </article>
  );
}
