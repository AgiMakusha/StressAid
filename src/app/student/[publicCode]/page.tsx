import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { RoundQuestionnaire } from "@/components/student/RoundQuestionnaire";
import { createClient } from "@/lib/supabase/server";
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

function Unavailable() {
  return (
    <section className={styles.card} aria-labelledby="unavailable-heading">
      <h1 id="unavailable-heading" className={styles.title}>
        This questionnaire isn&apos;t available
      </h1>
      <p className={styles.body}>
        The link may be incomplete, or this round is no longer open. Please
        check the link your teacher gave you.
      </p>
      <Link href="/" className={styles.homeLink}>
        Back to home
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

  if (!UUID_RE.test(publicCode)) {
    return (
      <PageShell>
        <Unavailable />
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
        <Unavailable />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <RoundQuestionnaire
        publicCode={publicCode}
        title={round.title ?? ""}
        classDisplayName={round.classDisplayName ?? ""}
        roundDisplayName={round.roundDisplayName ?? ""}
      />
    </PageShell>
  );
}
