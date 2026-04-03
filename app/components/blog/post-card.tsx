"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { type BlogPost, formatBlogDate } from "@/app/lib/blog";
import { type Locale } from "@/i18n/config";

export default function BlogPostCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const t = useTranslations("blog");

  return (
    <article className="group flex h-full flex-col py-4 sm:py-6">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em] text-ink-muted sm:gap-3 sm:tracking-[0.18em]">
        <time dateTime={post.publishedAt}>
          {formatBlogDate(post.publishedAt, locale)}
        </time>
        <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
        <span>{post.readingTime}</span>
      </div>

      <h2 className="mt-3 text-lg font-semibold tracking-tight text-ink sm:mt-5 sm:text-2xl">
        <Link href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }} className="transition-colors hover:text-brand">
          {post.title}
        </Link>
      </h2>

      <p className="mt-2 text-sm leading-6 text-ink-muted sm:mt-3">{post.description}</p>

      <div className="mt-auto hidden pt-6 sm:block">
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
