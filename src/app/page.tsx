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
        <p className={styles.note}>
          This is an early application foundation. The questionnaire, scoring,
          Class Environment Wheel, and teacher dashboard are not implemented yet.
        </p>
      </section>

      <section aria-labelledby="explore-heading" className={styles.linksSection}>
        <h2 id="explore-heading" className={styles.sectionHeading}>
          Placeholder routes
        </h2>
        <ul className={styles.linkList}>
          <li>
            <Link href="/student/demo">Student questionnaire (demo)</Link>
          </li>
          <li>
            <Link href="/student/demo/complete">Student completion (demo)</Link>
          </li>
          <li>
            <Link href="/teacher/demo">Teacher dashboard (demo)</Link>
          </li>
          <li>
            <Link href="/privacy">Privacy information</Link>
          </li>
        </ul>
      </section>
    </PageShell>
  );
}
