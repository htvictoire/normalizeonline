import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { buildMetadata, buildUrl } from "@/i18n/seo";
import { getRouteHref } from "@/i18n/routes";
import BlogDirectory from "@/app/components/blog/blog-directory";
import { getBlogPosts } from "@/app/lib/blog";

type PageParams = { readonly params: Promise<{ readonly locale: string }> };

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildMetadata({
    route: "BLOG",
    locale: locale as Locale,
    title: t("index.seo.title"),
    description: t("index.seo.description"),
    ogTitle: t("index.seo.ogTitle"),
    ogDescription: t("index.seo.ogDescription"),
  });
}

export default async function BlogPage({ params }: PageParams) {
  const { locale } = await params;
  const [t, posts] = await Promise.all([
    getTranslations({ locale, namespace: "blog" }),
    getBlogPosts(locale as Locale),
  ]);

  const blogUrl = buildUrl(getRouteHref("BLOG", locale as Locale));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Normalize Blog",
    description: t("index.seo.description"),
    url: blogUrl,
    publisher: {
      "@type": "Organization",
      name: "Normalize",
      url: "https://normalizeonline.com",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      url: `${blogUrl}/${post.slug}`,
      author: { "@type": "Organization", name: "Normalize" },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:py-10 md:py-14">
        <section className="overflow-hidden rounded-[1rem] border border-border bg-[radial-gradient(circle_at_top_left,rgba(50,211,176,0.26),transparent_34%),linear-gradient(135deg,rgba(37,150,190,0.14),rgba(255,255,255,0.98)_52%,rgba(50,211,176,0.12))] px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
          <h1 className="mt-4 max-w-5xl text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.2rem] sm:leading-[1.02] md:text-[2.8rem] lg:text-[3.4rem]">
            {t("index.hero.headline")}
          </h1>
          <p className="mt-5 w-full max-w-[68rem] text-sm leading-6 text-ink-muted sm:text-base">
            {t("index.hero.description")}
          </p>
        </section>

        <div className="mt-6 sm:mt-12">
          <Suspense>
            <BlogDirectory posts={posts} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
