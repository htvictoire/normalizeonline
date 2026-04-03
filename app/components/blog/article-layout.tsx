import { type useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import BlogArticleToc from "@/app/components/blog/article-toc";
import BlogPostCard from "@/app/components/blog/post-card";
import ArticleHeroImage from "@/app/components/blog/article-hero-image";
import ArticleMobileNav from "@/app/components/blog/article-mobile-nav";
import { type BlogPost, formatBlogDate, tKey } from "@/app/lib/blog";
import { type Locale } from "@/i18n/config";

type BlogArticleLayoutProps = {
  post: BlogPost;
  tocItems: { id: string; title: string }[];
  locale: Locale;
  t: ReturnType<typeof useTranslations<"blog">>;
  relatedPosts: BlogPost[];
  children: React.ReactNode;
};

export default function BlogArticleLayout({
  post,
  tocItems,
  locale,
  t,
  relatedPosts,
  children,
}: BlogArticleLayoutProps) {

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
      <ArticleHeroImage src={post.ogImage} alt={post.title} />

      <Link
        href="/blog"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-4 w-4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3.5 5.5 8l4.5 4.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
        {t("article.backToBlog")}
      </Link>

      <article className="mt-6 min-w-0">
        <header className="max-w-6xl">
          <h1 className="w-full max-w-5xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 w-full max-w-[68rem] text-base leading-7 text-ink-muted sm:text-lg">
            {post.description}
          </p>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="min-w-0 space-y-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:text-ink-muted [&_p]:max-w-3xl [&_p]:text-base [&_p]:leading-8 [&_p]:text-ink-muted [&_section]:space-y-4 [&_ul]:max-w-3xl [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:text-base [&_ul]:leading-8 [&_ul]:marker:text-brand">
            {children}
          </div>

          <aside className="hidden space-y-8 lg:sticky lg:top-24 lg:block">
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
                  <dd className="mt-1 font-medium text-ink">{t(`categories.${tKey(post.category)}`)}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{t("article.tags")}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-ink-muted"
                      >
                        {t(`tags.${tKey(tag)}`)}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                {t("article.inThisArticle")}
              </p>
              <BlogArticleToc items={tocItems} />
            </div>
          </aside>
        </div>

        <section className="mt-12 rounded-[2rem] border border-border bg-[linear-gradient(135deg,rgba(37,150,190,0.08),rgba(50,211,176,0.1))] px-6 py-7 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            {t("article.cta.eyebrow")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
            {t("article.cta.heading")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
            {t("article.cta.description")}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas transition-colors hover:bg-brand-dark"
            >
              {t("article.cta.openNormalize")}
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-border bg-canvas/80 px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              {t("article.cta.browseArticles")}
            </Link>
          </div>
        </section>
      </article>

      <ArticleMobileNav post={post} tocItems={tocItems} locale={locale} />

      {relatedPosts.length > 0 ? (
        <section className="mt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                {t("article.related.eyebrow")}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                {t("article.related.heading")}
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {t("article.related.viewAll")}
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <BlogPostCard key={relatedPost.slug} post={relatedPost} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
