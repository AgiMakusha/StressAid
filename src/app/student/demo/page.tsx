import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Student questionnaire (demo)",
};

export default function StudentDemoPage() {
  return (
    <PageShell>
      <h1>Student questionnaire</h1>
      <p>
        This is a placeholder for the anonymous student questionnaire. The
        questions, answer scale, and submission flow are not implemented yet.
      </p>
      <p>
        No name, email, or other identifying information will ever be requested
        here.
      </p>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </PageShell>
  );
}
