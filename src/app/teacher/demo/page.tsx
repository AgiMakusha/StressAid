import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Teacher dashboard (demo)",
};

export default function TeacherDemoPage() {
  return (
    <PageShell>
      <h1>Teacher dashboard</h1>
      <p>
        This is a placeholder for the teacher dashboard. Class aggregates, the
        Class Environment Wheel, section averages, and response distributions
        are not implemented yet.
      </p>
      <p>
        In the MVP this route will be protected server-side and will only ever
        show collective, threshold-protected results — never individual
        responses.
      </p>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </PageShell>
  );
}
