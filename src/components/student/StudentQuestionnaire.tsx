"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  QUESTIONNAIRE,
  QUESTION_COUNT,
  type ResponseValue,
} from "@/lib/questionnaire";
import { getQuestion, getSectionName, useLocale } from "@/lib/i18n";
import { WelcomeCard } from "./WelcomeCard";
import { QuestionCard } from "./QuestionCard";

type Phase = "welcome" | "questions";

/** Answers held only in React memory — no persistence of any kind. */
type Answers = (ResponseValue | null)[];

function createEmptyAnswers(): Answers {
  return Array<ResponseValue | null>(QUESTION_COUNT).fill(null);
}

/**
 * Client-only controller for the anonymous student questionnaire.
 *
 * State lives entirely in React memory. There is intentionally NO persistence:
 * no localStorage, sessionStorage, cookies, URL state, or backend. No student
 * score is ever calculated, displayed, or logged.
 *
 * Because there is no backend in this step, final submission is a LOCAL DEMO
 * TRANSITION only: it clears in-memory state and navigates to the completion
 * page. This limitation is intentional and must not be surfaced to students.
 */
export function StudentQuestionnaire() {
  const router = useRouter();
  // The demo has no campaign, so it follows the global interface language
  // (real student links follow their campaign/round language instead).
  const locale = useLocale();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(createEmptyAnswers);

  const startQuestionnaire = () => {
    setPhase("questions");
  };

  const selectAnswer = (value: ResponseValue) => {
    setAnswers((previous) => {
      const updated = [...previous];
      updated[currentIndex] = value;
      return updated;
    });
  };

  const goBack = () => {
    if (currentIndex === 0) {
      // First question: return to the welcome screen. In-memory answers are
      // preserved so an unfinished session is not discarded.
      setPhase("welcome");
      return;
    }
    setCurrentIndex((index) => index - 1);
  };

  const goNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, QUESTION_COUNT - 1));
  };

  const submit = () => {
    // Local demo transition only (no backend). Clear all in-memory state, then
    // navigate to the generic completion page. No score is computed or logged.
    setAnswers(createEmptyAnswers());
    setCurrentIndex(0);
    setPhase("welcome");
    router.push("/student/demo/complete");
  };

  if (phase === "welcome") {
    return <WelcomeCard onStart={startQuestionnaire} locale={locale} />;
  }

  const base = QUESTIONNAIRE[currentIndex];
  const section = {
    ...base,
    name: getSectionName(locale, base.id),
    question: getQuestion(locale, base.id),
  };

  return (
    <QuestionCard
      section={section}
      index={currentIndex}
      total={QUESTION_COUNT}
      value={answers[currentIndex]}
      isLast={currentIndex === QUESTION_COUNT - 1}
      onChange={selectAnswer}
      onBack={goBack}
      onNext={goNext}
      onSubmit={submit}
      locale={locale}
    />
  );
}
