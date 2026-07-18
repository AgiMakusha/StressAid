import { describe, expect, it } from "vitest";
import {
  SECTION_ANGLE,
  computeRadialBands,
  sectorAngles,
  type BandInput,
} from "./wheelGeometry";
import { buildDashboardView } from "./viewModel";
import { THRESHOLD_REACHED_DASHBOARD } from "./fixtures";

const HOLE_R = 56;
const OUTER_R = 135;

const view = buildDashboardView(THRESHOLD_REACHED_DASHBOARD);
const safety = view.sections.find((s) => s.id === "safety")!;
const safetyBands = computeRadialBands(
  safety.categories,
  safety.validResponses,
  HOLE_R,
  OUTER_R,
);

describe("sector geometry", () => {
  it("keeps six equal 60° sectors regardless of score", () => {
    for (let i = 0; i < 6; i += 1) {
      const { start, end } = sectorAngles(i);
      expect(end - start).toBe(60);
    }
    expect(SECTION_ANGLE).toBe(60);
  });

  it("places sectors in canonical positions starting at the top", () => {
    expect(sectorAngles(0).start).toBe(-90);
    expect(sectorAngles(5).start).toBe(-90 + 5 * 60);
  });
});

describe("radial bands", () => {
  it("orders bands Never → Rarely → Sometimes → Often → Always", () => {
    expect(safetyBands.map((b) => b.key)).toEqual([
      "never",
      "rarely",
      "sometimes",
      "often",
      "always",
    ]);
  });

  it("uses the inner→outer response-colour order magenta → orange → yellow → green → blue", () => {
    expect(safetyBands.map((b) => b.colorVar)).toEqual([
      "var(--response-never)",
      "var(--response-rarely)",
      "var(--response-sometimes)",
      "var(--response-often)",
      "var(--response-always)",
    ]);
  });

  it("puts Never innermost (at the hole edge) and Always outermost (at the ring edge)", () => {
    expect(safetyBands[0].key).toBe("never");
    expect(safetyBands[0].innerR).toBe(HOLE_R);
    expect(safetyBands[4].key).toBe("always");
    expect(safetyBands[4].outerR).toBeCloseTo(OUTER_R, 10);
  });

  it("derives band thickness from the distribution", () => {
    const ring = OUTER_R - HOLE_R;
    const rarely = safetyBands.find((b) => b.key === "rarely")!;
    // rarely count = 5 of 18
    expect(rarely.outerR - rarely.innerR).toBeCloseTo((5 / 18) * ring, 10);
  });

  it("fills the complete fixed ring across the five bands", () => {
    expect(safetyBands[0].innerR).toBe(HOLE_R);
    expect(safetyBands[safetyBands.length - 1].outerR).toBeCloseTo(OUTER_R, 10);
    // Bands are contiguous with no gaps or overlaps.
    for (let i = 1; i < safetyBands.length; i += 1) {
      expect(safetyBands[i].innerR).toBeCloseTo(safetyBands[i - 1].outerR, 10);
    }
  });

  it("gives a zero-count category zero thickness and marks it not visible", () => {
    const categories: BandInput[] = [
      { key: "never", label: "Never", colorVar: "a", count: 0 },
      { key: "rarely", label: "Rarely", colorVar: "b", count: 2 },
      { key: "sometimes", label: "Sometimes", colorVar: "c", count: 0 },
      { key: "often", label: "Often", colorVar: "d", count: 0 },
      { key: "always", label: "Always", colorVar: "e", count: 0 },
    ];
    const bands = computeRadialBands(categories, 2, HOLE_R, OUTER_R);
    expect(bands[0].innerR).toBe(bands[0].outerR); // never: 0 thickness
    expect(bands[0].visible).toBe(false);
    expect(bands[1].visible).toBe(true);
    expect(bands[1].outerR).toBeCloseTo(OUTER_R, 10); // rarely fills the rest
  });

  it("keeps identical inner/outer bounds for every section (geometry independent of score)", () => {
    for (const section of view.sections) {
      const bands = computeRadialBands(
        section.categories,
        section.validResponses,
        HOLE_R,
        OUTER_R,
      );
      expect(bands[0].innerR).toBe(HOLE_R);
      expect(bands[bands.length - 1].outerR).toBeCloseTo(OUTER_R, 10);
    }
  });
});
