"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  LOCALES,
  getMessages,
  useLocale,
  writeLocaleCookie,
  type Locale,
} from "@/lib/i18n";
import styles from "./LanguageSwitcher.module.css";

/**
 * Simple EN / IT interface-language switcher. It writes the selected language
 * to a single non-sensitive cookie and refreshes so server components re-render
 * in the chosen language. It never stores identity, answers, or auth state.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const m = getMessages(locale);

  const choose = (next: Locale) => {
    if (next === locale) return;
    writeLocaleCookie(next);
    startTransition(() => router.refresh());
  };

  return (
    <div className={styles.switcher} role="group" aria-label={m.switcher.ariaLabel}>
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          className={styles.button}
          data-active={option === locale}
          aria-pressed={option === locale}
          disabled={pending}
          onClick={() => choose(option)}
        >
          {m.switcher[option]}
        </button>
      ))}
    </div>
  );
}
