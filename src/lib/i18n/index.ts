/**
 * Client-safe barrel for the i18n layer. (The server-only cookie reader lives
 * in ./server and must be imported directly from server components.)
 */

export {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALES,
  isLocale,
  resolveLocale,
  writeLocaleCookie,
  type Locale,
} from "./locale";
export { getMessages, type Messages } from "./messages";
export {
  getAnswerLabel,
  getInterpretationLabelText,
  getQuestion,
  getResponsibleReviewNote,
  getSectionActions,
  getSectionInterpretation,
  getSectionName,
  getStudentsLabel,
} from "./content";
export { LocaleProvider, useLocale } from "./LocaleProvider";

import { getMessages } from "./messages";
import type { Locale } from "./locale";

/**
 * Returns the student-facing copy in the shape the student components expect,
 * localised for the given campaign/round language. English is the default.
 */
export function getStudentCopy(locale: Locale) {
  const m = getMessages(locale).student;
  return {
    welcome: {
      heading: m.welcomeHeading,
      intro: m.welcomeIntro,
      reassurances: m.reassurances,
      startButton: m.startButton,
    },
    questions: {
      progress: m.progress,
      answerGroupLabel: m.answerGroupLabel,
      back: m.back,
      next: m.next,
      submit: m.submit,
      sending: m.sending,
    },
    completion: {
      heading: m.completionHeading,
      message: m.completionMessage,
      collective: m.completionCollective,
      support: m.completionSupport,
      homeLink: m.homeLink,
    },
  };
}
