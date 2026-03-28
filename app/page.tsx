import type { Metadata } from "next";
import Steps from "@/app/components/home/steps";
import UploadPad from "@/app/components/home/upload-pad";

export const metadata: Metadata = {
  title: "Normalize — Turn messy files into clean data",
  description:
    "Upload a CSV, Excel, or JSON file. Normalize samples your data and suggests how to interpret it — column types, formats, and null tokens. You confirm and adjust per column, set output preferences, and download a clean dataset as CSV, JSON, or Parquet.",
  alternates: {
    canonical: "https://normalizeonline.com",
  },
  openGraph: {
    title: "Normalize — Turn messy files into clean data",
    description:
      "Upload a CSV, Excel, or JSON file. Normalize suggests how to interpret your data — you confirm, adjust per column, and export as CSV, JSON, or Parquet.",
    url: "https://normalizeonline.com",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Normalize",
  url: "https://normalizeonline.com",
  description:
    "Normalize is a user-driven data normalization workflow. Upload a CSV, Excel, or JSON file — Normalize samples your data and suggests how to interpret each column: type, format, null tokens, and more. You review the suggestion, adjust any column configuration, and confirm. You then choose how the output should be produced — date formats, number styles, output type — before downloading your clean dataset as CSV, JSON, or Parquet.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "CSV, Excel, and JSON ingestion",
    "Automatic column type and format inference",
    "User-reviewed suggestion workflow — Normalize proposes, you decide",
    "Per-column configuration: type, format, null tokens, separators",
    "Full-dataset profiling and validation after confirmation",
    "Cell-level normalization to confirmed semantic types",
    "Boolean, date, numeric, currency, percentage, and accounting handling",
    "Null token detection and normalization",
    "User-controlled output format: date styles, number formats, and more",
    "Export as CSV, JSON, or Parquet",
    "Output quality metrics and parse-error tracking",
    "Deterministic fingerprint for auditability and reproducibility",
    "Trace dataset linking output to source and configuration",
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mt-4 text-center text-6xl font-semibold tracking-tight text-ink">
          Turn messy files into clean data.
        </h1>
        <Steps />
        <section className="mt-12">
          <UploadPad />
        </section>
      </main>
    </>
  );
}
