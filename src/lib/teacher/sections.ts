/**
 * Section display metadata for the teacher dashboard: canonical order, section
 * name, colour token, and an icon key. Section names come from the shared
 * questionnaire definition so they stay consistent. The exact question wording
 * is intentionally NOT used anywhere in the teacher UI — section names only.
 */

import { QUESTIONNAIRE, type SectionId } from "@/lib/questionnaire";

export type SectionIconKey =
  | "mood"
  | "safety"
  | "engagement"
  | "fomo"
  | "social"
  | "predictability";

export interface SectionMeta {
  id: SectionId;
  name: string;
  /** CSS custom property reference for the approved section colour. */
  colorVar: string;
  iconKey: SectionIconKey;
}

const SECTION_STYLE: Record<
  SectionId,
  { colorVar: string; iconKey: SectionIconKey }
> = {
  mood: { colorVar: "var(--section-mood)", iconKey: "mood" },
  safety: { colorVar: "var(--section-safety)", iconKey: "safety" },
  engagement: { colorVar: "var(--section-engagement)", iconKey: "engagement" },
  fomo: { colorVar: "var(--section-fomo)", iconKey: "fomo" },
  socialAspects: { colorVar: "var(--section-social)", iconKey: "social" },
  predictability: {
    colorVar: "var(--section-predictability)",
    iconKey: "predictability",
  },
};

/** Canonical section order + display metadata (names from questionnaire). */
export const SECTION_META: readonly SectionMeta[] = QUESTIONNAIRE.map(
  (section) => ({
    id: section.id,
    name: section.name,
    colorVar: SECTION_STYLE[section.id].colorVar,
    iconKey: SECTION_STYLE[section.id].iconKey,
  }),
);

export function getSectionMeta(id: SectionId): SectionMeta {
  const meta = SECTION_META.find((section) => section.id === id);
  if (!meta) {
    throw new Error(`Unknown section id: ${id}`);
  }
  return meta;
}
