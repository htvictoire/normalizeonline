import type { Metadata } from "next";
import BlogArticleLayout from "@/app/components/blog/article-layout";
import { requireBlogPost } from "@/app/lib/blog";

const post = requireBlogPost("normalize-csv-without-losing-meaning");
const url = `https://normalizeonline.com/blog/${post.slug}`;
const headings = [
  "Start with the meaning of each column",
  "Separate detection from approval",
  "Normalize values only after the rules are stable",
  "Export with an explicit contract",
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
        <h2>Start with the meaning of each column</h2>
        <p>
          Normalization fails when teams begin with file syntax instead of business
          meaning. A date-like string can represent an invoice date, a service period,
          or a contract renewal window. Those are not interchangeable even when the raw
          values look similar.
        </p>
        <p>
          Before changing formats, decide what each column is supposed to represent and
          which values are acceptable. That gives every later transformation a stable
          target instead of a best-effort guess.
        </p>
        <ul>
          <li>Name the semantic type you expect for every column.</li>
          <li>Record whether blanks, placeholders, and mixed units are allowed.</li>
          <li>Document the output format you want before you export.</li>
        </ul>
      </section>

      <section>
        <h2>Separate detection from approval</h2>
        <p>
          Automated inference is useful because it accelerates triage, but it should not
          be treated as the final truth. The safe pattern is to sample the data, suggest
          likely types and formats, then require a human decision before applying a
          full-dataset transformation.
        </p>
        <p>
          That approval step is where you catch localized date formats, overloaded
          identifiers, and the one sales column that mixes percentages with free-text
          notes.
        </p>
      </section>

      <section>
        <h2>Normalize values only after the rules are stable</h2>
        <p>
          Once the column contract is clear, normalize cell values into the confirmed
          target types. This is where you standardize null tokens, trim whitespace,
          unify decimal and thousands separators, and convert booleans or dates into a
          single agreed representation.
        </p>
        <p>
          Doing this after review prevents the common failure mode where a tool eagerly
          rewrites data and silently erases context you needed to keep.
        </p>
      </section>

      <section>
        <h2>Export with an explicit contract</h2>
        <p>
          A clean file is not just a valid file. It should carry predictable shapes,
          formats, and parse behavior so that the next system does not need to guess
          again.
        </p>
        <p>
          Treat the export configuration as part of the dataset contract. If you can
          explain the output schema in one pass, the normalization step did its job.
        </p>
      </section>
    </BlogArticleLayout>
  );
}
