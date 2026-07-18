import type { ReactNode } from "react";
import Image from "next/image";
import { BrandHeader } from "./BrandHeader";
import styles from "./PageShell.module.css";

interface PageShellProps {
  children: ReactNode;
  /**
   * Content width variant. "default" keeps the mobile-first student column;
   * "wide" opts into the roomier teacher-dashboard column. This is an explicit,
   * reusable prop rather than a route-specific CSS override.
   */
  variant?: "default" | "wide";
}

/**
 * Responsive page shell used across student (mobile-first) and teacher
 * (desktop) screens. Provides the StressAid product header, a centred main
 * content column, and a compact footer carrying the secondary SHU2026 event
 * attribution. Keeping SHU2026 in the footer (never inside content cards)
 * ensures it reads as event attribution, not as the owner of StressAid.
 */
export function PageShell({ children, variant = "default" }: PageShellProps) {
  const mainClassName =
    variant === "wide" ? `${styles.main} ${styles.mainWide}` : styles.main;
  return (
    <div className={styles.shell}>
      <BrandHeader />
      <main className={mainClassName}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.attribution}>
          <span className={styles.attributionLabel}>Created during</span>
          <Image
            src="/brand/shu2026-logo.png"
            alt="Social Hackathon Umbria 2026"
            width={300}
            height={61}
            className={styles.shuLogo}
            unoptimized
          />
        </div>
        <p className={styles.footerText}>
          Organised by EGInA in Cascia, Italy. StressAid is a privacy-first
          school environment feedback tool.
        </p>
      </footer>
    </div>
  );
}
