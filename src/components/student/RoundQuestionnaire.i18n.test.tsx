import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoundQuestionnaire } from "./RoundQuestionnaire";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ rpc }),
}));

const PUBLIC_CODE = "11111111-1111-1111-1111-111111111111";

const IT_QUESTIONS = [
  "Vengo a scuola con curiosità ed entusiasmo.",
  "Mi sento al sicuro a scuola.",
  "Mi piace scoprire cose nuove e imparare nuove materie.",
  "Non mi preoccupo di perdermi le cose che fanno i miei amici.",
  "Non mi sento solo o sola a scuola.",
  "So dove trovare informazioni su orari, compiti e attività della classe.",
];

const IT_ANSWERS: [number, RegExp][] = [
  [0, /^Mai$/],
  [1, /^Raramente$/],
  [2, /^A volte$/],
  [3, /^Spesso$/],
  [4, /^Sempre$/],
];

function renderRound(language: string) {
  return render(
    <RoundQuestionnaire
      publicCode={PUBLIC_CODE}
      title="Controllo autunnale"
      classDisplayName="Classe 8B"
      roundDisplayName="Rilevazione 1"
      language={language}
    />,
  );
}

beforeEach(() => {
  rpc.mockReset();
});

describe("student questionnaire follows the campaign language", () => {
  it("shows English content for an English campaign", async () => {
    const user = userEvent.setup();
    renderRound("en");
    await user.click(screen.getByRole("button", { name: /start/i }));
    expect(
      screen.getByRole("heading", {
        name: "I am coming to school curious and excited.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /never/i })).toBeInTheDocument();
  });

  it("shows the Italian welcome and start control for an Italian campaign", () => {
    renderRound("it");
    expect(screen.getByRole("heading", { name: "Benvenuto!" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "La tua voce ci aiuta a rendere la scuola un posto migliore per tutti.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inizia" })).toBeInTheDocument();
  });

  it("shows all six Italian questions in order with Italian answer labels", async () => {
    const user = userEvent.setup();
    renderRound("it");
    await user.click(screen.getByRole("button", { name: "Inizia" }));

    for (let i = 0; i < IT_QUESTIONS.length; i += 1) {
      expect(
        screen.getByRole("heading", { name: IT_QUESTIONS[i] }),
      ).toBeInTheDocument();

      // Italian answer labels sit in the exact 0–4 order.
      for (const [value, label] of IT_ANSWERS) {
        const radio = screen.getByRole("radio", { name: label });
        expect(radio).toHaveAttribute("value", String(value));
      }

      await user.click(screen.getByRole("radio", { name: /^Spesso$/ }));
      if (i < IT_QUESTIONS.length - 1) {
        await user.click(screen.getByRole("button", { name: "Avanti" }));
      }
    }

    // Final control is the Italian submit label.
    expect(
      screen.getByRole("button", { name: "Invia le risposte" }),
    ).toBeInTheDocument();
  });

  it("shows the Italian completion screen with no personal result", async () => {
    rpc.mockResolvedValue({ data: { success: true }, error: null });
    const user = userEvent.setup();
    const { container } = renderRound("it");
    await user.click(screen.getByRole("button", { name: "Inizia" }));

    for (let i = 0; i < IT_QUESTIONS.length - 1; i += 1) {
      await user.click(screen.getByRole("radio", { name: /^Spesso$/ }));
      await user.click(screen.getByRole("button", { name: "Avanti" }));
    }
    await user.click(screen.getByRole("radio", { name: /^Spesso$/ }));
    await user.click(screen.getByRole("button", { name: "Invia le risposte" }));

    expect(
      await screen.findByRole("heading", { name: "Grazie!" }),
    ).toBeInTheDocument();

    const text = container.textContent ?? "";
    expect(text).not.toMatch(/%/);
    expect(text).not.toMatch(/\bpunteggio\b/i);
    expect(text).not.toMatch(/\bscore\b/i);
    expect(text).not.toMatch(/\brischio\b/i);
  });
});
