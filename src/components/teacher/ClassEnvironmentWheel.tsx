"use client";

import type { SectionView } from "@/lib/teacher/viewModel";
import type { SectionId } from "@/lib/questionnaire";
import type { InterpretationLabelId } from "@/lib/teacher/types";
import { INTERPRETATION_COLOR } from "@/lib/teacher/scoring";
import { DEFAULT_LOCALE, getMessages, type Locale } from "@/lib/i18n";
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
  overallLabelId: InterpretationLabelId;
  locale?: Locale;
}

/* Layout: donut fills most of the viewBox so the wheel suits the card width.
   Labels sit just outside the ring. Label type size is CSS clamp() (viewport)
   so text stays readable on small screens and does not blow up on large ones. */
const OUTER_R = 320;
const HOLE_R = 118; // Centre hole — overall result only; no response colour here.
const LABEL_R = OUTER_R + 44;
const POP_OUT = 18; // Non-colour selected marker: sector nudges outward.
/* Extra pad beyond the label anchor so CSS-sized labels (e.g. "Social Aspects")
   never clip the card frame — anchors sit at LABEL_R, glyphs extend outward. */
const LABEL_PAD = 200;
const VB_WIDTH = (LABEL_R + LABEL_PAD + POP_OUT) * 2;
const VB_HEIGHT = (LABEL_R + LABEL_PAD + POP_OUT) * 2;
const CX = VB_WIDTH / 2;
const CY = VB_HEIGHT / 2;

export function ClassEnvironmentWheel({
  sections,
  selectedSectionId,
  onSelect,
  overallScoreDisplay,
  overallInterpretationText,
  overallLabelId,
  locale = DEFAULT_LOCALE,
}: ClassEnvironmentWheelProps) {
  const t = getMessages(locale).teacherDashboard;
  /* Darken band colour for AA contrast of centre text on the white disc. */
  const situationColor = `color-mix(in srgb, ${INTERPRETATION_COLOR[overallLabelId]} 70%, black)`;
  return (
    <div className={styles.wheelWrap}>
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className={styles.wheel}
        role="group"
        aria-label={t.wheelAriaLabel}
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

          const distributionDescription = section.categories
            .map(
              (category) =>
                `${category.label} ${category.percentageDisplay} ${t.percentWord}`,
            )
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
                aria-label={`${section.name}, ${section.percentageDisplay} ${t.percentWord}, ${section.interpretationLabelText}. ${distributionDescription}. ${t.selectSection}`}
                onClick={() => onSelect(section.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(section.id);
                  }
                }}
              />

              {/* Section label: name + percentage, outside the ring. Colour is
                  never the sole section identifier (name text is always shown). */}
              <text
                x={anchorPoint.x}
                y={anchorPoint.y}
                textAnchor={textAnchor}
                className={styles.labelText}
                data-selected={isSelected}
                style={
                  isSelected
                    ? {
                        /* Darken section colour so label text meets WCAG 2.2 AA
                           contrast on white (≥4.5:1); colour is never the only cue. */
                        fill: `color-mix(in srgb, ${section.colorVar} 70%, black)`,
                      }
                    : undefined
                }
                aria-hidden="true"
              >
                <tspan className={styles.labelName}>{section.name}</tspan>
                <tspan
                  x={anchorPoint.x}
                  dy="1.2em"
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
          r={HOLE_R - 6}
          className={styles.centerDisc}
        />
        <text
          x={CX}
          y={CY - 12}
          textAnchor="middle"
          className={styles.centerScore}
          style={{ fill: situationColor }}
        >
          {overallScoreDisplay}%
        </text>
        <text
          x={CX}
          y={CY + 14}
          textAnchor="middle"
          className={styles.centerLabelSmall}
        >
          {t.overall}
        </text>
        <text
          x={CX}
          y={CY + 36}
          textAnchor="middle"
          className={styles.centerInterpretation}
          style={{ fill: situationColor }}
        >
          {overallInterpretationText}
        </text>
      </svg>

      <ResponseScaleLegend
        categories={sections[0]?.categories ?? []}
        locale={locale}
      />
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
  locale = DEFAULT_LOCALE,
}: {
  categories: SectionView["categories"];
  locale?: Locale;
}) {
  const t = getMessages(locale).teacherDashboard;
  return (
    <div className={styles.legend}>
      <p className={styles.legendHeading}>{t.responseDistribution}</p>
      <p className={styles.legendSub}>{t.fromCentreOutward}</p>
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
              <span className={styles.legendHint}>{t.innermost}</span>
            ) : index === categories.length - 1 ? (
              <span className={styles.legendHint}>{t.outermost}</span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
