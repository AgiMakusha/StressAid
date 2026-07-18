import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeacherDashboard } from "./TeacherDashboard";
import {
  BELOW_THRESHOLD_DASHBOARD,
  THRESHOLD_REACHED_DASHBOARD,
} from "@/lib/teacher/fixtures";
import { QUESTIONNAIRE } from "@/lib/questionnaire";

describe("TeacherDashboard — threshold reached", () => {
  it("shows a prominent Demo data label", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    expect(screen.getByText(/demo data/i)).toBeInTheDocument();
    expect(screen.getByText(/demo snapshot/i)).toBeInTheDocument();
  });

  it("renders the Class Environment Wheel", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    expect(
      screen.getByRole("group", { name: /class environment wheel/i }),
    ).toBeInTheDocument();
  });

  it("keeps the overview list in canonical section order", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    // Overview rows are <button aria-pressed> with a section name.
    const overviewButtons = screen
      .getAllByRole("button")
      .filter(
        (el) =>
          el.tagName === "BUTTON" && el.hasAttribute("aria-pressed"),
      );
    const names = QUESTIONNAIRE.map((s) => s.name);
    const orderedNames = overviewButtons
      .map((button) =>
        names.find((name) => within(button).queryByText(name)),
      )
      .filter((name): name is string => Boolean(name));
    expect(orderedNames).toEqual(names);
  });

  it("defaults the detail panel to the lowest-scoring section (Safety)", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Safety");
  });

  it("shows visible count and percentage for all five answer categories", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    // header + five categories
    expect(rows).toHaveLength(6);
    // Safety: rarely = 5 students, 27.8% (sometimes is also 5 → two matches)
    expect(within(table).getAllByText("5 students").length).toBe(2);
    expect(within(table).getAllByText("27.8%").length).toBeGreaterThan(0);
    // always = 1 → singular "1 student"
    expect(within(table).getByText("1 student")).toBeInTheDocument();
  });

  it("updates the detail panel when another section is selected", async () => {
    const user = userEvent.setup();
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    const moodButton = screen
      .getAllByRole("button")
      .find((b) => within(b).queryByText("Mood") && b.tagName === "BUTTON")!;
    await user.click(moodButton);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Mood");
  });

  it("selects a section via keyboard on the wheel", async () => {
    const user = userEvent.setup();
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    const engagementSegment = screen.getByRole("button", {
      name: /engagement,.*select section/i,
    });
    engagementSegment.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Engagement",
    );
  });

  it("renders exactly six section controls on the donut (one tab stop each)", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    const wheel = screen.getByRole("group", {
      name: /class environment wheel/i,
    });
    const controls = within(wheel).getAllByRole("button");
    expect(controls).toHaveLength(6);
    // Each is a single control with a pressed state; bands are not controls.
    controls.forEach((control) => {
      expect(control).toHaveAttribute("aria-pressed");
      expect(control).toHaveAttribute("tabindex", "0");
    });
  });

  it("shows all six section names and their percentages on the donut", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    const wheel = screen.getByRole("group", {
      name: /class environment wheel/i,
    });
    const expectedPercents: Record<string, string> = {
      Mood: "61%",
      Safety: "39%",
      Engagement: "67%",
      FOMO: "47%",
      "Social Aspects": "58%",
      Predictability: "74%",
    };
    for (const section of QUESTIONNAIRE) {
      expect(wheel).toHaveTextContent(section.name);
      expect(wheel).toHaveTextContent(expectedPercents[section.name]);
    }
  });

  it("gives each section control an accessible name with all five distribution percentages", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    const safety = screen.getByRole("button", {
      name: /safety, 39 percent, needs attention\. never 22\.2 percent, rarely 27\.8 percent, sometimes 27\.8 percent, often 16\.7 percent, always 5\.6 percent\. select section\./i,
    });
    expect(safety).toBeInTheDocument();
  });

  it("shows a legend listing response categories inner-to-outer", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    expect(screen.getByText("Response distribution")).toBeInTheDocument();
    expect(screen.getByText(/from the centre outward/i)).toBeInTheDocument();
    const legendHeading = screen.getByText("Response distribution");
    const legend = legendHeading.closest("div")!;
    const items = within(legend)
      .getAllByRole("listitem")
      .map((li) => li.textContent);
    expect(items[0]).toMatch(/^Never/);
    expect(items[0]).toMatch(/innermost/i);
    expect(items[4]).toMatch(/^Always/);
    expect(items[4]).toMatch(/outermost/i);
    expect(items.map((t) => t?.replace(/innermost|outermost/gi, "").trim())).toEqual([
      "Never",
      "Rarely",
      "Sometimes",
      "Often",
      "Always",
    ]);
  });

  it("keeps the overall score and interpretation in the donut centre", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    const wheel = screen.getByRole("group", {
      name: /class environment wheel/i,
    });
    expect(wheel).toHaveTextContent("58%");
    expect(wheel).toHaveTextContent("Overall");
    expect(wheel).toHaveTextContent("Monitor");
  });

  it("does not render any exact student questionnaire wording", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    for (const section of QUESTIONNAIRE) {
      expect(screen.queryByText(section.question)).not.toBeInTheDocument();
    }
  });

  it("does not reference student illustrations", () => {
    const { container } = render(
      <TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />,
    );
    expect(container.innerHTML).not.toContain("Illustration 1_v2");
    expect(container.innerHTML).not.toContain("Illustration 2_v2");
  });

  it("announces the selected section via an aria-live region", () => {
    render(<TeacherDashboard data={THRESHOLD_REACHED_DASHBOARD} />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/selected section: safety/i);
  });
});

describe("TeacherDashboard — below threshold", () => {
  it("explains why results are unavailable", () => {
    render(<TeacherDashboard data={BELOW_THRESHOLD_DASHBOARD} />);
    expect(
      screen.getByRole("heading", { name: /results are not available yet/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/protect student anonymity/i)).toBeInTheDocument();
  });

  it("renders no wheel and no aggregate values", () => {
    const { container } = render(
      <TeacherDashboard data={BELOW_THRESHOLD_DASHBOARD} />,
    );
    expect(
      screen.queryByRole("group", { name: /class environment wheel/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    // No section percentage badges or interpretation labels leaked into DOM.
    expect(container.innerHTML).not.toMatch(/Needs attention/i);
    expect(container.innerHTML).not.toMatch(/\b39%\b/);
  });

  it("still shows the Demo data label", () => {
    render(<TeacherDashboard data={BELOW_THRESHOLD_DASHBOARD} />);
    expect(screen.getByText(/demo data/i)).toBeInTheDocument();
  });
});
