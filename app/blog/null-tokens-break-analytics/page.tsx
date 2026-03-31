import type { Metadata } from "next";
import BlogArticleLayout from "@/app/components/blog/article-layout";
import { requireBlogPost } from "@/app/lib/blog";

const post = requireBlogPost("null-tokens-break-analytics");
const url = `https://normalizeonline.com/blog/${post.slug}`;
const headings = [
  "Missing data has more than one spelling",
  "The damage shows up downstream",
  "Normalize nulls as a first-class rule",
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
        <h2>Missing data has more than one spelling</h2>
        <p>
          Operational datasets rarely use a single null representation. You will see
          empty strings, dashes, placeholder text, impossible dates, and values like
          unknown or pending depending on which system produced the row.
        </p>
        <p>
          Those tokens often survive ingestion and create subtle problems later when
          analysts assume a column is clean because it has no actual SQL NULL values.
        </p>
      </section>

      <section>
        <h2>The damage shows up downstream</h2>
        <p>
          When placeholder tokens are left untouched, aggregates drift, filters miss
          records, and joins fail in ways that are difficult to explain. A status column
          with both blank and not available values is not missing in one consistent way.
          It is fragmented data quality debt.
        </p>
        <p>
          This is especially painful when a downstream tool treats each placeholder as a
          valid category instead of absent information.
        </p>
      </section>

      <section>
        <h2>Normalize nulls as a first-class rule</h2>
        <p>
          Null handling should be part of column configuration, not a cleanup
          afterthought. Define which tokens count as missing before you transform the
          full dataset, and apply that rule consistently across export formats.
        </p>
        <p>
          Once missingness is normalized, profiling, validation, and quality metrics
          become much more trustworthy.
        </p>
        <ul>
          <li>Identify all placeholder tokens in the sample set.</li>
          <li>Decide whether each token means missing, invalid, or pending.</li>
          <li>Map true missingness to one consistent representation in the output.</li>
        </ul>
      </section>
    </BlogArticleLayout>
  );
}
