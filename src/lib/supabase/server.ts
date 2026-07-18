import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/env";

/**
 * Cookie-based server Supabase client for protected teacher routes and server
 * actions (official Supabase SSR approach). Uses only the public anon key;
 * authorization is enforced by RLS and SECURITY DEFINER RPCs in the database.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component where cookies are read-only. The
          // middleware refreshes the session, so this can be safely ignored.
        }
      },
    },
  });
}
