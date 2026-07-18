import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  getAnswerLabel,
  getInterpretationLabelText,
  getMessages,
  getQuestion,
  getSectionName,
  isLocale,
  resolveLocale,
} from "@/lib/i18n";
import { QUESTIONNAIRE, ANSWER_OPTIONS } from "@/lib/questionnaire";

describe("locale resolution", () => {
  it("uses English as the default fallback", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(resolveLocale(undefined)).toBe("en");
    expect(resolveLocale(null)).toBe("en");
    expect(resolveLocale("")).toBe("en");
  });

  it("falls back to English for invalid locale values", () => {
    expect(resolveLocale("fr")).toBe("en");
    expect(resolveLocale("EN")).toBe("en");
    expect(resolveLocale("english")).toBe("en");
    expect(isLocale("de")).toBe(false);
  });

  it("accepts the two supported locales", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("it")).toBe("it");
    expect(isLocale("en")).toBe(true);
    expect(isLocale("it")).toBe(true);
  });
});

describe("questionnaire content by language", () => {
  it("keeps the English questions unchanged (source of truth)", () => {
    expect(QUESTIONNAIRE.map((s) => getQuestion("en", s.id))).toEqual(
      QUESTIONNAIRE.map((s) => s.question),
    );
  });

  it("returns all six Italian questions in the canonical order", () => {
    expect(QUESTIONNAIRE.map((s) => getQuestion("it", s.id))).toEqual([
      "Vengo a scuola con curiosità ed entusiasmo.",
      "Mi sento al sicuro a scuola.",
      "Mi piace scoprire cose nuove e imparare nuove materie.",
      "Non mi preoccupo di perdermi le cose che fanno i miei amici.",
      "Non mi sento solo o sola a scuola.",
      "So dove trovare informazioni su orari, compiti e attività della classe.",
    ]);
  });

  it("returns the Italian answer labels in the exact 0–4 order", () => {
    expect(ANSWER_OPTIONS.map((o) => getAnswerLabel("it", o.id))).toEqual([
      "Mai",
      "Raramente",
      "A volte",
      "Spesso",
      "Sempre",
    ]);
  });

  it("returns the Italian section names", () => {
    expect(QUESTIONNAIRE.map((s) => getSectionName("it", s.id))).toEqual([
      "Umore",
      "Sicurezza",
      "Coinvolgimento",
      "Paura di perdersi qualcosa",
      "Aspetti sociali",
      "Prevedibilità",
    ]);
  });

  it("translates the interpretation labels into Italian", () => {
    expect(getInterpretationLabelText("it", "strong")).toBe("Solido");
    expect(getInterpretationLabelText("it", "generallyPositive")).toBe(
      "Generalmente positivo",
    );
    expect(getInterpretationLabelText("it", "monitor")).toBe("Da monitorare");
    expect(getInterpretationLabelText("it", "needsAttention")).toBe(
      "Richiede attenzione",
    );
    expect(getInterpretationLabelText("it", "strongConcern")).toBe(
      "Forte motivo di attenzione",
    );
    // English is unchanged.
    expect(getInterpretationLabelText("en", "monitor")).toBe("Monitor");
  });
});

describe("interface messages by language", () => {
  it("provides distinct English and Italian teacher chrome", () => {
    expect(getMessages("en").dashboard.startNewRound).toBe("Start new round");
    expect(getMessages("it").dashboard.startNewRound).toBe(
      "Avvia una nuova rilevazione",
    );
    expect(getMessages("en").auth.signInButton).toBe("Sign in");
    expect(getMessages("it").auth.signInButton).toBe("Accedi");
  });
});
