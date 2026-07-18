/**
 * Centralised student-facing copy (English only for now). Kept in one place so
 * an Italian translation can be added later without touching components.
 * No copy here varies based on a student's answers.
 */

export const studentCopy = {
  welcome: {
    heading: "Welcome!",
    intro: "Your voice helps make our school a better place for everyone.",
    reassurances: [
      "No right or wrong answers",
      "We do not ask for your name",
      "Your answers are combined with your class",
      "Your teacher cannot see your individual answers",
      "About 2 minutes",
    ],
    startButton: "Start",
  },
  questions: {
    /** e.g. "Question 2 of 6" */
    progress: (current: number, total: number) =>
      `Question ${current} of ${total}`,
    answerGroupLabel: "Choose one answer",
    back: "Back",
    next: "Next",
    submit: "Submit answers",
  },
  completion: {
    heading: "Thank you!",
    message: "Your response has been recorded anonymously.",
    collective: "Together, we can create a better school for all students.",
    support:
      "If something at school makes you feel unsafe, speak with a trusted adult or use your school’s official support channel.",
    homeLink: "Back to home",
  },
} as const;
