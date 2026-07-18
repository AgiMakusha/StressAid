import { DEFAULT_LOCALE, getStudentCopy, type Locale } from "@/lib/i18n";
import styles from "./ProgressIndicator.module.css";

interface ProgressIndicatorProps {
  /** 1-based current question number. */
  current: number;
  total: number;
  locale?: Locale;
}

/**
 * Visible "Question X of Y" text plus a progress bar. The same text is exposed
 * to assistive tech via an aria-live polite region so screen-reader users hear
 * progress changes as they navigate.
 */
export function ProgressIndicator({
  current,
  total,
  locale = DEFAULT_LOCALE,
}: ProgressIndicatorProps) {
  const label = getStudentCopy(locale).questions.progress(current, total);
  const percent = Math.round((current / total) * 100);

  return (
    <div className={styles.wrapper}>
      <p className={styles.text} aria-live="polite">
        {label}
      </p>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={label}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
