import type { SectionIconKey } from "@/lib/teacher/sections";

interface SectionIconProps {
  iconKey: SectionIconKey;
  className?: string;
  size?: number;
}

/**
 * Six original, single-line-style section glyphs for the teacher dashboard.
 * One consistent visual style (24x24 viewBox, currentColor stroke). Always
 * rendered alongside a visible text label, so each icon is aria-hidden and is
 * never the sole carrier of meaning. Not derived from the supplied logos or
 * student illustrations, and no icon-library dependency is introduced.
 */
export function SectionIcon({ iconKey, className, size = 24 }: SectionIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICON_PATHS[iconKey]}
    </svg>
  );
}

const ICON_PATHS: Record<SectionIconKey, React.ReactNode> = {
  // Mood — a smiling face
  mood: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2" />
      <path d="M9 9.5h.01M15 9.5h.01" />
    </>
  ),
  // Safety — a shield
  safety: (
    <>
      <path d="M12 3l7 3v5c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  // Engagement — an open book
  engagement: (
    <>
      <path d="M12 6c-1.8-1.2-4-1.5-6-1v11c2-.5 4.2-.2 6 1 1.8-1.2 4-1.5 6-1V5c-2-.5-4.2-.2-6 1z" />
      <path d="M12 6v11" />
    </>
  ),
  // FOMO — a bell (staying in the loop)
  fomo: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
      <path d="M10.5 19a1.8 1.8 0 0 0 3 0" />
    </>
  ),
  // Social Aspects — two people
  social: (
    <>
      <circle cx="9" cy="8" r="2.6" />
      <path d="M4.5 19c0-2.8 2-4.6 4.5-4.6s4.5 1.8 4.5 4.6" />
      <path d="M16 8.2a2.4 2.4 0 0 1 0 4.4" />
      <path d="M16.5 14.6c2 .4 3.5 2.1 3.5 4.4" />
    </>
  ),
  // Predictability — a calendar
  predictability: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
      <path d="M8 13h.01M12 13h.01M16 13h.01" />
    </>
  ),
};
