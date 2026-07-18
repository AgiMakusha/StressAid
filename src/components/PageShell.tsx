import type { ReactNode } from "react";
import { BrandHeader } from "./BrandHeader";
import styles from "./PageShell.module.css";

interface PageShellProps {
  children: ReactNode;
}

/**
 * Responsive page shell used across student (mobile-first) and teacher
 * (desktop) screens. Provides the shared brand header, a centred main content
 * column, and a footer with SHU2026 attribution.
 */
export function PageShell({ children }: PageShellProps) {
  return (
    <div className={styles.shell}>
      <BrandHeader />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Created during Social Hackathon Umbria 2026, organised by EGInA in
          Cascia, Italy. StressAid is a privacy-first school environment
          feedback tool.
        </p>
      </footer>
    </div>
  );
}
