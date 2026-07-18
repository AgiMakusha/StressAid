import type { ReactNode } from "react";
import Image from "next/image";
import { BrandHeader } from "./BrandHeader";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import styles from "./PageShell.module.css";

interface PageShellProps {
  children: ReactNode;
  /**
   * Content width variant. "default" keeps the mobile-first student column;
   * "wide" opts into the roomier teacher-dashboard column. This is an explicit,
   * reusable prop rather than a route-specific CSS override.
   */
  variant?: "default" | "wide";
  /**
   * Whether to show the EN / IT interface-language switcher. Hidden on the
   * student questionnaire, whose language always follows the campaign/round.
   */
  showLocaleSwitcher?: boolean;
}

/**
 * Responsive page shell used across student (mobile-first) and teacher
 * (desktop) screens. Provides the StressAid product header, a centred main
 * content column, and a compact footer carrying the secondary SHU2026 event
 * attribution. Keeping SHU2026 in the footer (never inside content cards)
 * ensures it reads as event attribution, not as the owner of StressAid.
 */
export async function PageShell({
  children,
  variant = "default",
  showLocaleSwitcher = true,
}: PageShellProps) {
  const locale = await getLocale();
  const m = getMessages(locale);
  const mainClassName =
    variant === "wide" ? `${styles.main} ${styles.mainWide}` : styles.main;
  return (
    <div className={styles.shell}>
      {showLocaleSwitcher ? (
        <div className={styles.utilityBar}>
          <LanguageSwitcher />
        </div>
      ) : null}
      <BrandHeader />
      <main className={mainClassName}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.attribution}>
          <span className={styles.attributionLabel}>{m.footer.createdDuring}</span>
          <Image
            src="/brand/shu2026-logo.png"
            alt="Social Hackathon Umbria 2026"
            width={300}
            height={61}
            className={styles.shuLogo}
            unoptimized
          />
        </div>
        <p className={styles.footerText}>{m.footer.text}</p>
      </footer>
    </div>
  );
}
