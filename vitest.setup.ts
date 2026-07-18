import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from "react";

afterEach(() => {
  cleanup();
});

// Render next/image as a plain <img> in tests. This keeps the real src/alt so
// assertions about which illustration is used still work, without pulling in
// the Next.js image optimisation runtime. Next-specific boolean props are
// stripped to avoid React DOM warnings.
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
    width,
    height,
  }: {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
  }) =>
    React.createElement("img", { src, alt, className, width, height }),
}));
