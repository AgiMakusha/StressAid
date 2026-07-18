import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy & cookies",
};

export default async function PrivacyPage() {
  const locale = await getLocale();
  const m = getMessages(locale).privacy;

  return (
    <PageShell>
      <div className={styles.page}>
        <Image
          src="/brand/Illustration 2_v1.svg"
          alt=""
          width={616}
          height={596}
          className={styles.backgroundArt}
          aria-hidden
          unoptimized
        />
        <div className={styles.content}>
          <h1>{m.title}</h1>
          <p>{m.p1}</p>
          <p>{m.p2}</p>

          <h2 className={styles.sectionTitle}>{m.cookiesTitle}</h2>
          <p>{m.cookiesIntro}</p>
          <ul className={styles.cookieList}>
            <li>{m.cookieAuth}</li>
            <li>{m.cookieLocale}</li>
          </ul>
          <p>{m.cookiesNoTracking}</p>
          <p>{m.cookiesEssentialOnly}</p>

          <p className={styles.backRow}>
            <Link href="/" className={styles.backButton}>
              {m.backToHome}
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
