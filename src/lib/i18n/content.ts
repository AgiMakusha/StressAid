/**
 * Locale-aware content that is keyed by stable IDs (sections, answers,
 * questions, interpretation labels, collective interpretations, and suggested
 * actions).
 *
 * English is sourced from the existing single sources of truth
 * (questionnaire.ts, scoring.ts, interventions.ts) so it can never drift.
 * Italian is a static, human-authored translation preserving the current
 * non-medical, non-diagnostic meaning. No text is generated or inferred.
 */

import {
  ANSWER_OPTIONS,
  QUESTIONNAIRE,
  type AnswerOptionId,
  type SectionId,
} from "@/lib/questionnaire";
import { INTERPRETATION_TEXT } from "@/lib/teacher/scoring";
import {
  RESPONSIBLE_REVIEW_NOTE,
  sectionActions as enSectionActions,
  sectionInterpretationText as enSectionInterpretation,
} from "@/lib/teacher/interventions";
import type { InterpretationLabelId } from "@/lib/teacher/types";
import type { Locale } from "./locale";

/* ---- English lookups derived from the existing sources of truth ---- */

const EN_SECTION_NAME = Object.fromEntries(
  QUESTIONNAIRE.map((section) => [section.id, section.name]),
) as Record<SectionId, string>;

const EN_QUESTION = Object.fromEntries(
  QUESTIONNAIRE.map((section) => [section.id, section.question]),
) as Record<SectionId, string>;

const EN_ANSWER_LABEL = Object.fromEntries(
  ANSWER_OPTIONS.map((option) => [option.id, option.label]),
) as Record<AnswerOptionId, string>;

/* ---- Italian content (static, human-authored) ---- */

const IT_SECTION_NAME: Record<SectionId, string> = {
  mood: "Umore",
  safety: "Sicurezza",
  engagement: "Coinvolgimento",
  fomo: "Paura di perdersi qualcosa",
  socialAspects: "Aspetti sociali",
  predictability: "Prevedibilità",
};

const IT_QUESTION: Record<SectionId, string> = {
  mood: "Vengo a scuola con curiosità ed entusiasmo.",
  safety: "Mi sento al sicuro a scuola.",
  engagement: "Mi piace scoprire cose nuove e imparare nuove materie.",
  fomo: "Non mi preoccupo di perdermi le cose che fanno i miei amici.",
  socialAspects: "Non mi sento solo o sola a scuola.",
  predictability:
    "So dove trovare informazioni su orari, compiti e attività della classe.",
};

const IT_ANSWER_LABEL: Record<AnswerOptionId, string> = {
  never: "Mai",
  rarely: "Raramente",
  sometimes: "A volte",
  often: "Spesso",
  always: "Sempre",
};

const IT_INTERPRETATION_LABEL: Record<InterpretationLabelId, string> = {
  strong: "Solido",
  generallyPositive: "Generalmente positivo",
  monitor: "Da monitorare",
  needsAttention: "Richiede attenzione",
  strongConcern: "Forte motivo di attenzione",
};

const IT_REVIEW_NOTE =
  "Questo segnale collettivo indica che il personale scolastico responsabile dovrebbe esaminare quest’area nel suo contesto.";

const IT_SECTION_INTERPRETATION: Record<
  SectionId,
  Record<InterpretationLabelId, string>
> = {
  mood: {
    strong:
      "Nel complesso, gli studenti descrivono di arrivare a scuola con curiosità e positività.",
    generallyPositive:
      "La maggior parte delle risposte indica un umore complessivamente positivo nella classe.",
    monitor:
      "L’umore collettivo è variabile. Potrebbe valere la pena osservare come la classe inizia la giornata.",
    needsAttention:
      "Diverse risposte suggeriscono che l’umore della classe potrebbe essere più positivo all’inizio della giornata.",
    strongConcern:
      "Nel complesso, le risposte indicano un umore collettivo basso. Il personale responsabile dovrebbe valutarlo nel suo contesto.",
  },
  safety: {
    strong:
      "Nel complesso, gli studenti descrivono di sentirsi al sicuro nell’ambiente della classe.",
    generallyPositive:
      "La maggior parte delle risposte suggerisce che gli studenti si sentono generalmente al sicuro a scuola.",
    monitor:
      "La percezione di sicurezza è variabile nella classe e potrebbe valere la pena monitorarla.",
    needsAttention:
      "Diverse risposte suggeriscono che il senso di sicurezza nella classe potrebbe essere rafforzato.",
    strongConcern:
      "Nel complesso, le risposte indicano un basso senso di sicurezza collettivo. Il personale responsabile dovrebbe esaminare con attenzione quest’area nel suo contesto.",
  },
  engagement: {
    strong:
      "Nel complesso, gli studenti descrivono di apprezzare l’esplorazione e lo studio di nuove materie.",
    generallyPositive:
      "La maggior parte delle risposte indica un coinvolgimento complessivamente positivo nell’apprendimento.",
    monitor:
      "Il coinvolgimento nell’apprendimento è variabile nella classe e potrebbe valere la pena monitorarlo.",
    needsAttention:
      "Diverse risposte suggeriscono che il coinvolgimento verso i nuovi argomenti potrebbe essere rafforzato.",
    strongConcern:
      "Nel complesso, le risposte indicano un basso coinvolgimento collettivo. Il personale responsabile dovrebbe esaminare quest’area nel suo contesto.",
  },
  fomo: {
    strong:
      "Nel complesso, gli studenti descrivono di non preoccuparsi molto di perdersi ciò che fanno i compagni.",
    generallyPositive:
      "La maggior parte delle risposte suggerisce che la preoccupazione di perdersi qualcosa è generalmente bassa.",
    monitor:
      "La preoccupazione di perdersi qualcosa è variabile nella classe e potrebbe valere la pena monitorarla.",
    needsAttention:
      "Diverse risposte suggeriscono che la preoccupazione di perdersi qualcosa potrebbe interessare una parte della classe.",
    strongConcern:
      "Nel complesso, le risposte indicano una notevole preoccupazione collettiva di perdersi qualcosa. Il personale responsabile dovrebbe esaminare quest’area nel suo contesto.",
  },
  socialAspects: {
    strong:
      "Nel complesso, gli studenti descrivono di sentirsi coinvolti dal punto di vista sociale in classe.",
    generallyPositive:
      "La maggior parte delle risposte suggerisce che gli studenti si sentono generalmente coinvolti dal punto di vista sociale.",
    monitor:
      "Il senso di connessione sociale è variabile nella classe e potrebbe valere la pena monitorarlo.",
    needsAttention:
      "Diverse risposte suggeriscono che la connessione sociale nella classe potrebbe essere rafforzata.",
    strongConcern:
      "Nel complesso, le risposte indicano una bassa connessione sociale collettiva. Il personale responsabile dovrebbe esaminare quest’area nel suo contesto.",
  },
  predictability: {
    strong:
      "Nel complesso, gli studenti descrivono di sapere dove trovare informazioni sulla vita scolastica.",
    generallyPositive:
      "La maggior parte delle risposte suggerisce che le informazioni sulla vita scolastica sono generalmente facili da trovare.",
    monitor:
      "La facilità con cui gli studenti trovano le informazioni della classe è variabile e potrebbe valere la pena monitorarla.",
    needsAttention:
      "Diverse risposte suggeriscono che le informazioni su orari e attività potrebbero essere più chiare.",
    strongConcern:
      "Nel complesso, le risposte indicano una bassa prevedibilità collettiva. Il personale responsabile dovrebbe esaminare come vengono condivise le informazioni della classe, nel suo contesto.",
  },
};

