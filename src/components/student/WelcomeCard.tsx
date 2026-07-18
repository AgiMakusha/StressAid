import type { ReactNode } from "react";
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
            const decor = REASSURANCE_ICONS[index] ?? REASSURANCE_ICONS[0];
            return (
              <li key={item} className={styles.reassuranceItem}>
                <span
                  className={styles.reassuranceIcon}
                  style={{ color: decor.color }}
                  aria-hidden="true"
                >
                  {decor.icon}
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
 * Decorative icons for the reassurance bullets, coloured from the project
 * palette. Order matches the localized welcome reassurances. Icons are
 * aria-hidden; the adjacent text carries the meaning, so colour is never the
 * sole indicator.
 */
const REASSURANCE_ICONS: { color: string; icon: ReactNode }[] = [
  // No right or wrong answers → heart
  {
    color: "var(--shu-magenta)",
    icon: (
      <IconFrame>
        <path d="M12 20s-6.5-4.2-9-8.1C1.4 9.1 2.7 6 6 6c1.9 0 3.1 1.1 3.9 2.2C10.8 7.1 12 6 13.9 6c3.3 0 4.6 3.1 3 5.9C18.5 15.8 12 20 12 20z" />
      </IconFrame>
    ),
  },
  // We do not ask for your name → anonymous person
  {
    color: "var(--shu-orange)",
    icon: (
      <IconFrame>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" />
        <path d="M4 4 20 20" />
      </IconFrame>
    ),
  },
  // Your answers are combined with your class → group of people
  {
    color: "var(--shu-green)",
    icon: (
      <IconFrame>
        <circle cx="9" cy="9" r="3" />
        <path d="M3.5 19c0-3 2.5-4.8 5.5-4.8s5.5 1.8 5.5 4.8" />
        <circle cx="17" cy="8.5" r="2.4" />
        <path d="M15.6 13.6c2.4.2 4.4 1.9 4.4 4.4" />
      </IconFrame>
    ),
  },
  // Your teacher cannot see your individual answers → lock
  {
    color: "var(--shu-blue)",
    icon: (
      <IconFrame>
        <rect x="5" y="10.5" width="14" height="9" rx="2" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      </IconFrame>
    ),
  },
  // About 2 minutes → clock
  {
    color: "var(--shu-purple)",
    icon: (
      <IconFrame>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4.2l3 1.8" />
      </IconFrame>
    ),
  },
];

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}
