"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels, localeFlags } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export default function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="text-border" aria-hidden="true">/</span>}
          <button
            type="button"
            disabled={l === locale}
            onClick={() => router.replace(pathname as never, { locale: l })}
            className={`text-xs transition-colors ${
              l === locale
                ? "font-semibold text-ink"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <span aria-hidden="true">{localeFlags[l]}</span> {localeLabels[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
