import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Thank you (demo)",
};

export default function StudentCompletePage() {
  return (
    <PageShell>
      <h1>Thank you</h1>
      <p>
        This is a placeholder for the generic completion screen. Every student
        sees the same message — no individual score, interpretation, or
        recommendation is ever shown.
      </p>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </PageShell>
  );
}
