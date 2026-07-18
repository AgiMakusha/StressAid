import { ANSWER_OPTIONS, type ResponseValue } from "@/lib/questionnaire";
import { studentCopy } from "@/lib/studentCopy";
import { SmileIcon } from "./SmileIcon";
import styles from "./AnswerScale.module.css";

interface AnswerScaleProps {
  /** Stable id of the visible question heading, used for aria-labelledby. */
  questionHeadingId: string;
  /** Shared radio group name. */
  name: string;
  /** Currently selected value, or null if unanswered. */
  value: ResponseValue | null;
  onChange: (value: ResponseValue) => void;
}

/**
 * Five-option smile answer scale using native radio inputs inside a fieldset.
 * The fieldset is labelled by the visible question heading (aria-labelledby)
 * plus a visually hidden legend ("Choose one answer"). Selection is conveyed by
 * icon expression + text label + a checkmark/border — never colour alone.
 */
export function AnswerScale({
  questionHeadingId,
  name,
  value,
  onChange,
}: AnswerScaleProps) {
  return (
    <fieldset className={styles.fieldset} aria-labelledby={questionHeadingId}>
      <legend className={styles.visuallyHiddenLegend}>
        {studentCopy.questions.answerGroupLabel}
      </legend>
      <div className={styles.options}>
        {ANSWER_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.id}
              className={styles.option}
              data-selected={selected}
              style={{ ["--option-color" as string]: option.colorVar }}
            >
              <input
                type="radio"
                name={name}
                className={styles.input}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              <span className={styles.icon}>
                <SmileIcon value={option.value} />
              </span>
              <span className={styles.label}>{option.label}</span>
              <span className={styles.check} aria-hidden="true">
                {selected ? "✓" : ""}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
