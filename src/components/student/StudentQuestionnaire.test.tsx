import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudentQuestionnaire } from "./StudentQuestionnaire";
import { ANSWER_OPTIONS, QUESTIONNAIRE } from "@/lib/questionnaire";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

/** Advance through the welcome screen into the first question. */
async function start(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /start/i }));
}

function selectOption(label: RegExp) {
  return screen.getByRole("radio", { name: label });
}

beforeEach(() => {
  push.mockReset();
});

describe("StudentQuestionnaire flow", () => {
  it("shows the welcome screen first with all required privacy and participation info", () => {
    render(<StudentQuestionnaire />);
    expect(
      screen.getByRole("heading", { name: /welcome/i }),
    ).toBeInTheDocument();
    // 1. Completion estimate
    expect(screen.getByText(/about 2 minutes/i)).toBeInTheDocument();
    // 2. No name is requested
    expect(screen.getByText(/do not ask for your name/i)).toBeInTheDocument();
    // 3. Teacher cannot see individual answers
    expect(
      screen.getByText(/cannot see your individual answers/i),
    ).toBeInTheDocument();
    // 4. Answers are combined with the class
    expect(
      screen.getByText(/combined with your class/i),
    ).toBeInTheDocument();
    // 5. No right or wrong answers
    expect(
      screen.getByText(/no right or wrong answers/i),
    ).toBeInTheDocument();
  });

  it("uses only Illustration 1 on the welcome screen (no question shown)", () => {
    const { container } = render(<StudentQuestionnaire />);
    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(1);
    expect(imgs[0].getAttribute("src")).toContain("Illustration 1_v2.svg");
    expect(imgs[0].getAttribute("alt")).toBe("");
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });

  it("disables Next before an answer and enables it after selecting", async () => {
    const user = userEvent.setup();
    render(<StudentQuestionnaire />);
    await start(user);

    const next = screen.getByRole("button", { name: /^next$/i });
    expect(next).toBeDisabled();

    await user.click(selectOption(/never/i));
    expect(next).toBeEnabled();
  });

  it("renders no illustration on question screens", async () => {
    const user = userEvent.setup();
    const { container } = render(<StudentQuestionnaire />);
    await start(user);
    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(0);
  });

  it("exposes native radio semantics with five options in 0–4 label order", async () => {
    const user = userEvent.setup();
    render(<StudentQuestionnaire />);
    await start(user);

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
    radios.forEach((radio) => expect(radio).toHaveAttribute("type", "radio"));

    const labels = radios.map((radio) => radio.getAttribute("value"));
    expect(labels).toEqual(["0", "1", "2", "3", "4"]);
  });

  it("supports keyboard selection of an answer", async () => {
    const user = userEvent.setup();
    render(<StudentQuestionnaire />);
    await start(user);

    const often = selectOption(/often/i);
    often.focus();
    expect(often).toHaveFocus();
    await user.keyboard(" ");
    expect(often).toBeChecked();
  });

  it("preserves a selected answer across Next and Back navigation", async () => {
    const user = userEvent.setup();
    render(<StudentQuestionnaire />);
    await start(user);

    await user.click(selectOption(/sometimes/i));
    await user.click(screen.getByRole("button", { name: /^next$/i }));

    // On question 2, answer then go back to question 1.
    await user.click(selectOption(/always/i));
    await user.click(screen.getByRole("button", { name: /^back$/i }));

    // Question 1's "Sometimes" selection is still checked.
    expect(selectOption(/sometimes/i)).toBeChecked();
  });

  it("returns to the welcome screen from the first question's Back without losing answers", async () => {
    const user = userEvent.setup();
    render(<StudentQuestionnaire />);
    await start(user);

    await user.click(selectOption(/rarely/i));
    await user.click(screen.getByRole("button", { name: /^back$/i }));

    expect(
      screen.getByRole("heading", { name: /welcome/i }),
    ).toBeInTheDocument();

    // Resume: the earlier answer is still selected.
    await start(user);
    expect(selectOption(/rarely/i)).toBeChecked();
  });

  it("moves focus to the question heading after navigating forward", async () => {
    const user = userEvent.setup();
    render(<StudentQuestionnaire />);
    await start(user);

    await user.click(selectOption(/often/i));
    await user.click(screen.getByRole("button", { name: /^next$/i }));

    const heading = screen.getByRole("heading", {
      name: QUESTIONNAIRE[1].question,
    });
    expect(heading).toHaveFocus();
  });

  it("shows 'Submit answers' on the last question", async () => {
    const user = userEvent.setup();
    render(<StudentQuestionnaire />);
    await start(user);

    for (let i = 0; i < QUESTIONNAIRE.length - 1; i += 1) {
      await user.click(screen.getAllByRole("radio")[2]);
      await user.click(screen.getByRole("button", { name: /^next$/i }));
    }

    expect(
      screen.getByRole("button", { name: /submit answers/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^next$/i }),
    ).not.toBeInTheDocument();
  });

  it("clears state and navigates to the completion page on submit", async () => {
    const user = userEvent.setup();
    render(<StudentQuestionnaire />);
    await start(user);

    for (let i = 0; i < QUESTIONNAIRE.length; i += 1) {
      await user.click(screen.getAllByRole("radio")[3]);
      const submit = screen.queryByRole("button", { name: /submit answers/i });
      if (submit) {
        await user.click(submit);
      } else {
        await user.click(screen.getByRole("button", { name: /^next$/i }));
      }
    }

    expect(push).toHaveBeenCalledWith("/student/demo/complete");

    // State cleared: control returns to the welcome screen.
    expect(
      screen.getByRole("heading", { name: /welcome/i }),
    ).toBeInTheDocument();
  });

  it("never renders a student score, percentage, risk label, or recommendation", async () => {
    const user = userEvent.setup();
    const { container } = render(<StudentQuestionnaire />);
    await start(user);

    for (let i = 0; i < QUESTIONNAIRE.length; i += 1) {
      const text = container.textContent ?? "";
      expect(text).not.toMatch(/%/);
      expect(text).not.toMatch(/\bscore\b/i);
      expect(text).not.toMatch(/\brisk\b/i);
      expect(text).not.toMatch(/\brecommendation\b/i);
      expect(text).not.toMatch(/\bresult\b/i);

      await user.click(screen.getAllByRole("radio")[1]);
      const submit = screen.queryByRole("button", { name: /submit answers/i });
      if (submit) {
        await user.click(submit);
      } else {
        await user.click(screen.getByRole("button", { name: /^next$/i }));
      }
    }
  });

  it("keeps answers within the current question group (single selection)", async () => {
    const user = userEvent.setup();
    render(<StudentQuestionnaire />);
    await start(user);

    await user.click(selectOption(/never/i));
    await user.click(selectOption(/always/i));

    expect(selectOption(/never/i)).not.toBeChecked();
    expect(selectOption(/always/i)).toBeChecked();
    // sanity: option count is correct
    expect(ANSWER_OPTIONS).toHaveLength(5);
  });
});
