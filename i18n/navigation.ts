import { createNavigation } from "next-intl/navigation";
import { locales } from "./config";
import { routePathnames } from "./routes";

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  pathnames: routePathnames,
});
