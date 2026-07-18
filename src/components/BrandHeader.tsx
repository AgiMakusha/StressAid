import Image from "next/image";
import Link from "next/link";
import styles from "./BrandHeader.module.css";

interface BrandHeaderProps {
  frameworkAttribution: string;
}

/**
 * Product header showing the StressAid identity only. StressAid is the primary
 * brand; SHU2026 event attribution lives in the footer (see PageShell), so the
 * two identities stay separate and StressAid is clearly dominant.
 *
 * The logo is rendered at its original aspect ratio and must never be redrawn,
 * recoloured, distorted, cropped, or merged (see stressaid-mvp guardrails).
 */
export function BrandHeader({ frameworkAttribution }: BrandHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.productLink}
          aria-label="StressAid home"
        >
          <Image
            src="/brand/stressaid-logo.svg"
            alt="StressAid"
            width={511}
            height={303}
            className={styles.stressaidLogo}
            priority
            unoptimized
          />
        </Link>
        <p className={styles.frameworkAttribution}>{frameworkAttribution}</p>
      </div>
    </header>
  );
}
