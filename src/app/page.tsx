import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import styles from "./page.module.css";

export default async function HomePage() {
  const locale = await getLocale();
  const m = getMessages(locale).landing;

  return (
    <PageShell>
      <section className={styles.hero}>
        <p className={styles.kicker}>{m.kicker}</p>
        <h1 className={styles.title}>StressAid</h1>
        <p className={styles.lede}>{m.lede}</p>
      </section>

      <section aria-labelledby="actions-heading" className={styles.linksSection}>
        <h2 id="actions-heading" className={styles.sectionHeading}>
          {m.getStarted}
        </h2>

        <div className={styles.actions}>
          <div className={styles.actionCard}>
            <h3 className={styles.actionTitle}>{m.answerTitle}</h3>
            <p className={styles.actionBody}>
              {m.answerBodyBefore}
              <code>/student/&lt;link-code&gt;</code>
              {m.answerBodyAfter}
            </p>
            <Link href="/student/demo" className={styles.secondaryAction}>
              {m.tryDemo}
            </Link>
          </div>

          <div className={styles.actionCard}>
            <h3 className={styles.actionTitle}>{m.teachersTitle}</h3>
            <p className={styles.actionBody}>{m.teachersBody}</p>
            <div className={styles.actionButtons}>
              <Link href="/teacher/login" className={styles.primaryAction}>
                {m.teacherSignIn}
              </Link>
              <Link href="/teacher/signup" className={styles.secondaryAction}>
                {m.createTestAccount}
              </Link>
            </div>
          </div>
        </div>

        <p className={styles.privacyLink}>
          <Link href="/privacy">{m.privacyLink}</Link>
        </p>
      </section>
    </PageShell>
  );
}
