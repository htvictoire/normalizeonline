import type { Metadata } from "next";
import BlogDirectory from "@/app/components/blog/blog-directory";
import { blogCategories, blogTags, getBlogPosts } from "@/app/lib/blog";

const blogUrl = "https://normalizeonline.com/blog";

export const metadata: Metadata = {
  title: "Blog | Normalize – Data Normalization for Structured Files",
  description:
    "Practical writing on CSV cleaning, Excel normalization, null handling, date and time format conflicts, and making structured data safe for analytics and ingestion.",
  alternates: {
    canonical: blogUrl,
  },
  openGraph: {
    title: "Normalize Blog – Structured Data, Made Reliable",
    description:
      "Practical writing on CSV cleaning, Excel normalization, null handling, date and time format conflicts, and making structured data safe for analytics and ingestion.",
    url: blogUrl,
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Normalize Blog",
    description:
      "Writing on structured data normalization: CSV and Excel cleaning, null token handling, date and time format standardization, schema validation, and reliable data ingestion.",
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
      author: {
        "@type": "Organization",
        name: "Normalize",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <section className="overflow-hidden rounded-[1rem] border border-border bg-[radial-gradient(circle_at_top_left,rgba(50,211,176,0.26),transparent_34%),linear-gradient(135deg,rgba(37,150,190,0.14),rgba(255,255,255,0.98)_52%,rgba(50,211,176,0.12))] px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
          <h1 className="mt-4 max-w-5xl text-[2.2rem] leading-[1.02] font-semibold tracking-tight text-ink sm:text-[2.8rem] md:text-[3.4rem]">
            When data arrives broken, the pipeline pays for it. Here&apos;s how to fix it upstream.
          </h1>
          <p className="mt-5 w-full max-w-[68rem] text-sm leading-6 text-ink-muted sm:text-base">
            Writing on the real problems inside structured datasets — mixed date & time formats,
            inconsistent null tokens, column types that only look correct, and spreadsheet
            exports that break quietly. Each article covers a specific normalization problem
            and how to resolve it before it reaches your analytics, database, or any workflow.
          </p>
        </section>

        <div className="mt-12">
          <BlogDirectory
            posts={posts}
            categories={blogCategories}
            tags={blogTags}
          />
        </div>
      </main>
    </>
  );
}
