"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/env";

/**
 * Browser Supabase client for authentication and the approved ANONYMOUS RPCs
 * (public round metadata + aggregate submission). Never used with a
 * service-role key. Created lazily so no env access happens at import.
 */
export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
