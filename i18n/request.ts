import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  const [common, home, blog, contact, privacy, terms, dataProtection, review, processing] =
    await Promise.all([
      import(`./messages/${locale}/common.json`),
      import(`./messages/${locale}/home.json`),
      import(`./messages/${locale}/blog.json`),
      import(`./messages/${locale}/contact.json`),
      import(`./messages/${locale}/privacy.json`),
      import(`./messages/${locale}/terms.json`),
      import(`./messages/${locale}/data-protection.json`),
      import(`./messages/${locale}/review.json`),
      import(`./messages/${locale}/processing.json`),
    ]);

  return {
    locale,
    messages: {
      ...common.default,
      home: home.default,
      blog: blog.default,
      contact: contact.default,
      privacy: privacy.default,
      terms: terms.default,
      dataProtection: dataProtection.default,
      review: review.default,
      processing: processing.default,
    },
  };
});
