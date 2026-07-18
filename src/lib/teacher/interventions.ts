/**
 * Central, typed library of STATIC human-authored suggested actions and
 * collective interpretations for the teacher dashboard.
 *
 * These are NOT generated, inferred, or model-produced. All wording is
 * environment-focused, non-medical, non-diagnostic, and encourages responsible
 * human review. No text here claims a diagnosis, prediction, confirmed risk,
 * "unsafe class", clinical concern, or student profiling.
 */

import type { SectionId } from "@/lib/questionnaire";
import type { InterpretationLabelId } from "./types";

/** Shared caution applied to every section, regardless of score band. */
export const RESPONSIBLE_REVIEW_NOTE =
  "This collective signal suggests that responsible school staff should review this area in context.";

interface SectionInterpretationCopy {
  /** Short collective interpretation, keyed by the provisional label. */
  interpretation: Record<InterpretationLabelId, string>;
  /** Human-authored, environment-focused suggested actions. */
  actions: string[];
}

const SECTION_LIBRARY: Record<SectionId, SectionInterpretationCopy> = {
  mood: {
    interpretation: {
      strong:
        "As a group, students describe arriving at school feeling curious and positive.",
      generallyPositive:
        "Most responses point to a generally positive mood across the class.",
      monitor:
        "Collective mood is mixed. It may be worth keeping an eye on how the class starts its day.",
      needsAttention:
        "Several responses suggest the class mood could be more positive at the start of the day.",
      strongConcern:
        "As a group, responses point to a low collective mood. Responsible staff should look at this in context.",
    },
    actions: [
      "Open lessons with a brief, predictable welcome routine the whole class shares.",
      "Create low-pressure moments where students can express how their day is going.",
      "Review the balance of demanding and lighter activities across the week.",
    ],
  },
  safety: {
    interpretation: {
      strong:
        "As a group, students describe feeling safe in the class environment.",
      generallyPositive:
        "Most responses suggest students generally feel safe at school.",
      monitor:
        "Feelings of safety are mixed across the class and may be worth monitoring.",
      needsAttention:
        "Several responses suggest the sense of safety in the class could be strengthened.",
      strongConcern:
        "As a group, responses point to a low collective sense of safety. Responsible staff should review this area carefully in context.",
    },
    actions: [
      "Revisit shared class agreements about respectful behaviour together.",
      "Make it clear and easy for students to reach a trusted adult when needed.",
      "Review common transition times and spaces where the class feels less settled.",
    ],
  },
  engagement: {
    interpretation: {
      strong:
        "As a group, students describe enjoying exploring and learning new subjects.",
      generallyPositive:
        "Most responses point to generally positive engagement with learning.",
      monitor:
        "Engagement with learning is mixed across the class and may be worth monitoring.",
      needsAttention:
        "Several responses suggest engagement with new topics could be strengthened.",
      strongConcern:
        "As a group, responses point to low collective engagement. Responsible staff should review this area in context.",
    },
    actions: [
      "Offer occasional choice in how students explore a new topic.",
      "Connect new subjects to interests the class has shared.",
      "Review the pace of new material to keep it challenging but approachable.",
    ],
  },
  fomo: {
    interpretation: {
      strong:
        "As a group, students describe not worrying much about missing out on what peers are doing.",
      generallyPositive:
        "Most responses suggest worry about missing out is generally low.",
      monitor:
        "Worry about missing out is mixed across the class and may be worth monitoring.",
      needsAttention:
        "Several responses suggest worry about missing out could be affecting some of the class.",
      strongConcern:
        "As a group, responses point to notable collective worry about missing out. Responsible staff should review this area in context.",
    },
    actions: [
      "Keep shared class information clear so everyone knows what is happening.",
      "Highlight that different students take part in different activities, and that is normal.",
      "Create inclusive group moments that do not depend on outside-of-school events.",
    ],
  },
  socialAspects: {
    interpretation: {
      strong:
        "As a group, students describe feeling socially connected in class.",
      generallyPositive:
        "Most responses suggest students generally feel socially connected.",
      monitor:
        "Feelings of social connection are mixed across the class and may be worth monitoring.",
      needsAttention:
        "Several responses suggest social connection in the class could be strengthened.",
      strongConcern:
        "As a group, responses point to low collective social connection. Responsible staff should review this area in context.",
    },
    actions: [
      "Use varied grouping so students work with a range of classmates.",
      "Build short, structured moments for positive peer interaction.",
      "Review whether any class routines unintentionally leave students on their own.",
    ],
  },
  predictability: {
    interpretation: {
      strong:
        "As a group, students describe knowing where to find information about school life.",
      generallyPositive:
        "Most responses suggest information about school life is generally easy to find.",
      monitor:
        "How easily students find class information is mixed and may be worth monitoring.",
      needsAttention:
        "Several responses suggest information about schedules and activities could be clearer.",
      strongConcern:
        "As a group, responses point to low collective predictability. Responsible staff should review how class information is shared, in context.",
    },
    actions: [
      "Keep a single, consistent place where schedules and homework are posted.",
      "Preview upcoming changes to routines with the whole class in advance.",
      "Check that key information is available to every student in the same way.",
    ],
  },
};

export function sectionInterpretationText(
  sectionId: SectionId,
  label: InterpretationLabelId,
): string {
  return SECTION_LIBRARY[sectionId].interpretation[label];
}

export function sectionActions(sectionId: SectionId): readonly string[] {
  return SECTION_LIBRARY[sectionId].actions;
}
