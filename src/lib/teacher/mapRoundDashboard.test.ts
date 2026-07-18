import { describe, expect, it } from "vitest";
import {
  mapRoundDashboard,
  type RoundDashboardResponse,
} from "./mapRoundDashboard";

const meta = {
  title: "Autumn check-in",
  classDisplayName: "Class 8B",
  roundDisplayName: "Round 1",
  status: "live",
  expectedParticipantCount: 24,
  aggregatesUpdatedOn: "2026-07-18",
};

describe("mapRoundDashboard", () => {
  it("maps a below-threshold payload with NO section aggregates", () => {
    const payload: RoundDashboardResponse = {
      resultsAvailable: false,
      responseCount: 6,
      threshold: 10,
      remaining: 4,
      meta,
    };

    const data = mapRoundDashboard(payload);

    expect(data.resultsAvailable).toBe(false);
    expect(data.isDemo).toBe(false);
    expect("sections" in data).toBe(false);
    expect(data.campaign.responseCount).toBe(6);
    expect(data.campaign.minimumResponseThreshold).toBe(10);
    expect(data.class.expectedStudentCount).toBe(24);
  });

  it("maps an at-threshold payload into six canonical section aggregates", () => {
    const payload: RoundDashboardResponse = {
      resultsAvailable: true,
      responseCount: 12,
      threshold: 10,
      meta,
      sections: [
        { sectionId: "mood", never: 1, rarely: 2, sometimes: 3, often: 4, always: 2 },
        { sectionId: "safety", never: 0, rarely: 0, sometimes: 2, often: 5, always: 5 },
        { sectionId: "engagement", never: 0, rarely: 1, sometimes: 1, often: 5, always: 5 },
        { sectionId: "fomo", never: 3, rarely: 3, sometimes: 3, often: 2, always: 1 },
        { sectionId: "socialAspects", never: 1, rarely: 1, sometimes: 4, often: 4, always: 2 },
        { sectionId: "predictability", never: 0, rarely: 0, sometimes: 1, often: 4, always: 7 },
      ],
    };

    const data = mapRoundDashboard(payload);

    expect(data.resultsAvailable).toBe(true);
    if (!data.resultsAvailable) throw new Error("expected results");

    expect(data.sections).toHaveLength(6);
    expect(data.sections.map((s) => s.id)).toEqual([
      "mood",
      "safety",
      "engagement",
      "fomo",
      "socialAspects",
      "predictability",
    ]);

    const mood = data.sections[0];
    expect(mood.validResponses).toBe(12); // 1+2+3+4+2
    expect(mood.distribution).toEqual({
      never: 1,
      rarely: 2,
      sometimes: 3,
      often: 4,
      always: 2,
    });
  });

  it("maps closed status and coarse update label without a precise timestamp", () => {
    const data = mapRoundDashboard({
      resultsAvailable: false,
      responseCount: 0,
      threshold: 10,
      remaining: 10,
      meta: { ...meta, status: "closed", aggregatesUpdatedOn: null },
    });

    expect(data.campaign.status).toBe("closed");
    expect(data.campaign.lastUpdatedLabel).toBe("Awaiting first responses");
    // No time-of-day precision anywhere in the label.
    expect(data.campaign.lastUpdatedLabel).not.toMatch(/\d{2}:\d{2}/);
  });
});
