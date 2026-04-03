import { getTranslations } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { buildMetadata } from "@/i18n/seo";
import LegalPage from "@/app/components/legal-page";
import ContactForm from "@/app/components/contact-form";

type PageParams = { readonly params: Promise<{ readonly locale: string }> };

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({
    route: "CONTACT",
    locale: locale as Locale,
    title: t("seo.title"),
    description: t("seo.description"),
    ogTitle: t("seo.ogTitle"),
    ogDescription: t("seo.ogDescription"),
    indexable: true,
  });
}

export default async function ContactPage({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <LegalPage title={t("page.title")} lastUpdated={t("page.lastUpdated")}>
      <p>{t("page.intro")}</p>
      <ContactForm />
    </LegalPage>
  );
}
