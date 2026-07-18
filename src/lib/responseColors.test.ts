import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guards that the response-colour CSS tokens consumed by the answer scale
 * resolve to the exact fixed hex values required by the spec, so the student
 * colours will match the future teacher visualisations.
 */
const tokensCss = readFileSync(
  resolve(process.cwd(), "src/styles/tokens.css"),
  "utf8",
);

function tokenValue(name: string): string | undefined {
  const match = tokensCss.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  return match?.[1]?.toLowerCase();
}

describe("fixed response colour tokens", () => {
  it("match the canonical hex values", () => {
    expect(tokenValue("--response-never")).toBe("#e71183");
    expect(tokenValue("--response-rarely")).toBe("#f07d00");
    expect(tokenValue("--response-sometimes")).toBe("#f7a704");
    expect(tokenValue("--response-often")).toBe("#009844");
    expect(tokenValue("--response-always")).toBe("#169eda");
  });
});
