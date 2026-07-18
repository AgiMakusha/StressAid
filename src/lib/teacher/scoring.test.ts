import { describe, expect, it } from "vitest";
import {
  categoryPercentage,
  interpretationLabel,
  lowestScoringSectionId,
  overallScore,
  rawAverage,
  roundPercentage,
  sectionPercentage,
} from "./scoring";
import type { SectionAggregate } from "./types";

const safety: SectionAggregate = {
  id: "safety",
  validResponses: 18,
  distribution: { never: 4, rarely: 5, sometimes: 5, often: 3, always: 1 },
};

describe("deterministic scoring", () => {
  it("computes raw average at full precision", () => {
    // weighted sum = 0*4 + 1*5 + 2*5 + 3*3 + 4*1 = 28; 28/18
    expect(rawAverage(safety)).toBeCloseTo(28 / 18, 10);
  });

  it("computes section percentage = average / 4 * 100 at full precision", () => {
    expect(sectionPercentage(safety)).toBeCloseTo((28 / 18 / 4) * 100, 10);
    // ~38.888..., NOT the rounded 39
    expect(sectionPercentage(safety)).not.toBe(39);
  });

  it("assigns interpretation labels from the unrounded percentage", () => {
    // A percentage of 34.9 rounds to 35 but must be treated as < 35.
    expect(interpretationLabel(34.9)).toBe("strongConcern");
    expect(interpretationLabel(35)).toBe("needsAttention");
    // 49.6 rounds to 50 (monitor) but unrounded is < 50 → needsAttention.
    expect(interpretationLabel(49.6)).toBe("needsAttention");
    expect(interpretationLabel(50)).toBe("monitor");
  });

  it("applies the approved interpretation boundaries exactly", () => {
    // 0–34.999… Strong concern | 35–49.999… Needs attention |
    // 50–64.999… Monitor | 65–79.999… Generally positive | 80–100 Strong
    expect(interpretationLabel(34.999)).toBe("strongConcern");
    expect(interpretationLabel(35)).toBe("needsAttention");
    expect(interpretationLabel(49.999)).toBe("needsAttention");
    expect(interpretationLabel(50)).toBe("monitor");
    expect(interpretationLabel(64.999)).toBe("monitor");
    expect(interpretationLabel(65)).toBe("generallyPositive");
    expect(interpretationLabel(79.999)).toBe("generallyPositive");
    expect(interpretationLabel(80)).toBe("strong");
  });

  it("labels Mood (61.111…) as Monitor, not Generally positive", () => {
    const moodPercentage = (44 / 18 / 4) * 100; // 61.111…
    expect(moodPercentage).toBeCloseTo(61.1111, 3);
    expect(interpretationLabel(moodPercentage)).toBe("monitor");
  });

  it("derives category percentage from counts", () => {
    expect(categoryPercentage(safety.distribution, "rarely")).toBeCloseTo(
      (5 / 18) * 100,
      10,
    );
  });

  it("rounds only for display and does not change the calculation", () => {
    const pct = sectionPercentage(safety);
    expect(roundPercentage(pct)).toBe(39);
    // The original value is unchanged / still not an integer.
    expect(Number.isInteger(pct)).toBe(false);
  });
});

describe("lowest-scoring section selection", () => {
  const sections: SectionAggregate[] = [
    {
      id: "mood",
      validResponses: 4,
      distribution: { never: 0, rarely: 0, sometimes: 0, often: 0, always: 4 },
    },
    {
      id: "safety",
      validResponses: 4,
      distribution: { never: 4, rarely: 0, sometimes: 0, often: 0, always: 0 },
    },
  ];

  it("selects the section with the lowest percentage", () => {
    expect(lowestScoringSectionId(sections)).toBe("safety");
  });

  it("breaks ties by canonical order (first wins)", () => {
    const tie: SectionAggregate[] = [
      {
        id: "mood",
        validResponses: 2,
        distribution: {
          never: 0,
          rarely: 2,
          sometimes: 0,
          often: 0,
          always: 0,
        },
      },
      {
        id: "safety",
        validResponses: 2,
        distribution: {
          never: 0,
          rarely: 2,
          sometimes: 0,
          often: 0,
          always: 0,
        },
      },
    ];
    expect(lowestScoringSectionId(tie)).toBe("mood");
  });
});

describe("overall score", () => {
  it("averages the section percentages at full precision", () => {
    const sections: SectionAggregate[] = [
      {
        id: "mood",
        validResponses: 1,
        distribution: { never: 0, rarely: 0, sometimes: 0, often: 0, always: 1 },
      },
      {
        id: "safety",
        validResponses: 1,
        distribution: { never: 1, rarely: 0, sometimes: 0, often: 0, always: 0 },
      },
    ];
    // (100 + 0) / 2
    expect(overallScore(sections)).toBe(50);
  });
});
