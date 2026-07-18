/**
 * Typed model for the frontend-only teacher dashboard.
 *
 * All data here is SYNTHETIC demonstration data. There is no backend, no
 * persistence, and no individual student information. Derived values (raw
 * averages, percentages, interpretation labels, overall score) are NEVER
 * hand-stored — they are computed from `distribution` counts by scoring.ts so
 * the data can never drift from the arithmetic.
 *
 * The below-threshold payload intentionally carries NO section aggregates: it
 * is structurally impossible to leak hidden results. A discriminated union on
 * `resultsAvailable` enforces this at the type level.
 */

import type { SectionId } from "@/lib/questionnaire";

export type InterpretationLabelId =
  | "strong"
  | "generallyPositive"
  | "monitor"
  | "needsAttention"
  | "strongConcern";

export type CampaignStatus = "live" | "closed" | "draft";

export interface ClassMeta {
  displayName: string;
  expectedStudentCount: number;
}

export interface CampaignMeta {
  title: string;
  status: CampaignStatus;
  responseCount: number;
  minimumResponseThreshold: number;
  /** Demo-only label; must not be presented as a real live-system timestamp. */
  lastUpdatedLabel: string;
  /** Demo-only, e.g. "Example next check-in: in six weeks". */
  nextCheckInLabel: string;
}

/** Response counts per answer category. Order is always Never → Always. */
export interface ResponseDistribution {
  never: number;
  rarely: number;
  sometimes: number;
  often: number;
  always: number;
}

/**
 * The only stored per-section datum is the raw distribution of counts. Every
 * score/label shown in the UI is derived from this via scoring.ts.
 */
export interface SectionAggregate {
  id: SectionId;
  validResponses: number;
  distribution: ResponseDistribution;
}

interface DashboardBase {
  isDemo: true;
  class: ClassMeta;
  campaign: CampaignMeta;
}

/** Below threshold: no aggregates exist on the payload at all. */
export interface BelowThresholdDashboard extends DashboardBase {
  resultsAvailable: false;
}

/** Threshold reached: exactly six section aggregates, canonical order. */
export interface ThresholdReachedDashboard extends DashboardBase {
  resultsAvailable: true;
  sections: SectionAggregate[];
}

export type TeacherDashboardData =
  | BelowThresholdDashboard
  | ThresholdReachedDashboard;

/** Derived at render time; not stored on the payload. */
export function areResultsAvailable(
  responseCount: number,
  minimumResponseThreshold: number,
): boolean {
  return responseCount >= minimumResponseThreshold;
}
