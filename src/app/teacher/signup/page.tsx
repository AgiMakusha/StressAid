import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Create teacher account" };
export const dynamic = "force-dynamic";

export default function TeacherSignupPage() {
  return (
    <PageShell>
      <SignupForm />
    </PageShell>
  );
}
