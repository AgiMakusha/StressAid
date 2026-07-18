import type { CategoryView } from "@/lib/teacher/viewModel";
import {
  DEFAULT_LOCALE,
  getMessages,
  type Locale,
} from "@/lib/i18n";
import styles from "./ResponseDistribution.module.css";

/**
 * Compact stacked bar for the section overview list. Widths use the fixed
 * response colours, but each segment also carries a text title and the full
 * counts/percentages are always available in the accompanying detail table
 * (never hover-only).
 */
export function DistributionBar({
  categories,
  locale = DEFAULT_LOCALE,
}: {
  categories: CategoryView[];
  locale?: Locale;
}) {
  const percentWord = getMessages(locale).teacherDashboard.percentWord;
  return (
    <div
      className={styles.bar}
      role="img"
      aria-label={categories
        .map(
          (category) =>
            `${category.label}: ${category.count} (${category.percentageDisplay} ${percentWord})`,
        )
        .join(", ")}
    >
      {categories.map((category) =>
        category.percentage > 0 ? (
          <span
            key={category.key}
            className={styles.barSegment}
            style={{
              width: `${category.percentage}%`,
              backgroundColor: category.colorVar,
            }}
          />
        ) : null,
      )}
    </div>
  );
}

/**
 * Accessible, always-visible distribution table for the detail panel. Shows
 * answer label, response count, and percentage for every one of the five
 * categories — as visible text, not hidden behind hover or focus.
 */
export function DistributionTable({
  categories,
  locale = DEFAULT_LOCALE,
}: {
  categories: CategoryView[];
  locale?: Locale;
}) {
  const t = getMessages(locale).teacherDashboard;
  return (
    <table className={styles.table}>
      <caption className={styles.caption}>{t.distributionCaption}</caption>
      <colgroup>
        <col className={styles.answerCol} />
        <col className={styles.numCol} />
        <col className={styles.numCol} />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">{t.colAnswer}</th>
          <th scope="col">{t.colResponses}</th>
          <th scope="col">{t.colPercentage}</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.key}>
            <th scope="row" className={styles.answerCell}>
              <span
                className={styles.swatch}
                style={{ backgroundColor: category.colorVar }}
                aria-hidden="true"
              />
              {category.label}
            </th>
            <td>{category.countLabel}</td>
            <td>{category.percentageDisplay}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
