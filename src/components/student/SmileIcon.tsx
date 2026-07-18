import type { ResponseValue } from "@/lib/questionnaire";

interface SmileIconProps {
  value: ResponseValue;
  className?: string;
}

/**
 * Calm, child-appropriate face expressions — one per answer value (0–4).
 * Purely decorative: always rendered alongside a visible text label, so the
 * icon is aria-hidden and never the sole carrier of meaning. Colour comes from
 * the parent via `currentColor`; the expression alone distinguishes options.
 *
 * Mouth path progresses from gently downturned (0) to clearly upturned (4).
 */
export function SmileIcon({ value, className }: SmileIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="40"
      height="40"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="17" cy="20" r="2.4" fill="currentColor" />
      <circle cx="31" cy="20" r="2.4" fill="currentColor" />
      <path
        d={MOUTH_PATHS[value]}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const MOUTH_PATHS: Record<ResponseValue, string> = {
  // Never — gently downturned
  0: "M16 33 Q24 26 32 33",
  // Rarely — slightly downturned
  1: "M16 32 Q24 29 32 32",
  // Sometimes — neutral / straight
  2: "M16 31 L32 31",
  // Often — slight smile
  3: "M16 30 Q24 35 32 30",
  // Always — clear smile
  4: "M16 29 Q24 39 32 29",
};
