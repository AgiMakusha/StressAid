"use client";

import type { SectionView } from "@/lib/teacher/viewModel";
import type { SectionId } from "@/lib/questionnaire";
import { INTERPRETATION_COLOR } from "@/lib/teacher/scoring";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { SectionIcon } from "./SectionIcon";
import { DistributionBar } from "./ResponseDistribution";
import styles from "./SectionOverviewList.module.css";

interface SectionOverviewListProps {
  sections: SectionView[];
  selectedSectionId: SectionId;
  onSelect: (id: SectionId) => void;
  locale?: Locale;
}

/**
 * Compact section overview in canonical order (always Mood → Predictability).
 * Defaulting the detail panel to the lowest-scoring section never reorders this
 * list. Each row is a selectable control that pairs colour with an icon,
 * section name, percentage, interpretation label, and a stacked distribution
 * bar — so meaning never depends on colour alone.
 */
export function SectionOverviewList({
  sections,
  selectedSectionId,
  onSelect,
  locale = DEFAULT_LOCALE,
}: SectionOverviewListProps) {
  return (
    <ul className={styles.list}>
      {sections.map((section) => {
        const isSelected = section.id === selectedSectionId;
        return (
          <li key={section.id}>
            <button
              type="button"
              className={styles.row}
              data-selected={isSelected}
              aria-pressed={isSelected}
              style={{
                borderColor: section.colorVar,
                backgroundColor: isSelected
                  ? `color-mix(in srgb, ${section.colorVar} 14%, var(--ui-white))`
                  : undefined,
              }}
              onClick={() => onSelect(section.id)}
            >
              <span
                className={styles.iconBadge}
                style={{ color: section.colorVar }}
              >
                <SectionIcon iconKey={section.iconKey} size={68} />
              </span>
              <span className={styles.body}>
                <span className={styles.topLine}>
                  <span className={styles.name}>{section.name}</span>
                  <span className={styles.percent}>
                    {section.percentageDisplay}%
                  </span>
                </span>
                <span
                  className={styles.interpretation}
                  style={{ color: INTERPRETATION_COLOR[section.labelId] }}
                >
                  {section.interpretationLabelText}
                </span>
                <DistributionBar
                  categories={section.categories}
                  locale={locale}
                />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
