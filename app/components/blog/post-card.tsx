"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { type BlogPost, formatBlogDate, tKey } from "@/app/lib/blog";
import { type Locale } from "@/i18n/config";

export default function BlogPostCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const t = useTranslations("blog");

  return (
    <article className="group flex h-full flex-col rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(37,150,190,0.08),rgba(255,255,255,0.98)_28%,rgba(50,211,176,0.08))] p-6 shadow-[0_22px_60px_-40px_rgba(15,30,53,0.6)] transition-transform duration-200 hover:-translate-y-1">
      <div className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-[0.18em] text-brand uppercase">
        <span className="rounded-full bg-brand/10 px-3 py-1">{t(`categories.${tKey(post.category)}`)}</span>
        <time dateTime={post.publishedAt} className="text-ink-muted">
          {formatBlogDate(post.publishedAt, locale)}
        </time>
        <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
        <span className="text-ink-muted">{post.readingTime}</span>
      </div>

      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
        <Link href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }} className="transition-colors hover:text-brand">
          {post.title}
        </Link>
      </h2>

      <p className="mt-3 text-sm leading-6 text-ink-muted">{post.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-canvas/80 px-3 py-1 text-xs text-ink-muted"
          >
            {t(`tags.${tKey(tag)}`)}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Link
          href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-brand"
        >
          {t("readArticle")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
