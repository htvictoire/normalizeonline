import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { formats } from "@/i18n/formats";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;
  const messages = await getMessages({ locale: resolvedLocale });

  return (
    <NextIntlClientProvider locale={resolvedLocale} messages={messages} formats={formats}>
      <Header />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
