import { getTranslations } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { buildMetadata } from "@/i18n/seo";
import Steps from "@/app/components/home/steps";
import UploadPad from "@/app/components/home/upload-pad";

type PageParams = { readonly params: Promise<{ readonly locale: string }> };

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildMetadata({
    route: "HOME",
    locale: locale as Locale,
    title: t("seo.title"),
    description: t("seo.description"),
    ogTitle: t("seo.ogTitle"),
    ogDescription: t("seo.ogDescription"),
  });
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Normalize",
  url: "https://normalizeonline.com",
  description:
    "Normalize is a user-driven data normalization workflow. Upload a CSV, Excel, or JSON file — Normalize samples your data and suggests how to interpret each column: type, format, null tokens, and more. You review the suggestion, adjust any column configuration, and confirm. You then choose how the output should be produced — date formats, number styles, output type — before downloading your clean dataset as CSV, JSON, or Parquet.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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

export default async function HomePage({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <h1 className="mt-2 text-center text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:mt-4 md:text-6xl">
          {t("headline")}
        </h1>
        <section className="mt-10 md:mt-0">
          <Steps />
        </section>
        <section className="mt-10 md:mt-12">
          <UploadPad />
        </section>
      </main>
    </>
  );
}
