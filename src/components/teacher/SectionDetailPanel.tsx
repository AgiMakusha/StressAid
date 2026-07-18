import type { SectionView } from "@/lib/teacher/viewModel";
import { studentsLabel } from "@/lib/teacher/viewModel";
import { RESPONSIBLE_REVIEW_NOTE } from "@/lib/teacher/interventions";
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
}: {
  section: SectionView;
  nextCheckInLabel: string;
}) {
  return (
    <section className={styles.panel} aria-labelledby="section-detail-heading">
      <header className={styles.header}>
        <span
          className={styles.iconBadge}
          style={{ color: section.colorVar }}
        >
          <SectionIcon iconKey={section.iconKey} size={26} />
        </span>
        <div>
          <h3 id="section-detail-heading" className={styles.title}>
            {section.name}
          </h3>
          <p className={styles.labelPill}>{section.interpretationLabelText}</p>
        </div>
      </header>

      <dl className={styles.metrics}>
        <div className={styles.metric}>
          <dt>Section percentage</dt>
          <dd>{section.percentageDisplay}%</dd>
        </div>
        <div className={styles.metric}>
          <dt>Raw average (0–4)</dt>
          <dd>{section.rawAverageDisplay}</dd>
        </div>
        <div className={styles.metric}>
          <dt>Valid responses</dt>
          <dd>{studentsLabel(section.validResponses)}</dd>
        </div>
      </dl>

      <div className={styles.block}>
        <DistributionTable categories={section.categories} />
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Collective interpretation</h4>
        <p className={styles.interpretation}>
          {section.collectiveInterpretation}
        </p>
        <p className={styles.reviewNote}>{RESPONSIBLE_REVIEW_NOTE}</p>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Suggested actions</h4>
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
