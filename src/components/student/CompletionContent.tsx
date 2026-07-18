import Image from "next/image";
import Link from "next/link";
import { studentCopy } from "@/lib/studentCopy";
import styles from "./CompletionContent.module.css";

/**
 * Generic completion screen shown to every student equally. It intentionally
 * contains NO individual score, section score, risk label, result
 * classification, or personalised interpretation/recommendation. The support
 * message is static and identical for all participants.
 *
 * Uses the supplied decorative completion illustration (Illustration 2_v2.svg)
 * — shown only here, never on the welcome or question screens. The link returns
 * to the landing page, never back into the completed questionnaire.
 */
export function CompletionContent() {
  const { completion } = studentCopy;

  return (
    <section className={styles.card} aria-labelledby="completion-heading">
      <h1 id="completion-heading" className={styles.heading}>
        {completion.heading}
      </h1>

      <div className={styles.illustration}>
        <Image
          src="/brand/Illustration 2_v2.svg"
          alt=""
          width={545}
          height={596}
          className={styles.illustrationImg}
          priority
          unoptimized
        />
      </div>

      <div className={styles.content}>
        <p className={styles.message}>{completion.message}</p>
        <p className={styles.collective}>{completion.collective}</p>

        <p className={styles.support}>{completion.support}</p>

        <Link href="/" className={styles.homeLink}>
          {completion.homeLink}
        </Link>
      </div>
    </section>
  );
}
