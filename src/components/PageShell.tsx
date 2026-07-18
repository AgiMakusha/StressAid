import type { ReactNode } from "react";
import Image from "next/image";
import { BrandHeader } from "./BrandHeader";
import styles from "./PageShell.module.css";

interface PageShellProps {
  children: ReactNode;
}

/**
 * Responsive page shell used across student (mobile-first) and teacher
 * (desktop) screens. Provides the StressAid product header, a centred main
 * content column, and a compact footer carrying the secondary SHU2026 event
 * attribution. Keeping SHU2026 in the footer (never inside content cards)
 * ensures it reads as event attribution, not as the owner of StressAid.
 */
export function PageShell({ children }: PageShellProps) {
  return (
    <div className={styles.shell}>
      <BrandHeader />
      <main className={styles.main}>{children}</main>
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
