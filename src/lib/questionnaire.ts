/**
 * Central, typed questionnaire definition — the single source of truth for the
 * student workflow. Question and answer content lives here (not in page
 * components) so it stays consistent and can be localised (e.g. Italian) later.
 *
 * All six sections are positively scored: a higher answer always means a higher
 * score. Scoring itself is NOT performed in the student UI — these values exist
 * only to identify the selected answer. No student score is ever calculated or
 * shown on the client.
 */

export type ResponseValue = 0 | 1 | 2 | 3 | 4;

export type AnswerOptionId =
  | "never"
  | "rarely"
  | "sometimes"
  | "often"
  | "always";

export interface AnswerOption {
  /** Stored score for this option (0–4). */
  value: ResponseValue;
  id: AnswerOptionId;
  /** Visible text label. */
  label: string;
  /**
   * CSS custom property reference for the fixed response colour. Consumes the
   * existing tokens in src/styles/tokens.css so colours stay in sync with the
   * teacher visualisations built later.
   */
  colorVar: string;
}

export type SectionId =
  | "mood"
  | "safety"
  | "engagement"
  | "fomo"
  | "socialAspects"
  | "predictability";

export interface QuestionSection {
  id: SectionId;
  /** Section name shown above the question. */
  name: string;
  /** The single positively scored question for this section. */
  question: string;
}

/**
 * The five answer options in canonical order (0 → 4):
 * Never → Rarely → Sometimes → Often → Always.
 */
export const ANSWER_OPTIONS: readonly AnswerOption[] = [
  { value: 0, id: "never", label: "Never", colorVar: "var(--response-never)" },
  { value: 1, id: "rarely", label: "Rarely", colorVar: "var(--response-rarely)" },
  {
    value: 2,
    id: "sometimes",
    label: "Sometimes",
    colorVar: "var(--response-sometimes)",
  },
  { value: 3, id: "often", label: "Often", colorVar: "var(--response-often)" },
  { value: 4, id: "always", label: "Always", colorVar: "var(--response-always)" },
] as const;

/**
 * The six sections in the exact required order, one question each.
 */
export const QUESTIONNAIRE: readonly QuestionSection[] = [
  {
    id: "mood",
    name: "Mood",
    question: "I am coming to school curious and excited.",
  },
  {
    id: "safety",
    name: "Safety",
    question: "I feel safe at school.",
  },
  {
    id: "engagement",
    name: "Engagement",
    question: "I love to explore new things and learn new subjects.",
  },
  {
    id: "fomo",
    name: "FOMO",
    question: "I don’t worry about missing out on things my friends are doing.",
  },
  {
    id: "socialAspects",
    name: "Social Aspects",
    question: "I don’t feel lonely at school.",
  },
  {
    id: "predictability",
    name: "Predictability",
    question:
      "I know where I can get information about schedules, homework and class activities.",
  },
] as const;

export const QUESTION_COUNT = QUESTIONNAIRE.length;
