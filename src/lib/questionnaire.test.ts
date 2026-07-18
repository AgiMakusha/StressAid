import { describe, expect, it } from "vitest";
import {
  ANSWER_OPTIONS,
  QUESTIONNAIRE,
  QUESTION_COUNT,
} from "./questionnaire";

describe("questionnaire data", () => {
  it("contains all six sections in the exact required order", () => {
    expect(QUESTION_COUNT).toBe(6);
    expect(QUESTIONNAIRE.map((section) => section.id)).toEqual([
      "mood",
      "safety",
      "engagement",
      "fomo",
      "socialAspects",
      "predictability",
    ]);
  });

  it("uses the exact provided question wording per section", () => {
    expect(QUESTIONNAIRE.map((section) => section.question)).toEqual([
      "I am coming to school curious and excited.",
      "I feel safe at school.",
      "I love to explore new things and learn new subjects.",
      "I don’t worry about missing out on things my friends are doing.",
      "I don’t feel lonely at school.",
      "I know where I can get information about schedules, homework and class activities.",
    ]);
  });

  it("defines the five answer options in exact 0–4 order", () => {
    expect(ANSWER_OPTIONS.map((option) => option.value)).toEqual([
      0, 1, 2, 3, 4,
    ]);
    expect(ANSWER_OPTIONS.map((option) => option.id)).toEqual([
      "never",
      "rarely",
      "sometimes",
      "often",
      "always",
    ]);
    expect(ANSWER_OPTIONS.map((option) => option.label)).toEqual([
      "Never",
      "Rarely",
      "Sometimes",
      "Often",
      "Always",
    ]);
  });

  it("references the correct fixed response colour token for each option", () => {
    const byId = Object.fromEntries(
      ANSWER_OPTIONS.map((option) => [option.id, option.colorVar]),
    );
    expect(byId.never).toBe("var(--response-never)");
    expect(byId.rarely).toBe("var(--response-rarely)");
    expect(byId.sometimes).toBe("var(--response-sometimes)");
    expect(byId.often).toBe("var(--response-often)");
    expect(byId.always).toBe("var(--response-always)");
  });
});
