import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Protected teacher areas. Unauthenticated users are redirected to login. */
const PROTECTED_PREFIXES = ["/teacher/dashboard", "/teacher/rounds"];

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/teacher/login";
  url.search = "";
  return NextResponse.redirect(url);
}

/**
 * Refreshes the Supabase auth session on every matched request (official SSR
 * pattern) and guards protected teacher routes server-side.
 *
 * Fail closed for protected routes and fail open for public ones if session
 * refresh cannot run (missing env or transient Auth errors), so a middleware
 * fault never takes down the whole site with MIDDLEWARE_INVOCATION_FAILED.
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    path.startsWith(prefix),
  );

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return isProtected ? redirectToLogin(request) : NextResponse.next({ request });
  }

  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    // IMPORTANT: getUser() revalidates the token; do not remove.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isProtected && !user) {
      return redirectToLogin(request);
    }

    return supabaseResponse;
  } catch {
    return isProtected ? redirectToLogin(request) : NextResponse.next({ request });
  }
}
