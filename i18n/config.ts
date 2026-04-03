export const locales = ["en", "fr"] as const;
export const defaultLocale = "en";
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};
