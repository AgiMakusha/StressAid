"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { getMessages, useLocale } from "@/lib/i18n";

export function RefreshButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const r = getMessages(useLocale()).roundResults;

  return (
    <button
      type="button"
      className={className}
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
    >
      {pending ? r.refreshing : r.refreshResults}
    </button>
  );
}