const IT_SECTION_ACTIONS: Record<SectionId, string[]> = {
  mood: [
    "Iniziare le lezioni con una breve routine di accoglienza prevedibile, condivisa da tutta la classe.",
    "Creare momenti a bassa pressione in cui gli studenti possano esprimere come sta andando la loro giornata.",
    "Rivedere l’equilibrio tra attività impegnative e più leggere durante la settimana.",
  ],
  safety: [
    "Rivedere insieme gli accordi condivisi della classe sul comportamento rispettoso.",
    "Rendere chiaro e semplice per gli studenti rivolgersi a un adulto di fiducia quando serve.",
    "Osservare i momenti e gli spazi di transizione in cui la classe appare meno tranquilla.",
  ],
  engagement: [
    "Offrire ogni tanto la possibilità di scegliere come esplorare un nuovo argomento.",
    "Collegare le nuove materie agli interessi che la classe ha condiviso.",
    "Rivedere il ritmo dei nuovi contenuti per mantenerli stimolanti ma accessibili.",
  ],
  fomo: [
    "Mantenere chiare le informazioni condivise della classe, così che tutti sappiano cosa succede.",
    "Sottolineare che studenti diversi partecipano ad attività diverse, ed è normale.",
    "Creare momenti di gruppo inclusivi che non dipendano da eventi al di fuori della scuola.",
  ],
  socialAspects: [
    "Variare i gruppi di lavoro affinché gli studenti collaborino con compagni diversi.",
    "Prevedere momenti brevi e strutturati per un’interazione positiva tra pari.",
    "Verificare se alcune routine della classe lasciano involontariamente qualche studente da solo.",
  ],
  predictability: [
    "Mantenere un unico luogo coerente in cui pubblicare orari e compiti.",
    "Anticipare in tempo utile a tutta la classe i cambiamenti nelle routine.",
    "Verificare che le informazioni essenziali siano disponibili per ogni studente allo stesso modo.",
  ],
};

/* ---- Accessors: English uses existing sources, Italian uses the tables ---- */

export function getSectionName(locale: Locale, id: SectionId): string {
  return locale === "it" ? IT_SECTION_NAME[id] : EN_SECTION_NAME[id];
}

export function getQuestion(locale: Locale, id: SectionId): string {
  return locale === "it" ? IT_QUESTION[id] : EN_QUESTION[id];
}

export function getAnswerLabel(locale: Locale, id: AnswerOptionId): string {
  return locale === "it" ? IT_ANSWER_LABEL[id] : EN_ANSWER_LABEL[id];
}

export function getInterpretationLabelText(
  locale: Locale,
  labelId: InterpretationLabelId,
): string {
  return locale === "it"
    ? IT_INTERPRETATION_LABEL[labelId]
    : INTERPRETATION_TEXT[labelId];
}

export function getSectionInterpretation(
  locale: Locale,
  id: SectionId,
  labelId: InterpretationLabelId,
): string {
  return locale === "it"
    ? IT_SECTION_INTERPRETATION[id][labelId]
    : enSectionInterpretation(id, labelId);
}

export function getSectionActions(
  locale: Locale,
  id: SectionId,
): readonly string[] {
  return locale === "it" ? IT_SECTION_ACTIONS[id] : enSectionActions(id);
}

export function getResponsibleReviewNote(locale: Locale): string {
  return locale === "it" ? IT_REVIEW_NOTE : RESPONSIBLE_REVIEW_NOTE;
}

/** "1 studente" / "5 studenti" | "1 student" / "5 students". */
export function getStudentsLabel(count: number, locale: Locale): string {
  if (locale === "it") {
    return count === 1 ? "1 studente" : `${count} studenti`;
  }
  return count === 1 ? "1 student" : `${count} students`;
}
