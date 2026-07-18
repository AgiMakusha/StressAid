import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { RoundQuestionnaire } from "@/components/student/RoundQuestionnaire";
import { createClient } from "@/lib/supabase/server";
import { getMessages, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import styles from "./unavailable.module.css";

export const metadata: Metadata = { title: "Class questionnaire" };
export const dynamic = "force-dynamic";

interface PublicRound {
  available: boolean;
  title?: string;
  classDisplayName?: string;
  roundDisplayName?: string;
  language?: string;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The unavailable page uses the interface (cookie) language, since a bad or
 * closed link has no associated campaign language to follow.
 */
function Unavailable({ locale }: { locale: Locale }) {
  const s = getMessages(locale).student;
  return (
    <section className={styles.card} aria-labelledby="unavailable-heading">
      <h1 id="unavailable-heading" className={styles.title}>
        {s.unavailableTitle}
      </h1>
      <p className={styles.body}>{s.unavailableBody}</p>
      <Link href="/" className={styles.homeLink}>
        {s.homeLink}
      </Link>
    </section>
  );
}

export default async function StudentRoundPage({
  params,
}: {
  params: Promise<{ publicCode: string }>;
}) {
  const { publicCode } = await params;
  const locale = await getLocale();

  if (!UUID_RE.test(publicCode)) {
    return (
      <PageShell>
        <Unavailable locale={locale} />
      </PageShell>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_round", {
    p_public_code: publicCode,
  });

  const round = (error ? null : (data as unknown as PublicRound | null)) ?? null;

  if (!round || round.available !== true) {
    return (
      <PageShell>
        <Unavailable locale={locale} />
      </PageShell>
    );
  }

  return (
    <PageShell showLocaleSwitcher={false}>
      <RoundQuestionnaire
        publicCode={publicCode}
        title={round.title ?? ""}
        classDisplayName={round.classDisplayName ?? ""}
        roundDisplayName={round.roundDisplayName ?? ""}
        language={round.language}
      />
    </PageShell>
  );
}
