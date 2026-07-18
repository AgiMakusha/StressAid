/**
 * Builds a display-ready view model from a threshold-reached dashboard.
 * Everything is derived from the raw distributions via scoring.ts — no values
 * are read from storage. Interpretation labels come from the UNROUNDED
 * percentage; rounding lives only in the formatting fields used for display.
 */

import type { SectionId } from "@/lib/questionnaire";
import {
  DISTRIBUTION_CATEGORIES,
  categoryPercentage,
  formatRawAverage,
  interpretationLabel,
  interpretationText,
  lowestScoringSectionId,
  overallScore,
  rawAverage,
  roundPercentage,
  sectionPercentage,
} from "./scoring";
import { sectionActions, sectionInterpretationText } from "./interventions";
import { getSectionMeta } from "./sections";
import type {
  InterpretationLabelId,
  ThresholdReachedDashboard,
} from "./types";

export interface CategoryView {
  key: string;
  label: string;
  colorVar: string;
  count: number;
  /** Full-precision percentage of the section total. */
  percentage: number;
  /** Display string with one decimal, e.g. "27.8". */
  percentageDisplay: string;
}

export interface SectionView {
  id: SectionId;
  name: string;
  colorVar: string;
  iconKey: ReturnType<typeof getSectionMeta>["iconKey"];
  validResponses: number;
  /** Full-precision values. */
  rawAverage: number;
  percentage: number;
  labelId: InterpretationLabelId;
  /** Display values (rounding is display-only). */
  rawAverageDisplay: string;
  percentageDisplay: number;
  interpretationLabelText: string;
  collectiveInterpretation: string;
  actions: readonly string[];
  categories: CategoryView[];
}

export interface DashboardView {
  sections: SectionView[];
  /** Full-precision overall score. */
  overallScore: number;
  overallScoreDisplay: number;
  overallLabelId: InterpretationLabelId;
  overallInterpretationText: string;
  /** Dynamically the lowest-scoring section (canonical order tie-break). */
  defaultSelectedSectionId: SectionId;
}

export function buildDashboardView(
  data: ThresholdReachedDashboard,
): DashboardView {
  const sections: SectionView[] = data.sections.map((section) => {
    const meta = getSectionMeta(section.id);
    const avg = rawAverage(section);
    const pct = sectionPercentage(section);
    const labelId = interpretationLabel(pct);

    const categories: CategoryView[] = DISTRIBUTION_CATEGORIES.map(
      (category) => {
        const count = section.distribution[category.key];
        const categoryPct = categoryPercentage(
          section.distribution,
          category.key,
        );
        return {
          key: category.key,
          label: category.label,
          colorVar: category.colorVar,
          count,
          percentage: categoryPct,
          percentageDisplay: categoryPct.toFixed(1),
        };
      },
    );

    return {
      id: section.id,
      name: meta.name,
      colorVar: meta.colorVar,
      iconKey: meta.iconKey,
      validResponses: section.validResponses,
      rawAverage: avg,
      percentage: pct,
      labelId,
      rawAverageDisplay: formatRawAverage(avg),
      percentageDisplay: roundPercentage(pct),
      interpretationLabelText: interpretationText(pct),
      collectiveInterpretation: sectionInterpretationText(section.id, labelId),
      actions: sectionActions(section.id),
      categories,
    };
  });

  const overall = overallScore(data.sections);
  const defaultSelectedSectionId = lowestScoringSectionId(data.sections);

  if (!defaultSelectedSectionId) {
    throw new Error("Threshold-reached dashboard must contain sections.");
  }

  return {
    sections,
    overallScore: overall,
    overallScoreDisplay: roundPercentage(overall),
    overallLabelId: interpretationLabel(overall),
    overallInterpretationText: interpretationText(overall),
    defaultSelectedSectionId,
  };
}

/** "1 student" / "0 students" / "5 students" — grammatically correct. */
export function studentsLabel(count: number): string {
  return count === 1 ? "1 student" : `${count} students`;
}
