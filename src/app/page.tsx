import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <PageShell>
      <section className={styles.hero}>
        <p className={styles.kicker}>Social Hackathon Umbria 2026 — MVP</p>
        <h1 className={styles.title}>StressAid</h1>
        <p className={styles.lede}>
          StressAid is a privacy-first school environment feedback tool.
          Students answer a short, anonymous questionnaire. Answers are combined
          at class level and shown to teachers as collective signals — never as
          individual results.
        </p>
        <p className={styles.betaNotice}>
          Hackathon beta — use synthetic or test data only.
        </p>
      </section>

      <section aria-labelledby="actions-heading" className={styles.linksSection}>
        <h2 id="actions-heading" className={styles.sectionHeading}>
          Get started
        </h2>

        <div className={styles.actions}>
          <div className={styles.actionCard}>
            <h3 className={styles.actionTitle}>Answer a questionnaire</h3>
            <p className={styles.actionBody}>
              Open the questionnaire link provided by your teacher. It looks
              like <code>/student/&lt;link-code&gt;</code>.
            </p>
            <Link href="/student/demo" className={styles.secondaryAction}>
              Try the demo questionnaire
            </Link>
          </div>

          <div className={styles.actionCard}>
            <h3 className={styles.actionTitle}>Teachers</h3>
            <p className={styles.actionBody}>
              Sign in to create campaigns, start rounds, and view collective
              results.
            </p>
            <div className={styles.actionButtons}>
              <Link href="/teacher/login" className={styles.primaryAction}>
                Teacher sign in
              </Link>
              <Link href="/teacher/signup" className={styles.secondaryAction}>
                Create a teacher test account
              </Link>
            </div>
          </div>
        </div>

        <p className={styles.privacyLink}>
          <Link href="/privacy">Privacy information</Link>
        </p>
      </section>
    </PageShell>
  );
}
