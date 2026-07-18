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
          <h1>Results unavailable</h1>
          <p>
            This round could not be found, or it does not belong to your
            account.
          </p>
          <Link href="/teacher/dashboard" className={styles.btn}>
            Back to campaigns
          </Link>
        </div>
      </PageShell>
    );
  }

  const payload = data as unknown as RoundDashboardResponse;
  const dashboardData = mapRoundDashboard(payload);
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
            <Link href="/teacher/dashboard" className={styles.btn}>
              Back to campaigns
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
                {isLive ? "Close round" : "Reopen round"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <TeacherDashboard data={dashboardData} />
    </PageShell>
  );
}
