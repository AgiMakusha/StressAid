import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { StudentQuestionnaire } from "@/components/student/StudentQuestionnaire";

export const metadata: Metadata = {
  title: "Student questionnaire (demo)",
};

export default function StudentDemoPage() {
  return (
    <PageShell>
      <StudentQuestionnaire />
    </PageShell>
  );
}
