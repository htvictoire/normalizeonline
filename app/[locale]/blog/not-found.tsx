import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function BlogNotFound() {
  const t = useTranslations("blog.notFound");

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">
        {t("heading")}
      </h1>
      <p className="mt-4 text-base leading-7 text-ink-muted">
        {t("description")}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas transition-colors hover:bg-brand-dark"
        >
          {t("backToBlog")}
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          {t("openNormalize")}
        </Link>
      </div>
    </main>
  );
}
