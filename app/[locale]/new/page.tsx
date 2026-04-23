import { getTranslations } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { buildMetadata } from "@/i18n/seo";
import UploadPad from "@/app/components/home/upload-pad";

type PageParams = { readonly params: Promise<{ readonly locale: string }> };

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildMetadata({
    route: "NEW",
    locale: locale as Locale,
    title: t("newPage.seo.title"),
    description: t("newPage.seo.description"),
    ogTitle: t("newPage.seo.ogTitle"),
    ogDescription: t("newPage.seo.ogDescription"),
    indexable: true,
  });
}

export default async function NewUploadPage({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const highlights = ["review", "artifacts", "retention"] as const;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <section className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
          {t("newPage.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
          {t("newPage.description")}
        </p>
      </section>

      <section className="mt-10 w-full">
        <UploadPad />
      </section>
<section className="mt-12 w-full">
  <div className="grid gap-0 lg:grid-cols-2">
    <div className="lg:pr-12">
      {highlights.map((key) => (
        <div key={key}>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[#32D3B0]">
              {t(`newPage.highlights.${key}.label`)}
            </p>
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              {t(`newPage.highlights.${key}.title`)}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">
              {t(`newPage.highlights.${key}.text`)}
            </p>
          </div>
        </div>
      ))}
    </div>
    <aside>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#32D3B0]">
        {t("newPage.summary.label")}
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">
        {t("newPage.summary.title")}
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink-muted">
        {t("newPage.summary.text")}
      </p>
      <div className="mt-6 space-y-4">
        {(["noAccount", "singleFlow", "exports"] as const).map((key) => (
          <div key={key}>
            <p className="text-sm font-medium text-ink">
              {t(`newPage.summary.items.${key}.title`)}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink-muted">
              {t(`newPage.summary.items.${key}.text`)}
            </p>
          </div>
        ))}
      </div>
    </aside>
  </div>
</section>
    </main>
  );
}
