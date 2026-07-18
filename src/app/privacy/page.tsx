import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Privacy",
};

export default async function PrivacyPage() {
  const locale = await getLocale();
  const m = getMessages(locale).privacy;

  return (
    <PageShell>
      <h1>{m.title}</h1>
      <p>{m.p1}</p>
      <p>{m.p2}</p>
      <p>{m.p3}</p>
      <p>
        <Link href="/">{m.backToHome}</Link>
      </p>
    </PageShell>
  );
}
