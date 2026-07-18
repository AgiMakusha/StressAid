import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { LocaleProvider, type Locale } from "@/lib/i18n";
import { LoginForm } from "./login/LoginForm";
import { SignupForm } from "./signup/SignupForm";
import { CampaignManager } from "./dashboard/CampaignManager";

// The auth behaviour is unchanged; we only render the (localised) UI, so the
// server actions are mocked to avoid loading server-only modules in jsdom.
vi.mock("@/app/teacher/auth-actions", () => ({
  signInAction: vi.fn(),
  signUpAction: vi.fn(),
  signOutAction: vi.fn(),
}));
vi.mock("@/app/teacher/campaign-actions", () => ({
  createCampaignAction: vi.fn(),
  startRoundAction: vi.fn(),
  setRoundStatusAction: vi.fn(),
}));

function renderWithLocale(locale: Locale, ui: React.ReactElement) {
  return render(<LocaleProvider locale={locale}>{ui}</LocaleProvider>);
}

describe("teacher auth UI renders in both languages", () => {
  it("shows the English sign-in form", () => {
    renderWithLocale("en", <LoginForm />);
    expect(
      screen.getByRole("heading", { name: "Teacher sign in" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows the Italian sign-in form", () => {
    renderWithLocale("it", <LoginForm />);
    expect(
      screen.getByRole("heading", { name: "Accesso insegnanti" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accedi" })).toBeInTheDocument();
  });

  it("shows the English sign-up form", () => {
    renderWithLocale("en", <SignupForm />);
    expect(
      screen.getByRole("heading", { name: "Create a teacher test account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeInTheDocument();
  });

  it("shows the Italian sign-up form", () => {
    renderWithLocale("it", <SignupForm />);
    expect(
      screen.getByRole("heading", {
        name: "Crea un account insegnante di prova",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crea account" }),
    ).toBeInTheDocument();
  });
});

describe("campaign language selector", () => {
  const props = { campaigns: [], siteUrl: "https://example.test", userEmail: "" };

  it("offers English and Italiano and stores en / it values", () => {
    renderWithLocale("en", <CampaignManager {...props} />);
    const select = screen.getByRole("combobox");
    const options = within(select).getAllByRole("option");
    expect(options.map((o) => (o as HTMLOptionElement).value)).toEqual([
      "en",
      "it",
    ]);
    expect(options.map((o) => o.textContent)).toEqual(["English", "Italiano"]);
    // The language names are not themselves translated in the Italian UI.
    renderWithLocale("it", <CampaignManager {...props} />);
    const itSelect = screen.getAllByRole("combobox")[1];
    expect(
      within(itSelect)
        .getAllByRole("option")
        .map((o) => (o as HTMLOptionElement).value),
    ).toEqual(["en", "it"]);
  });
});
