import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { CompletionContent } from "@/components/student/CompletionContent";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Thank you (demo)",
};

export default async function StudentCompletePage() {
  const locale = await getLocale();
  return (
    <PageShell>
      <CompletionContent locale={locale} />
    </PageShell>
  );
}
