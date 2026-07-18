import { describe, expect, it } from "vitest";
import {
  BELOW_THRESHOLD_DASHBOARD,
  THRESHOLD_REACHED_DASHBOARD,
} from "./fixtures";
import { QUESTIONNAIRE } from "@/lib/questionnaire";
import { distributionTotal } from "./scoring";
import { buildDashboardView } from "./viewModel";

describe("synthetic fixtures", () => {
  it("threshold-reached fixture has exactly six sections in canonical order", () => {
    const ids = THRESHOLD_REACHED_DASHBOARD.sections.map((s) => s.id);
    expect(ids).toEqual(QUESTIONNAIRE.map((s) => s.id));
  });

  it("threshold-reached: responseCount >= threshold", () => {
    const { responseCount, minimumResponseThreshold } =
      THRESHOLD_REACHED_DASHBOARD.campaign;
    expect(responseCount).toBeGreaterThanOrEqual(minimumResponseThreshold);
  });

  it("each section's distribution sums to its valid responses", () => {
    for (const section of THRESHOLD_REACHED_DASHBOARD.sections) {
      expect(distributionTotal(section.distribution)).toBe(
        section.validResponses,
      );
    }
  });

  it("below-threshold fixture contains NO section aggregates", () => {
    expect(BELOW_THRESHOLD_DASHBOARD.resultsAvailable).toBe(false);
    // Structurally there is no `sections` key at all.
    expect("sections" in BELOW_THRESHOLD_DASHBOARD).toBe(false);
  });

  it("below-threshold: responseCount < threshold", () => {
    const { responseCount, minimumResponseThreshold } =
      BELOW_THRESHOLD_DASHBOARD.campaign;
    expect(responseCount).toBeLessThan(minimumResponseThreshold);
  });

  it("does not hand-store derived scores on the fixture", () => {
    for (const section of THRESHOLD_REACHED_DASHBOARD.sections) {
      const keys = Object.keys(section);
      expect(keys).toEqual(["id", "validResponses", "distribution"]);
    }
  });
});

describe("view model derivation", () => {
  const view = buildDashboardView(THRESHOLD_REACHED_DASHBOARD);

  it("keeps canonical section order in the view", () => {
    expect(view.sections.map((s) => s.id)).toEqual(
      QUESTIONNAIRE.map((s) => s.id),
    );
  });

  it("selects Safety as the lowest-scoring section for this fixture", () => {
    expect(view.defaultSelectedSectionId).toBe("safety");
  });

  it("derives full-precision percentages that differ from their display rounding", () => {
    const safety = view.sections.find((s) => s.id === "safety")!;
    expect(safety.percentage).toBeCloseTo((28 / 18 / 4) * 100, 10);
    expect(safety.percentageDisplay).toBe(39);
    expect(safety.percentage).not.toBe(safety.percentageDisplay);
  });

  it("matches the documented example distribution string values", () => {
    const safety = view.sections.find((s) => s.id === "safety")!;
    const rarely = safety.categories.find((c) => c.key === "rarely")!;
    expect(rarely.count).toBe(5);
    expect(rarely.percentageDisplay).toBe("27.8");
  });

  it("derives the correct label for every synthetic section and overall", () => {
    const expected: Record<string, { pct: number; label: string }> = {
      mood: { pct: 61.1111, label: "Monitor" },
      safety: { pct: 38.8889, label: "Needs attention" },
      engagement: { pct: 66.6667, label: "Generally positive" },
      fomo: { pct: 47.2222, label: "Needs attention" },
      socialAspects: { pct: 58.3333, label: "Monitor" },
      predictability: { pct: 73.6111, label: "Generally positive" },
    };
    for (const section of view.sections) {
      const target = expected[section.id];
      expect(section.percentage).toBeCloseTo(target.pct, 3);
      expect(section.interpretationLabelText).toBe(target.label);
    }
    expect(view.overallScore).toBeCloseTo(57.6389, 3);
    expect(view.overallInterpretationText).toBe("Monitor");
  });
});
