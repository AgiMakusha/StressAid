import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoundQuestionnaire } from "./RoundQuestionnaire";
import { QUESTIONNAIRE } from "@/lib/questionnaire";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ rpc }),
}));

const PUBLIC_CODE = "11111111-1111-1111-1111-111111111111";

function renderRound() {
  return render(
    <RoundQuestionnaire
      publicCode={PUBLIC_CODE}
      title="Autumn check-in"
      classDisplayName="Class 8B"
      roundDisplayName="Round 1"
    />,
  );
}

/** Start, answer every question, and stop on the final "Submit answers" screen. */
async function fillToSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /start/i }));
  for (let i = 0; i < QUESTIONNAIRE.length - 1; i += 1) {
    await user.click(screen.getAllByRole("radio")[3]); // "Often" = 3
    await user.click(screen.getByRole("button", { name: /^next$/i }));
  }
  await user.click(screen.getAllByRole("radio")[3]);
}

beforeEach(() => {
  rpc.mockReset();
});

describe("RoundQuestionnaire", () => {
  it("submits all six answers atomically and then shows the completion screen", async () => {
    rpc.mockResolvedValue({ data: { success: true }, error: null });
    const user = userEvent.setup();
    renderRound();

    await fillToSubmit(user);
    await user.click(screen.getByRole("button", { name: /submit answers/i }));

    expect(rpc).toHaveBeenCalledTimes(1);
    const [fnName, args] = rpc.mock.calls[0];
    expect(fnName).toBe("submit_round_response");
    expect(args.p_public_code).toBe(PUBLIC_CODE);
    const keys = Object.keys(args.p_answers);
    expect(keys.sort()).toEqual(
      ["engagement", "fomo", "mood", "predictability", "safety", "socialAspects"].sort(),
    );
    Object.values(args.p_answers).forEach((v) => {
      expect(typeof v).toBe("number");
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(4);
    });

    // Completion shown only after success.
    expect(
      await screen.findByRole("heading", { name: /thank you/i }),
    ).toBeInTheDocument();
  });

  it("prevents a double submission from a rapid second click", async () => {
    let resolveRpc: (value: unknown) => void = () => {};
    rpc.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRpc = resolve;
        }),
    );
    const user = userEvent.setup();
    renderRound();

    await fillToSubmit(user);
    const submit = screen.getByRole("button", { name: /submit answers|sending/i });
    await user.click(submit);
    await user.click(submit); // second click while in flight

    expect(rpc).toHaveBeenCalledTimes(1);

    resolveRpc({ data: { success: true }, error: null });
    expect(
      await screen.findByRole("heading", { name: /thank you/i }),
    ).toBeInTheDocument();
  });

  it("keeps the student on the questionnaire and shows an error if submission fails", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "boom" } });
    const user = userEvent.setup();
    renderRound();

    await fillToSubmit(user);
    await user.click(screen.getByRole("button", { name: /submit answers/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /thank you/i }),
    ).not.toBeInTheDocument();
  });
});
