import type { Metadata } from "next";
import { locales, type Locale } from "./config";
import { type RouteKey, getRouteHref } from "./routes";

const SITE_URL = "https://normalizeonline.com";

export const buildUrl = (path: string) => `${SITE_URL}${path}`;

export const buildAlternates = (
  route: RouteKey,
  locale: Locale,
  params?: Record<string, string>,
  localeSlugs?: Partial<Record<Locale, string>>,
) => {
  const languages = Object.fromEntries(
    locales.map((lang) => {
      const localeParams =
        localeSlugs?.[lang] != null
          ? { ...params, slug: localeSlugs[lang] }
          : params;
      return [lang, buildUrl(getRouteHref(route, lang, localeParams))];
    }),
  );

  return {
    canonical: buildUrl(getRouteHref(route, locale, params)),
    languages: {
      ...languages,
      "x-default": buildUrl(getRouteHref(route, "en", localeSlugs?.en != null ? { ...params, slug: localeSlugs.en } : params)),
    },
  };
};

export const buildMetadata = (params: {
  route: RouteKey;
  locale: Locale;
  dynamicParams?: Record<string, string>;
  localeSlugs?: Partial<Record<Locale, string>>;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  ogImage?: string;
  indexable?: boolean;
}): Metadata => {
  const image = params.ogImage ?? `${SITE_URL}/og-image.png`;
  return {
  metadataBase: new URL(SITE_URL),
  title: params.title,
  description: params.description,
  alternates: buildAlternates(params.route, params.locale, params.dynamicParams, params.localeSlugs),
  openGraph: {
    title: params.ogTitle ?? params.title,
    description: params.ogDescription ?? params.description,
    url: buildUrl(getRouteHref(params.route, params.locale, params.dynamicParams)),
    siteName: "Normalize",
    locale: params.locale,
    alternateLocale: locales.filter((l) => l !== params.locale),
    images: [{ url: image, width: 1200, height: 630, alt: params.ogTitle ?? params.title }],
    type: params.ogType ?? "website",
    ...(params.publishedTime ? { publishedTime: params.publishedTime } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: params.ogTitle ?? params.title,
    description: params.ogDescription ?? params.description,
    images: [image],
    creator: "@htvictoire",
  },
  robots: {
    index: params.indexable ?? true,
    follow: true,
  },
  };
};
