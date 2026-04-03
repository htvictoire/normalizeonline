import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Locale, locales } from "@/i18n/config";
import { buildMetadata, buildUrl } from "@/i18n/seo";
import { getRouteHref } from "@/i18n/routes";
import BlogArticleLayout from "@/app/components/blog/article-layout";
import {
  POST_REGISTRY,
  loadPost,
  getRelatedPosts,
  resolveSlugToId,
  type PostId,
} from "@/app/lib/blog";

type PageParams = {
  readonly params: Promise<{ readonly locale: string; readonly slug: string }>;
};

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.flatMap((locale) =>
      POST_REGISTRY.map(async ({ id }) => {
        const mod = await import(
          `@/i18n/messages/${locale}/posts/${id}.json`
        );
        return { locale, slug: (mod.default as { slug: string }).slug };
      }),
    ),
  );
  return params;
}

export async function generateMetadata({ params }: PageParams) {
  const { locale, slug } = await params;
  const id = await resolveSlugToId(slug, locale as Locale);
  if (!id) return {};

  const [{ post }, ...localePosts] = await Promise.all([
    loadPost(id, locale as Locale),
    ...locales.map((lang) => loadPost(id, lang)),
  ]);

  const localeSlugs = Object.fromEntries(
    locales.map((lang, i) => [lang, localePosts[i].post.slug]),
  ) as Record<Locale, string>;

  return buildMetadata({
    route: "BLOG_POST",
    locale: locale as Locale,
    dynamicParams: { slug },
    localeSlugs,
    title: post.title,
    description: post.description,
    ogType: "article",
    publishedTime: post.publishedAt,
    ogImage: post.ogImage,
  });
}

export default async function BlogPostPage({ params }: PageParams) {
  const { locale, slug } = await params;

  const id = await resolveSlugToId(slug, locale as Locale);
  if (!id) notFound();

  const [{ post, tocItems, t }, relatedPosts, blogT] = await Promise.all([
    loadPost(id as PostId, locale as Locale),
    getRelatedPosts(id as PostId, locale as Locale),
    getTranslations({ locale, namespace: "blog" }),
  ]);

  const postUrl = buildUrl(getRouteHref("BLOG_POST", locale as Locale, { slug }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.ogImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: postUrl,
    keywords: post.tags.join(", "),
    author: { "@type": "Organization", name: "Normalize" },
    publisher: {
      "@type": "Organization",
      name: "Normalize",
      url: "https://normalizeonline.com",
    },
  };

  const { default: Content } = await import(`../_posts/${id}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticleLayout
        post={post}
        tocItems={tocItems}
        locale={locale as Locale}
        t={blogT}
        relatedPosts={relatedPosts}
      >
        <Content t={t} />
      </BlogArticleLayout>
    </>
  );
}
