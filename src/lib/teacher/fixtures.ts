/**
 * Synthetic demonstration fixtures for the teacher dashboard. There is no
 * backend: these are typed example classes only.
 *
 * IMPORTANT: only raw response-count distributions are stored. No averages,
 * percentages, interpretation labels, or overall scores are hand-written here —
 * they are always derived by scoring.ts. The below-threshold fixture carries NO
 * section aggregates at all (enforced by the discriminated union), so no hidden
 * results can leak into the DOM.
 */

import type {
  BelowThresholdDashboard,
  SectionAggregate,
  ThresholdReachedDashboard,
} from "./types";

/** Each section's counts sum to 18 valid responses. */
const SECTIONS: SectionAggregate[] = [
  {
    id: "mood",
    validResponses: 18,
    distribution: { never: 2, rarely: 2, sometimes: 4, often: 6, always: 4 },
  },
  {
    id: "safety",
    validResponses: 18,
    distribution: { never: 4, rarely: 5, sometimes: 5, often: 3, always: 1 },
  },
  {
    id: "engagement",
    validResponses: 18,
    distribution: { never: 1, rarely: 2, sometimes: 4, often: 6, always: 5 },
  },
  {
    id: "fomo",
    validResponses: 18,
    distribution: { never: 3, rarely: 4, sometimes: 5, often: 4, always: 2 },
  },
  {
    id: "socialAspects",
    validResponses: 18,
    distribution: { never: 2, rarely: 3, sometimes: 4, often: 5, always: 4 },
  },
  {
    id: "predictability",
    validResponses: 18,
    distribution: { never: 1, rarely: 1, sometimes: 3, often: 6, always: 7 },
  },
];

/** Threshold reached: 18 responses ≥ minimum of 10, six aggregates present. */
export const THRESHOLD_REACHED_DASHBOARD: ThresholdReachedDashboard = {
  isDemo: true,
  resultsAvailable: true,
  class: {
    displayName: "Class 8B — Demo",
    expectedStudentCount: 24,
  },
  campaign: {
    title: "Autumn class environment check-in",
    status: "live",
    responseCount: 18,
    minimumResponseThreshold: 10,
    lastUpdatedLabel: "Demo snapshot",
    nextCheckInLabel: "Example next check-in: in six weeks",
  },
  sections: SECTIONS,
};

/** Below threshold: 6 responses < minimum of 10, NO aggregates on payload. */
export const BELOW_THRESHOLD_DASHBOARD: BelowThresholdDashboard = {
  isDemo: true,
  resultsAvailable: false,
  class: {
    displayName: "Class 8B — Demo",
    expectedStudentCount: 24,
  },
  campaign: {
    title: "Autumn class environment check-in",
    status: "live",
    responseCount: 6,
    minimumResponseThreshold: 10,
    lastUpdatedLabel: "Demo snapshot",
    nextCheckInLabel: "Example next check-in: in six weeks",
  },
};
