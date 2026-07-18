import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocaleProvider } from "@/lib/i18n";

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

function clearCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (name) {
      document.cookie = `${name}=; path=/; max-age=0`;
    }
  }
}

beforeEach(() => {
  refresh.mockReset();
  clearCookies();
});

describe("LanguageSwitcher", () => {
  it("marks the active interface language", () => {
    render(
      <LocaleProvider locale="it">
        <LanguageSwitcher />
      </LocaleProvider>,
    );
    expect(screen.getByRole("button", { name: "IT" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("persists the chosen language in the locale cookie and refreshes", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="en">
        <LanguageSwitcher />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: "IT" }));

    expect(document.cookie).toContain("stressaid_locale=it");
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("does not write identity or answers into the cookie", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="en">
        <LanguageSwitcher />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: "IT" }));

    // Only the locale cookie is present, holding just "it".
    expect(document.cookie).toBe("stressaid_locale=it");
  });
});
