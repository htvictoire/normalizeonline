import { locales, type Locale } from "./config";

export const ROUTE_DEFS = [
  {
    key: "HOME",
    base: "/",
    slugs: { en: "/", fr: "/" },
    indexable: true,
  },
  {
    key: "BLOG",
    base: "/blog",
    slugs: { en: "/blog", fr: "/blogue" },
    indexable: true,
  },
  {
    key: "BLOG_POST",
    base: "/blog/[slug]",
    slugs: { en: "/blog/[slug]", fr: "/blogue/[slug]" },
    indexable: true,
  },
  {
    key: "CONTACT",
    base: "/contact",
    slugs: { en: "/contact", fr: "/contact" },
    indexable: true,
  },
  {
    key: "PRIVACY",
    base: "/privacy",
    slugs: { en: "/privacy", fr: "/politique-de-confidentialite" },
    indexable: true,
  },
  {
    key: "TERMS",
    base: "/terms",
    slugs: { en: "/terms", fr: "/conditions-dutilisation" },
    indexable: true,
  },
  {
    key: "DATA_PROTECTION",
    base: "/data-protection",
    slugs: { en: "/data-protection", fr: "/protection-des-donnees" },
    indexable: true,
  },
  {
    key: "REVIEW",
    base: "/review/[id]",
    slugs: { en: "/review/[id]", fr: "/review/[id]" },
    indexable: false,
  },
  {
    key: "PROCESSING",
    base: "/process/[id]",
    slugs: { en: "/process/[id]", fr: "/process/[id]" },
    indexable: false,
  },
] as const;

export const ROUTES = Object.fromEntries(
  ROUTE_DEFS.map((route) => [route.key, route.base])
) as {
  [K in (typeof ROUTE_DEFS)[number]["key"]]: (typeof ROUTE_DEFS)[number]["base"];
};

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTE_DEFS)[number]["base"];

export const ROUTE_SLUGS = Object.fromEntries(
  ROUTE_DEFS.map((route) => [route.key, route.slugs])
) as Record<RouteKey, Record<Locale, string>>;

export const getRouteSlug = (route: RouteKey, locale: Locale) =>
  ROUTE_SLUGS[route][locale];

export const getRouteHref = (
  route: RouteKey,
  locale: Locale,
  params?: Record<string, string>,
) => {
  let slug = getRouteSlug(route, locale);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      slug = slug.replace(`[${key}]`, value);
    }
  }
  return slug === "/" ? `/${locale}` : `/${locale}${slug}`;
};

export const routePathnames = Object.fromEntries(
  ROUTE_DEFS.map((route) => [route.base, route.slugs])
) as Record<RoutePath, Record<Locale, string>>;

const ROUTE_INDEXABILITY = Object.fromEntries(
  ROUTE_DEFS.map((route) => [route.key, route.indexable])
) as Record<RouteKey, boolean>;

export const isRouteIndexable = (route: RouteKey) =>
  ROUTE_INDEXABILITY[route] ?? true;

export const localizedRouteEntries = locales.flatMap((locale) =>
  (Object.keys(ROUTES) as RouteKey[]).map((route) => ({
    locale,
    route,
    url: getRouteHref(route, locale),
    indexable: isRouteIndexable(route),
  }))
);
