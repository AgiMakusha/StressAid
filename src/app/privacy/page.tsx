import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <h1>Privacy</h1>
      <p>
        StressAid is designed to be privacy-first. It does not ask for a
        student&apos;s name, email, student ID, date of birth, or any other
        identifying information.
      </p>
      <p>
        Answers are combined at class level and shown to teachers only as
        collective signals. Individual responses are never shown.
      </p>
      <p>
        This is a placeholder page. The full child-friendly notice and adult
        privacy information will be added in a later step.
      </p>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </PageShell>
  );
}
