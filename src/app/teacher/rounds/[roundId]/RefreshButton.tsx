"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RefreshButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={className}
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
    >
      {pending ? "Refreshing…" : "Refresh results"}
    </button>
  );
}
