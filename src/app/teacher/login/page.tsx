import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Teacher sign in" };
export const dynamic = "force-dynamic";

export default function TeacherLoginPage() {
  return (
    <PageShell>
      <LoginForm />
    </PageShell>
  );
}
