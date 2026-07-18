/**
 * Locale primitives for the bilingual (English / Italian) interface.
 *
 * English is always the fallback. Any unknown or invalid value resolves to
 * English. The selected interface language is remembered in a single
 * non-sensitive cookie (see LOCALE_COOKIE); it never stores identity,
 * questionnaire answers, or authentication information.
 */

export const LOCALES = ["en", "it"] as const;

export type Locale = (typeof LOCALES)[number];

/** English is the fallback for any invalid or missing value. */
export const DEFAULT_LOCALE: Locale = "en";

/** Non-sensitive cookie used only to remember the interface language. */
export const LOCALE_COOKIE = "stressaid_locale";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "it";
}

/** Resolve any raw value to a supported locale, falling back to English. */
export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Persists the chosen interface language in the non-sensitive locale cookie
 * (client-side only). One year, path-wide, Lax same-site. The value is only
 * "en" or "it" — never identity, answers, or auth information.
 */
export function writeLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
