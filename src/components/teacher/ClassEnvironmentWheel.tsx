"use client";

import { SectionIcon } from "./SectionIcon";
import type { SectionView } from "@/lib/teacher/viewModel";
import type { SectionId } from "@/lib/questionnaire";
import {
  annularSectorPath,
  computeRadialBands,
  polarToCartesian,
  round,
  sectorAngles,
} from "@/lib/teacher/wheelGeometry";
import styles from "./ClassEnvironmentWheel.module.css";

interface ClassEnvironmentWheelProps {
  sections: SectionView[];
  selectedSectionId: SectionId;
  onSelect: (id: SectionId) => void;
  overallScoreDisplay: number;
  overallInterpretationText: string;
}

/* Layout constants. The viewBox leaves generous horizontal room so section
   labels sit just outside the ring without clipping. The donut stays circular
   because inner/outer radii are equal in both axes. */
const VB_WIDTH = 540;
const VB_HEIGHT = 430;
const CX = 280;
const CY = 210;
const HOLE_R = 56; // Centre hole — overall result only; no response colour here.
const OUTER_R = 135;
const LABEL_R = OUTER_R + 34;
const POP_OUT = 13; // Non-colour selected marker: sector nudges outward.

export function ClassEnvironmentWheel({
  sections,
  selectedSectionId,
  onSelect,
  overallScoreDisplay,
  overallInterpretationText,
}: ClassEnvironmentWheelProps) {
  return (
    <div className={styles.wheelWrap}>
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className={styles.wheel}
        role="group"
        aria-label="Class Environment Wheel. Six equal sections; each shows its response distribution from Never at the centre to Always at the outer edge. Select a section to view details."
      >
        {sections.map((section, index) => {
          const isSelected = section.id === selectedSectionId;
          const { start, end } = sectorAngles(index);
          const midAngle = start + (end - start) / 2;

          // Pop the whole sector (bands + hit area + label) outward when selected.
          const offset = isSelected
            ? polarToCartesian(0, 0, midAngle, POP_OUT)
            : { x: 0, y: 0 };
          const dx = round(offset.x);
          const dy = round(offset.y);

          const bands = computeRadialBands(
            section.categories,
            section.validResponses,
            HOLE_R,
            OUTER_R,
          );

          // Full-sector transparent hit area = the single interactive control.
          const hitPath = annularSectorPath(
            CX,
            CY,
            HOLE_R,
            OUTER_R,
            start,
            end,
          );

          const cosMid = Math.cos((midAngle * Math.PI) / 180);
          const anchorPoint = polarToCartesian(CX, CY, midAngle, LABEL_R);
          const textAnchor = cosMid >= 0 ? "start" : "end";
          const iconSize = 18;
          const iconX =
            textAnchor === "start"
              ? anchorPoint.x
              : round(anchorPoint.x - iconSize);
          const iconY = round(anchorPoint.y - iconSize - 16);

          const distributionDescription = section.categories
            .map((category) => `${category.label} ${category.percentageDisplay} percent`)
            .join(", ");

          return (
            <g
              key={section.id}
              className={styles.sector}
              transform={`translate(${dx} ${dy})`}
              data-selected={isSelected}
            >
              {/* Radial response bands — decorative; the sector as a whole is
                  the control, so bands never receive pointer/tab focus. */}
              {bands.map((band) =>
                band.visible ? (
                  <path
                    key={band.key}
                    d={annularSectorPath(
                      CX,
                      CY,
                      band.innerR,
                      band.outerR,
                      start,
                      end,
                    )}
                    fill={band.colorVar}
                    className={styles.band}
                    aria-hidden="true"
                  />
                ) : null,
              )}

              {/* One tab stop per section. Bands are not separate controls. */}
              <path
                d={hitPath}
                className={styles.hitArea}
                data-selected={isSelected}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${section.name}, ${section.percentageDisplay} percent, ${section.interpretationLabelText}. ${distributionDescription}. Select section.`}
                onClick={() => onSelect(section.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(section.id);
                  }
                }}
              />

              {/* Section label: icon + name + percentage, horizontal, outside
                  the ring. Colour is never the sole section identifier. */}
              <svg
                x={iconX}
                y={iconY}
                width={iconSize}
                height={iconSize}
                className={styles.labelIcon}
                style={{ color: section.colorVar }}
                aria-hidden="true"
              >
                <SectionIcon iconKey={section.iconKey} size={iconSize} />
              </svg>
              <text
                x={anchorPoint.x}
                y={anchorPoint.y}
                textAnchor={textAnchor}
                className={styles.labelText}
                data-selected={isSelected}
                style={isSelected ? { fill: section.colorVar } : undefined}
                aria-hidden="true"
              >
                <tspan className={styles.labelName}>{section.name}</tspan>
                <tspan
                  x={anchorPoint.x}
                  dy="1.15em"
                  className={styles.labelPercent}
                >
                  {section.percentageDisplay}%
                </tspan>
              </text>
            </g>
          );
        })}

        <circle
          cx={CX}
          cy={CY}
          r={HOLE_R - 4}
          className={styles.centerDisc}
        />
        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          className={styles.centerScore}
        >
          {overallScoreDisplay}%
        </text>
        <text
          x={CX}
          y={CY + 10}
          textAnchor="middle"
          className={styles.centerLabelSmall}
        >
          Overall
        </text>
        <text
          x={CX}
          y={CY + 28}
          textAnchor="middle"
          className={styles.centerInterpretation}
        >
          {overallInterpretationText}
        </text>
      </svg>

      <ResponseScaleLegend categories={sections[0]?.categories ?? []} />
    </div>
  );
}

/**
 * Always-visible legend explaining the radial order. It must not assume the
 * teacher already knows the colour order, so it states "From the centre
 * outward" and lists Never (innermost) → Always (outermost).
 */
function ResponseScaleLegend({
  categories,
}: {
  categories: SectionView["categories"];
}) {
  return (
    <div className={styles.legend}>
      <p className={styles.legendHeading}>Response distribution</p>
      <p className={styles.legendSub}>From the centre outward</p>
      <ol className={styles.legendList}>
        {categories.map((category, index) => (
          <li key={category.key} className={styles.legendItem}>
            <span
              className={styles.legendSwatch}
              style={{ backgroundColor: category.colorVar }}
              aria-hidden="true"
            />
            <span className={styles.legendLabel}>{category.label}</span>
            {index === 0 ? (
              <span className={styles.legendHint}>innermost</span>
            ) : index === categories.length - 1 ? (
              <span className={styles.legendHint}>outermost</span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
