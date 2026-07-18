import Image from "next/image";
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
        <h1 className={styles.title}>
          <Image
            src="/brand/stressaid-logo.svg"
            alt="StressAid"
            width={511}
            height={303}
            className={styles.heroLogo}
            priority
            unoptimized
          />
        </h1>
        <p className={styles.lede}>
          {m.lede}{" "}
          <Link href="/privacy" className={styles.ledePrivacyLink}>
            {m.privacyLink}
          </Link>
        </p>
      </section>

      <section aria-labelledby="actions-heading" className={styles.linksSection}>
        <div className={styles.sectionIntro}>
          <h2 id="actions-heading" className={styles.sectionHeading}>
            {m.getStarted}
          </h2>
        </div>

        <div className={styles.actions}>
          <article className={`${styles.actionCard} ${styles.actionCardStudent}`}>
            <div className={styles.cardHeader}>
              <Image
                src="/brand/Teacher/Mood.svg"
                alt=""
                width={120}
                height={120}
                className={styles.cardIcon}
                unoptimized
              />
              <p className={styles.roleLabel}>{m.studentsLabel}</p>
            </div>
            <h3 className={styles.actionTitle}>{m.answerTitle}</h3>
            <p className={styles.actionBody}>
              {m.answerBodyBefore}
              <code className={styles.codeChip}>/student/&lt;link-code&gt;</code>
              {m.answerBodyAfter}
            </p>
            <div className={styles.actionButtons}>
              <Link href="/student/demo" className={styles.studentAction}>
                {m.tryDemo}
              </Link>
            </div>
          </article>

          <article className={`${styles.actionCard} ${styles.actionCardTeacher}`}>
            <div className={styles.cardHeader}>
              <Image
                src="/brand/Teacher/Predictability.svg"
                alt=""
                width={120}
                height={120}
                className={styles.cardIcon}
                unoptimized
              />
              <p className={styles.roleLabel}>{m.teachersLabel}</p>
            </div>
            <h3 className={styles.actionTitle}>{m.teachersTitle}</h3>
            <p className={styles.actionBody}>{m.teachersBody}</p>
            <div className={styles.actionButtons}>
              <Link href="/teacher/login" className={styles.teacherAction}>
                {m.teacherSignIn}
              </Link>
              <Link href="/teacher/signup" className={styles.secondaryAction}>
                {m.createTestAccount}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
