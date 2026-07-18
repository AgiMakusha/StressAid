import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard";
import { createClient } from "@/lib/supabase/server";
import {
  mapRoundDashboard,
  type RoundDashboardResponse,
} from "@/lib/teacher/mapRoundDashboard";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { setRoundStatusAction } from "../../campaign-actions";
import { RefreshButton } from "./RefreshButton";
import styles from "./round.module.css";

export const metadata: Metadata = { title: "Round results" };
export const dynamic = "force-dynamic";

export default async function RoundResultsPage({
  params,
}: {
  params: Promise<{ roundId: string }>;
}) {
  const { roundId } = await params;
  const locale = await getLocale();
  const r = getMessages(locale).roundResults;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/teacher/login");
  }

  const { data, error } = await supabase.rpc("get_round_dashboard", {
    p_round_id: roundId,
  });

  if (error || !data) {
    return (
      <PageShell variant="wide">
        <div className={styles.notFound}>
          <h1>{r.unavailableTitle}</h1>
          <p>{r.unavailableBody}</p>
          <Link href="/teacher/dashboard" className={styles.btnPrimary}>
            {r.backToCampaigns}
          </Link>
        </div>
      </PageShell>
    );
  }

  const payload = data as unknown as RoundDashboardResponse;
  const dashboardData = mapRoundDashboard(payload, locale);
  const { meta } = payload;
  const isLive = meta.status === "live";

  return (
    <PageShell variant="wide">
      <div className={styles.context}>
        <div className={styles.contextTop}>
          <h1 className={styles.roundName}>
            {meta.title} — {meta.roundDisplayName}
          </h1>
          <div className={styles.actions}>
            <Link href="/teacher/dashboard" className={styles.btnPrimary}>
              {r.backToCampaigns}
            </Link>
            <RefreshButton className={styles.btn} />
            <form action={setRoundStatusAction}>
              <input type="hidden" name="roundId" value={roundId} />
              <input
                type="hidden"
                name="status"
                value={isLive ? "closed" : "live"}
              />
              <button type="submit" className={styles.btn}>
                {isLive ? r.closeRound : r.reopenRound}
              </button>
            </form>
          </div>
        </div>
      </div>

      <TeacherDashboard data={dashboardData} locale={locale} />

      <p className={styles.backRow}>
        <Link href="/teacher/dashboard" className={styles.btnPrimary}>
          {r.backToCampaigns}
        </Link>
      </p>
    </PageShell>
  );
}
