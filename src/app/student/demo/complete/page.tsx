import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { CompletionContent } from "@/components/student/CompletionContent";

export const metadata: Metadata = {
  title: "Thank you (demo)",
};

export default function StudentCompletePage() {
  return (
    <PageShell>
      <CompletionContent />
    </PageShell>
  );
}
