import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";
import type { CampaignSummary } from "@/lib/teacher/campaignTypes";
import { CampaignManager } from "./CampaignManager";

export const metadata: Metadata = { title: "Teacher dashboard" };
export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/teacher/login");
  }

  const { data, error } = await supabase.rpc("list_my_campaigns");
  const campaigns = (error ? [] : (data as CampaignSummary[] | null)) ?? [];

  return (
    <PageShell variant="wide">
      <CampaignManager
        campaigns={campaigns}
        siteUrl={getSiteUrl()}
        userEmail={user.email ?? ""}
      />
    </PageShell>
  );
}
