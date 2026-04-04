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
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero */}
        <h1 className="text-center text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
          {t("headline")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
          {t("subline")}
        </p>

        {/* Steps */}
        <section className="mt-10">
          <Steps />
        </section>
      </main>

      {/* Capabilities — full-width tinted band */}
      <section className="mt-10 border-b border-t border-[#E2E8F0] bg-[#F8FAFC] py-14 md:mt-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-3 sm:divide-x sm:divide-[#E2E8F0]">
            {(["scale", "types", "artifacts"] as const).map((key) => (
              <div key={key} className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#32D3B0]">
                  {t(`capabilities.${key}.label`)}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  {t(`capabilities.${key}.text`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-[#E2E8F0] pt-6 text-center">
            <p className="text-sm text-ink-muted">
              {t("openSource.text")}{" "}
              <a
                href="https://github.com/htvictoire/normalize"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink underline underline-offset-2 hover:text-brand"
              >
                {t("openSource.linkText")}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="py-10 md:py-12">
          <UploadPad />
        </section>
      </div>
    </>
  );
}
