import type { ResponseValue } from "@/lib/questionnaire";

interface SmileIconProps {
  value: ResponseValue;
  className?: string;
}

/**
 * Answer-scale face for each answer value (0–4), using the official hand-drawn
 * StressAid student faces from `public/brand/Student`. Files map directly to
 * value: 0 → "Smile 1" (magenta) … 4 → "Smile 5" (blue). Purely decorative:
 * always rendered alongside a visible text label, so the icon is aria-hidden
 * and never the sole carrier of meaning. Rendered via an SVG <image> so it
 * scales fluidly and stays valid inside both HTML and SVG contexts.
 */
export function SmileIcon({ value, className }: SmileIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width="40"
      height="40"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <image
        href={`/brand/Student/Smile ${value + 1}.svg`}
        x="0"
        y="0"
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
