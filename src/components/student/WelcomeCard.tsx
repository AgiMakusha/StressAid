import Image from "next/image";
import { DEFAULT_LOCALE, getStudentCopy, type Locale } from "@/lib/i18n";
import styles from "./WelcomeCard.module.css";

interface WelcomeCardProps {
  onStart: () => void;
  locale?: Locale;
}

/**
 * Student welcome / introduction screen. The welcome text is shown first,
 * followed by the supplied decorative illustration (Illustration 1_v2.svg) —
 * used only here, never on question or completion screens. The illustration is
 * decorative (empty alt) and secondary to the text and Start button.
 */
export function WelcomeCard({ onStart, locale = DEFAULT_LOCALE }: WelcomeCardProps) {
  const { welcome } = getStudentCopy(locale);

  return (
    <section className={styles.card} aria-labelledby="welcome-heading">
      <div className={styles.intro}>
        <h1 id="welcome-heading" className={styles.heading}>
          {welcome.heading}
        </h1>
        <p className={styles.introText}>{welcome.intro}</p>
      </div>

      <div className={styles.illustration}>
        <Image
          src="/brand/Illustration 1_v2.svg"
          alt=""
          width={616}
          height={596}
          className={styles.illustrationImg}
          priority
          unoptimized
        />
      </div>

      <div className={styles.details}>
        <ul className={styles.reassurances}>
          {welcome.reassurances.map((item, index) => {
            const iconSrc = REASSURANCE_ICON_SRC[index] ?? REASSURANCE_ICON_SRC[0];
            return (
              <li key={item} className={styles.reassuranceItem}>
                <span className={styles.reassuranceIcon} aria-hidden="true">
                  <svg
                    viewBox="0 0 100 100"
                    className={styles.reassuranceGlyph}
                    role="img"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <image
                      href={iconSrc}
                      x="0"
                      y="0"
                      width="100"
                      height="100"
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            );
          })}
        </ul>

        <button type="button" className={styles.startButton} onClick={onStart}>
          {welcome.startButton}
        </button>
      </div>
    </section>
  );
}

/**
 * Official hand-drawn StressAid reassurance icons from `public/brand/Student`.
 * Order matches the localized welcome reassurances:
 *   0 heart (Icon 7) — no right or wrong answers
 *   1 anonymous (Icon 8) — we do not ask for your name
 *   2 group (Icon 9) — answers combined with your class
 *   3 lock (Icon 10) — teacher cannot see individual answers
 *   4 clock (Icon 11) — about 2 minutes
 * Icons are aria-hidden; the adjacent text carries the meaning, so colour is
 * never the sole indicator.
 */
const REASSURANCE_ICON_SRC: string[] = [
  "/brand/Student/Icon 7.svg",
  "/brand/Student/Icon 8.svg",
  "/brand/Student/Icon 9.svg",
  "/brand/Student/Icon 10.svg",
  "/brand/Student/Icon 11.svg",
];
