import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompletionContent } from "./CompletionContent";

describe("CompletionContent", () => {
  it("shows only generic collective feedback", () => {
    render(<CompletionContent />);
    expect(screen.getByRole("heading", { name: /thank you/i })).toBeInTheDocument();
    expect(
      screen.getByText(/recorded anonymously/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/create a better school for all students/i),
    ).toBeInTheDocument();
  });

  it("contains no individual score, percentage, risk label, or recommendation", () => {
    const { container } = render(<CompletionContent />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/%/);
    expect(text).not.toMatch(/\bscore\b/i);
    expect(text).not.toMatch(/\brisk\b/i);
    expect(text).not.toMatch(/\bresult\b/i);
    expect(text).not.toMatch(/\brecommendation\b/i);
  });

  it("links back to the landing page and not to the questionnaire", () => {
    render(<CompletionContent />);
    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toHaveAttribute("href", "/");

    const questionnaireLink = screen.queryByRole("link", {
      name: /questionnaire|start|again|restart/i,
    });
    expect(questionnaireLink).toBeNull();
  });

  it("uses only Illustration 2 as a decorative image", () => {
    const { container } = render(<CompletionContent />);
    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(1);
    expect(imgs[0].getAttribute("src")).toContain("Illustration 2_v2.svg");
    expect(imgs[0].getAttribute("alt")).toBe("");
  });
});
