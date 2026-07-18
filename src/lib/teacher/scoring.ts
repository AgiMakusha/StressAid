/**
 * Deterministic scoring utilities for the teacher dashboard.
 *
 * All arithmetic uses full numeric precision. Rounding happens ONLY in the
 * display helpers at the very end — interpretation labels are always assigned
 * from the unrounded percentage. No models, heuristics, or inference.
 */

import { ANSWER_OPTIONS, type ResponseValue } from "@/lib/questionnaire";
import type {
  InterpretationLabelId,
  ResponseDistribution,
  SectionAggregate,
} from "./types";

/** Ordered answer categories (Never → Always) with their score + colour. */
export const DISTRIBUTION_CATEGORIES: readonly {
  key: keyof ResponseDistribution;
  value: ResponseValue;
  label: string;
  colorVar: string;
}[] = ANSWER_OPTIONS.map((option) => ({
  key: option.id as keyof ResponseDistribution,
  value: option.value,
  label: option.label,
  colorVar: option.colorVar,
}));

export function distributionTotal(distribution: ResponseDistribution): number {
  return (
    distribution.never +
    distribution.rarely +
    distribution.sometimes +
    distribution.often +
    distribution.always
  );
}

/** Section raw average on the 0–4 scale (full precision). */
export function rawAverage(section: SectionAggregate): number {
  const total = distributionTotal(section.distribution);
  if (total === 0) return 0;
  const weightedSum = DISTRIBUTION_CATEGORIES.reduce(
    (sum, category) => sum + category.value * section.distribution[category.key],
    0,
  );
  return weightedSum / total;
}

/** Section percentage = rawAverage / 4 * 100 (full precision). */
export function sectionPercentage(section: SectionAggregate): number {
  return (rawAverage(section) / 4) * 100;
}

/** Overall score = average of the six section percentages (full precision). */
export function overallScore(sections: readonly SectionAggregate[]): number {
  if (sections.length === 0) return 0;
  const sum = sections.reduce(
    (acc, section) => acc + sectionPercentage(section),
    0,
  );
  return sum / sections.length;
}

/**
 * Provisional collective interpretation label, assigned from the UNROUNDED
 * percentage. These are display rules only — not validated thresholds.
 */
export function interpretationLabel(percentage: number): InterpretationLabelId {
  if (percentage >= 80) return "strong";
  if (percentage >= 65) return "generallyPositive";
  if (percentage >= 50) return "monitor";
  if (percentage >= 35) return "needsAttention";
  return "strongConcern";
}

export const INTERPRETATION_TEXT: Record<InterpretationLabelId, string> = {
  strong: "Strong",
  generallyPositive: "Generally positive",
  monitor: "Monitor",
  needsAttention: "Needs attention",
  strongConcern: "Strong concern",
};

export function interpretationText(percentage: number): string {
  return INTERPRETATION_TEXT[interpretationLabel(percentage)];
}

/** Per-category percentage of the section total (full precision). */
export function categoryPercentage(
  distribution: ResponseDistribution,
  key: keyof ResponseDistribution,
): number {
  const total = distributionTotal(distribution);
  if (total === 0) return 0;
  return (distribution[key] / total) * 100;
}

/**
 * The initially selected section: the lowest calculated percentage. On a tie,
 * the first in the given (canonical) order wins.
 */
export function lowestScoringSectionId(
  sections: readonly SectionAggregate[],
): SectionAggregate["id"] | null {
  if (sections.length === 0) return null;
  let lowest = sections[0];
  let lowestPct = sectionPercentage(lowest);
  for (let i = 1; i < sections.length; i += 1) {
    const pct = sectionPercentage(sections[i]);
    if (pct < lowestPct) {
      lowest = sections[i];
      lowestPct = pct;
    }
  }
  return lowest.id;
}

/* ---- Display-only rounding helpers (never feed calculations) ---- */

/** Raw average with two decimals, e.g. "1.67". */
export function formatRawAverage(value: number): string {
  return value.toFixed(2);
}

/** Whole-number percentage, e.g. 42. */
export function roundPercentage(value: number): number {
  return Math.round(value);
}
