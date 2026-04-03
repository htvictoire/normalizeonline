import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/config";
import { routePathnames } from "./i18n/routes";

export default createMiddleware({
  locales,
  defaultLocale,
  pathnames: routePathnames,
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
