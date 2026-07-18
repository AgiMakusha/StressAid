"use client";

import { useRef, useState } from "react";
import {
  QUESTIONNAIRE,
  QUESTION_COUNT,
  type ResponseValue,
} from "@/lib/questionnaire";
import { createClient } from "@/lib/supabase/client";
import { WelcomeCard } from "./WelcomeCard";
import { QuestionCard } from "./QuestionCard";
import { CompletionContent } from "./CompletionContent";
import styles from "./RoundQuestionnaire.module.css";

interface RoundQuestionnaireProps {
  publicCode: string;
  title: string;
  classDisplayName: string;
  roundDisplayName: string;
}

type Phase = "welcome" | "questions" | "complete";
type Answers = (ResponseValue | null)[];

function createEmptyAnswers(): Answers {
  return Array<ResponseValue | null>(QUESTION_COUNT).fill(null);
}

/**
 * Public, round-specific student questionnaire. Answers live only in React
 * memory. On submit, all six answers are sent atomically to the
 * `submit_round_response` RPC as anonymous aggregate increments — no student
 * identity, no score, nothing logged. The completion screen is shown only after
 * a successful submission. Double submission is prevented with an in-flight guard.
 */
export function RoundQuestionnaire({
  publicCode,
  title,
  classDisplayName,
  roundDisplayName,
}: RoundQuestionnaireProps) {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(createEmptyAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const selectAnswer = (value: ResponseValue) => {
    setAnswers((previous) => {
      const updated = [...previous];
      updated[currentIndex] = value;
      return updated;
    });
  };

  const goBack = () => {
    if (currentIndex === 0) {
      setPhase("welcome");
      return;
    }
    setCurrentIndex((index) => index - 1);
  };

  const goNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, QUESTION_COUNT - 1));
  };

  const submit = async () => {
    // Guard against double submission (rapid clicks / re-entrancy).
    if (inFlight.current) return;
    if (answers.some((value) => value === null)) return;

    inFlight.current = true;
    setSubmitting(true);
    setError(null);

    const payload: Record<string, number> = {};
    QUESTIONNAIRE.forEach((section, index) => {
      payload[section.id] = answers[index] as ResponseValue;
    });

    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        "submit_round_response",
        { p_public_code: publicCode, p_answers: payload },
      );

      if (rpcError || !data || (data as { success?: boolean }).success !== true) {
        setError(
          "We couldn't send your answers. Please check your connection and try again.",
        );
        return;
      }

      setAnswers(createEmptyAnswers());
      setCurrentIndex(0);
      setPhase("complete");
    } catch {
      setError(
        "We couldn't send your answers. Please check your connection and try again.",
      );
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  if (phase === "complete") {
    return <CompletionContent />;
  }

  if (phase === "welcome") {
    return (
      <div className={styles.wrap}>
        <p className={styles.context}>
          {title} · {classDisplayName} · {roundDisplayName}
        </p>
        <WelcomeCard onStart={() => setPhase("questions")} />
      </div>
    );
  }

  const section = QUESTIONNAIRE[currentIndex];

  return (
    <div className={styles.wrap}>
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
        submitting={submitting}
      />
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
