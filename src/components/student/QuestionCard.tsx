"use client";

import { useEffect, useRef } from "react";
import type { QuestionSection, ResponseValue } from "@/lib/questionnaire";
import { studentCopy } from "@/lib/studentCopy";
import { AnswerScale } from "./AnswerScale";
import { ProgressIndicator } from "./ProgressIndicator";
import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  section: QuestionSection;
  /** 0-based index of the current question. */
  index: number;
  total: number;
  value: ResponseValue | null;
  isLast: boolean;
  onChange: (value: ResponseValue) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const QUESTION_HEADING_ID = "question-heading";

/**
 * A single question screen: progress, section name, the question heading, the
 * five-option answer scale, and Back/Next (or Submit) controls. On each new
 * question, programmatic focus moves to the visible question heading so
 * keyboard and screen-reader users are oriented to the new content.
 */
export function QuestionCard({
  section,
  index,
  total,
  value,
  isLast,
  onChange,
  onBack,
  onNext,
  onSubmit,
}: QuestionCardProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the question heading whenever the question changes.
  useEffect(() => {
    headingRef.current?.focus();
  }, [section.id]);

  const nextDisabled = value === null;

  return (
    <section className={styles.card} aria-labelledby={QUESTION_HEADING_ID}>
      <ProgressIndicator current={index + 1} total={total} />

      <p className={styles.sectionName}>{section.name}</p>
      <h2
        id={QUESTION_HEADING_ID}
        tabIndex={-1}
        ref={headingRef}
        className={styles.question}
      >
        {section.question}
      </h2>

      <AnswerScale
        questionHeadingId={QUESTION_HEADING_ID}
        name="student-answer"
        value={value}
        onChange={onChange}
      />

      <div className={styles.controls}>
        <button type="button" className={styles.back} onClick={onBack}>
          {studentCopy.questions.back}
        </button>
        {isLast ? (
          <button
            type="button"
            className={styles.next}
            onClick={onSubmit}
            disabled={nextDisabled}
          >
            {studentCopy.questions.submit}
          </button>
        ) : (
          <button
            type="button"
            className={styles.next}
            onClick={onNext}
            disabled={nextDisabled}
          >
            {studentCopy.questions.next}
          </button>
        )}
      </div>
    </section>
  );
}
