/**
 * Lazy environment accessors. Values are read only when a Supabase-backed
 * operation actually runs — never at module import — so unrelated build steps
 * do not fail or leak values when Supabase is not configured.
 *
 * Only public Supabase configuration is used. There is no service-role key.
 * Values are never logged.
 */

function requireValue(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    // Message names the variable only — never its value.
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseUrl(): string {
  // Static literal key so Next.js can inline this into the browser bundle.
  return requireValue(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}

export function getSupabaseAnonKey(): string {
  // Static literal key so Next.js can inline this into the browser bundle.
  return requireValue(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Public site URL used for building absolute student links. Falls back to localhost. */
export function getSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (value && value.trim().length > 0) {
    return value.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}
