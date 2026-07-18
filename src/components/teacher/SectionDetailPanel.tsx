import type { SectionView } from "@/lib/teacher/viewModel";
import { INTERPRETATION_COLOR } from "@/lib/teacher/scoring";
import { DEFAULT_LOCALE, getMessages, type Locale } from "@/lib/i18n";
import { SectionIcon } from "./SectionIcon";
import { DistributionTable } from "./ResponseDistribution";
import styles from "./SectionDetailPanel.module.css";

/**
 * Detail panel for the selected section. Shows only section-level aggregate
 * information: name, raw average, percentage, valid response count, provisional
 * interpretation, the full five-category distribution (counts + percentages),
 * a collective interpretation, static human-authored actions, and example
 * reassessment info. It never shows individual answers, identifiers,
 * timestamps, question wording, question-level breakdowns, or subgroup filters.
 */
export function SectionDetailPanel({
  section,
  nextCheckInLabel,
  reviewNote,
  locale = DEFAULT_LOCALE,
}: {
  section: SectionView;
  nextCheckInLabel: string;
  reviewNote: string;
  locale?: Locale;
}) {
  const t = getMessages(locale).teacherDashboard;
  const interpretationColor = INTERPRETATION_COLOR[section.labelId];
  return (
    <section
      className={styles.panel}
      style={{ borderLeftColor: interpretationColor }}
      aria-labelledby="section-detail-heading"
    >
      <header className={styles.header}>
        <span
          className={styles.iconBadge}
          style={{ color: section.colorVar }}
        >
          <SectionIcon iconKey={section.iconKey} size={72} />
        </span>
        <div>
          <h3 id="section-detail-heading" className={styles.title}>
            {section.name}
          </h3>
          <p
            className={styles.labelPill}
            style={{ color: interpretationColor }}
          >
            {section.interpretationLabelText}
          </p>
        </div>
      </header>

      <dl className={styles.metrics}>
        <div className={styles.metric}>
          <dt>{t.sectionPercentage}</dt>
          <dd>{section.percentageDisplay}%</dd>
        </div>
        <div className={styles.metric}>
          <dt>{t.rawAverage}</dt>
          <dd>{section.rawAverageDisplay}</dd>
        </div>
        <div className={styles.metric}>
          <dt>{t.validResponses}</dt>
          <dd>{section.validResponsesLabel}</dd>
        </div>
      </dl>

      <div className={styles.block}>
        <DistributionTable categories={section.categories} locale={locale} />
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>{t.collectiveInterpretation}</h4>
        <p
          className={styles.interpretation}
          style={{ color: interpretationColor }}
        >
          {section.collectiveInterpretation}
        </p>
        <p className={styles.reviewNote}>{reviewNote}</p>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>{t.suggestedActions}</h4>
        <ul className={styles.actions}>
          {section.actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </div>

      <p className={styles.reassessment}>{nextCheckInLabel}</p>
    </section>
  );
}
