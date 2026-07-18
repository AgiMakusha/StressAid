import Image from "next/image";
import Link from "next/link";
import styles from "./BrandHeader.module.css";

/**
 * Brand header showing the StressAid product identity and the SHU2026 event
 * attribution as two visually separate logos. The logos are rendered at their
 * original aspect ratios and must never be redrawn, recoloured, distorted,
 * cropped, or merged (see stressaid-mvp guardrails).
 */
export function BrandHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.productLink} aria-label="StressAid home">
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
      </div>
    </header>
  );
}
