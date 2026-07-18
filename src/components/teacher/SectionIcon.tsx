import type { SectionIconKey } from "@/lib/teacher/sections";

interface SectionIconProps {
  iconKey: SectionIconKey;
  className?: string;
  size?: number;
}

/**
 * Section glyphs for the teacher dashboard, using the official hand-drawn
 * StressAid section illustrations from `public/brand/Teacher`. Always rendered
 * alongside a visible text label, so each icon is aria-hidden and is never the
 * sole carrier of meaning. Rendered via an SVG <image> so the same component
 * is valid both in HTML (overview list, detail panel) and inside the wheel's
 * SVG. The drawings carry their own colours; no recolouring is applied.
 */
export function SectionIcon({ iconKey, className, size = 24 }: SectionIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <image
        href={SECTION_ICON_SRC[iconKey]}
        x="0"
        y="0"
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}

const SECTION_ICON_SRC: Record<SectionIconKey, string> = {
  mood: "/brand/Teacher/Mood.svg",
  safety: "/brand/Teacher/Safety.svg",
  engagement: "/brand/Teacher/Engagement.svg",
  fomo: "/brand/Teacher/FOMO.svg",
  social: "/brand/Teacher/Social Aspects.svg",
  predictability: "/brand/Teacher/Predictability.svg",
};
