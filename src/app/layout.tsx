import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: {
    default: "StressAid — SHU2026 MVP",
    template: "%s · StressAid",
  },
  description:
    "StressAid is a privacy-first school environment feedback tool. Students answer a short anonymous questionnaire and results are shown to teachers at class level only.",
  applicationName: "StressAid",
  icons: {
    icon: [{ url: "/brand/Bird.png", type: "image/png" }],
    apple: [{ url: "/brand/Bird.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#081c2c",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
