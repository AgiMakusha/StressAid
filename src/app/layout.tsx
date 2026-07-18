import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StressAid — SHU2026 MVP",
    template: "%s · StressAid",
  },
  description:
    "StressAid is a privacy-first school environment feedback tool. Students answer a short anonymous questionnaire and results are shown to teachers at class level only.",
  applicationName: "StressAid",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#081c2c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
