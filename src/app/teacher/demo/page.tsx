import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard";
import { THRESHOLD_REACHED_DASHBOARD } from "@/lib/teacher/fixtures";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Teacher dashboard (demo)",
};

/**
 * Frontend-only teacher dashboard demo. Uses the threshold-reached synthetic
 * fixture. There is no backend, authentication, persistence, or polling in this
 * step — the wider layout is opted in via the reusable PageShell "wide" variant.
 *
 * To preview the below-threshold state, swap the fixture for
 * BELOW_THRESHOLD_DASHBOARD.
 */
export default async function TeacherDemoPage() {
  const locale = await getLocale();
  const m = getMessages(locale);
  const data = {
    ...THRESHOLD_REACHED_DASHBOARD,
    campaign: {
      ...THRESHOLD_REACHED_DASHBOARD.campaign,
      nextCheckInLabel: m.teacherDashboard.exampleNextCheckIn,
    },
  };

  return (
    <PageShell variant="wide">
      <TeacherDashboard data={data} locale={locale} />
      <p className={styles.backRow}>
        <Link href="/" className={styles.backButton}>
          {m.privacy.backToHome}
        </Link>
      </p>
    </PageShell>
  );
}
