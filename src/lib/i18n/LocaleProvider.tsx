"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "./locale";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/**
 * Makes the current interface language available to client components. The
 * value is seeded on the server from the locale cookie (see server.ts) so the
 * initial client render matches the server render.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}
