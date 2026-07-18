"use client";

import type { SectionView } from "@/lib/teacher/viewModel";
import type { SectionId } from "@/lib/questionnaire";
import { SectionIcon } from "./SectionIcon";
import { DistributionBar } from "./ResponseDistribution";
import styles from "./SectionOverviewList.module.css";

interface SectionOverviewListProps {
  sections: SectionView[];
  selectedSectionId: SectionId;
  onSelect: (id: SectionId) => void;
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
              onClick={() => onSelect(section.id)}
            >
              <span
                className={styles.iconBadge}
                style={{ color: section.colorVar }}
              >
                <SectionIcon iconKey={section.iconKey} size={22} />
              </span>
              <span className={styles.body}>
                <span className={styles.topLine}>
                  <span className={styles.name}>{section.name}</span>
                  <span className={styles.percent}>
                    {section.percentageDisplay}%
                  </span>
                </span>
                <span className={styles.interpretation}>
                  {section.interpretationLabelText}
                </span>
                <DistributionBar categories={section.categories} />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
