/**
 * Pure geometry helpers for the Class Environment Wheel — a six-sector radial
 * 100% stacked distribution donut.
 *
 * Section identity is encoded ONLY by fixed angular position (six equal 60°
 * sectors, canonical order). The five response colours encode the answer
 * distribution, radially, from the centre outward (Never innermost → Always
 * outermost). Band thickness is proportional to each category's share of the
 * section's valid responses; a 0-count category has zero thickness. All bands
 * of a section together fill the same fixed inner→outer ring as every other
 * section. Calculations use full precision; only final SVG coordinates are
 * rounded for stable SSR/CSR hydration.
 */

export const SECTION_ANGLE = 60; // Exactly six equal 60° sectors — never varies.
export const SECTION_COUNT = 6;

/**
 * Round to a fixed precision. Math.cos/Math.sin are not guaranteed to be
 * correctly rounded and can differ by 1 ULP between the server and browser
 * math libraries, which would cause an SSR hydration mismatch on serialised
 * SVG coordinates. Rounding makes the output deterministic.
 */
export function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

/** Sector angular bounds for a section index (top = -90°, clockwise). */
export function sectorAngles(index: number): { start: number; end: number } {
  const start = -90 + index * SECTION_ANGLE;
  return { start, end: start + SECTION_ANGLE };
}

export function polarToCartesian(
  cx: number,
  cy: number,
  angleDeg: number,
  radius: number,
): { x: number; y: number } {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: round(cx + radius * Math.cos(angleRad)),
    y: round(cy + radius * Math.sin(angleRad)),
  };
}

/** Annular sector path between two radii spanning [startAngle, endAngle]. */
export function annularSectorPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const oStart = polarToCartesian(cx, cy, startAngle, outerR);
  const oEnd = polarToCartesian(cx, cy, endAngle, outerR);
  const iEnd = polarToCartesian(cx, cy, endAngle, innerR);
  const iStart = polarToCartesian(cx, cy, startAngle, innerR);
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${iStart.x} ${iStart.y}`,
    "Z",
  ].join(" ");
}

export interface BandInput {
  key: string;
  label: string;
  colorVar: string;
  /** Response count for this category in the section. */
  count: number;
}

export interface RadialBand {
  key: string;
  label: string;
  colorVar: string;
  count: number;
  innerR: number;
  outerR: number;
  /** True only when the category has a non-zero count (visible thickness). */
  visible: boolean;
}

/**
 * Compute the concentric radial bands for one section sector.
 *
 * Boundaries are derived from cumulative counts over the section total, which
 * is mathematically identical to the derived distribution percentages
 * (percentage = count / total * 100) but guarantees the five bands together
 * fill the exact ring [holeR, outerR] with no floating drift. The band order
 * is preserved as given (Never → Always). Zero-count categories collapse to
 * zero thickness (innerR === outerR) and are marked not visible.
 */
export function computeRadialBands(
  categories: readonly BandInput[],
  total: number,
  holeR: number,
  outerR: number,
): RadialBand[] {
  const ring = outerR - holeR;
  let cumulative = 0;
  return categories.map((category) => {
    const innerR = total === 0 ? holeR : holeR + (cumulative / total) * ring;
    cumulative += category.count;
    const bandOuterR =
      total === 0 ? holeR : holeR + (cumulative / total) * ring;
    return {
      key: category.key,
      label: category.label,
      colorVar: category.colorVar,
      count: category.count,
      innerR,
      outerR: bandOuterR,
      visible: category.count > 0,
    };
  });
}
