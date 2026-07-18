/**
 * Builds a display-ready view model from a threshold-reached dashboard.
 * Everything is derived from the raw distributions via scoring.ts — no values
 * are read from storage. Interpretation labels come from the UNROUNDED
 * percentage; rounding lives only in the formatting fields used for display.
 */

import type { AnswerOptionId, SectionId } from "@/lib/questionnaire";
import {
  DISTRIBUTION_CATEGORIES,
  categoryPercentage,
  formatRawAverage,
  interpretationLabel,
  lowestScoringSectionId,
  overallScore,
  rawAverage,
  roundPercentage,
  sectionPercentage,
} from "./scoring";
import { getSectionMeta } from "./sections";
import {
  DEFAULT_LOCALE,
  getAnswerLabel,
  getInterpretationLabelText,
  getResponsibleReviewNote,
  getSectionActions,
  getSectionInterpretation,
  getSectionName,
  getStudentsLabel,
  type Locale,
} from "@/lib/i18n";
import type {
  InterpretationLabelId,
  ThresholdReachedDashboard,
} from "./types";

export interface CategoryView {
  key: string;
  label: string;
  colorVar: string;
  count: number;
  /** Localised count label, e.g. "5 students" / "5 studenti". */
  countLabel: string;
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
  /** Localised valid-response label, e.g. "18 students" / "18 studenti". */
  validResponsesLabel: string;
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
  /** Localised shared caution shown with every section's interpretation. */
  responsibleReviewNote: string;
  /** Dynamically the lowest-scoring section (canonical order tie-break). */
  defaultSelectedSectionId: SectionId;
}

/**
 * Builds the display-ready view model. `locale` controls the language of all
 * derived text (section names, interpretation labels, collective
 * interpretations, suggested actions, answer labels, and count labels).
 * English is the default so existing callers are unchanged.
 */
export function buildDashboardView(
  data: ThresholdReachedDashboard,
  locale: Locale = DEFAULT_LOCALE,
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
          label: getAnswerLabel(locale, category.key as AnswerOptionId),
          colorVar: category.colorVar,
          count,
          countLabel: getStudentsLabel(count, locale),
          percentage: categoryPct,
          percentageDisplay: categoryPct.toFixed(1),
        };
      },
    );

    return {
      id: section.id,
      name: getSectionName(locale, section.id),
      colorVar: meta.colorVar,
      iconKey: meta.iconKey,
      validResponses: section.validResponses,
      validResponsesLabel: getStudentsLabel(section.validResponses, locale),
      rawAverage: avg,
      percentage: pct,
      labelId,
      rawAverageDisplay: formatRawAverage(avg),
      percentageDisplay: roundPercentage(pct),
      interpretationLabelText: getInterpretationLabelText(locale, labelId),
      collectiveInterpretation: getSectionInterpretation(
        locale,
        section.id,
        labelId,
      ),
      actions: getSectionActions(locale, section.id),
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
    overallInterpretationText: getInterpretationLabelText(
      locale,
      interpretationLabel(overall),
    ),
    responsibleReviewNote: getResponsibleReviewNote(locale),
    defaultSelectedSectionId,
  };
}

/** "1 student" / "0 students" / "5 students" — grammatically correct. */
export function studentsLabel(count: number): string {
  return count === 1 ? "1 student" : `${count} students`;
}
