import type { Metadata } from "next";
import BlogArticleLayout from "@/app/components/blog/article-layout";
import { requireBlogPost } from "@/app/lib/blog";

const post = requireBlogPost("column-checks-before-export");
const url = `https://normalizeonline.com/blog/${post.slug}`;
const headings = [
  "A small checklist prevents expensive reruns",
  "What to verify every time",
  "Use review to reduce ambiguity, not just errors",
];

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: post.title,
    description: post.description,
    url,
    type: "article",
    publishedTime: post.publishedAt,
  },
};

export default function Page() {
  return (
    <BlogArticleLayout post={post} headings={headings}>
      <section>
        <h2>A small checklist prevents expensive reruns</h2>
        <p>
          Most broken exports are not caused by dramatic failures. They come from one
          unchecked assumption in one column that looked harmless during a spot check.
        </p>
        <p>
          A lightweight pre-export review keeps that risk manageable and makes the
          resulting file much easier to trust.
        </p>
      </section>

      <section>
        <h2>What to verify every time</h2>
        <p>
          Run through the same column-level checks regardless of file type. The goal is
          consistency, not cleverness.
        </p>
        <ul>
          <li>Type: confirm the inferred type matches the real business meaning.</li>
          <li>Format: verify date, number, currency, and percentage conventions.</li>
          <li>Nulls: inspect blanks, placeholders, and sentinel values such as NA or dash.</li>
          <li>
            Ranges: catch outliers, impossible values, and negative numbers where they
            should not exist.
          </li>
          <li>
            Categories: check casing, spelling drift, and duplicate labels that should
            collapse to one value.
          </li>
          <li>Identifiers: preserve leading zeros and do not coerce keys into numbers.</li>
          <li>
            Output shape: confirm the exported representation matches what downstream
            tools expect.
          </li>
        </ul>
      </section>

      <section>
        <h2>Use review to reduce ambiguity, not just errors</h2>
        <p>
          A strong review step does more than find malformed rows. It surfaces
          uncertainty. If a column could reasonably be interpreted in two ways, that is
          exactly when you pause and set the rule explicitly.
        </p>
        <p>
          The cleanest export is the one that leaves the fewest decisions for the next
          person or service in the chain.
        </p>
      </section>
    </BlogArticleLayout>
  );
}
