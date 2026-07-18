"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";

export interface AuthState {
  error?: string;
  notice?: string;
}

/**
 * Generic, non-enumerating messages. We never reveal whether an email already
 * exists or already owns campaigns.
 */
const GENERIC_SIGNIN_ERROR =
  "We couldn't sign you in. Check your email and password and try again.";
const GENERIC_SIGNUP_ERROR =
  "We couldn't create your account right now. Please try again.";
const CONFIRM_EMAIL_NOTICE =
  "Check your email to confirm your account, then return to sign in.";

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: GENERIC_SIGNIN_ERROR };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: GENERIC_SIGNIN_ERROR };
  }

  redirect("/teacher/dashboard");
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || password.length < 6) {
    return {
      error:
        "Enter a valid email and a password of at least 6 characters.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${getSiteUrl()}/teacher/login` },
  });

  if (error) {
    return { error: GENERIC_SIGNUP_ERROR };
  }

  // Configuration 1: signup returns an active session -> straight to dashboard.
  if (data.session) {
    redirect("/teacher/dashboard");
  }

  // Configuration 2: email confirmation required. Same code path either way.
  return { notice: CONFIRM_EMAIL_NOTICE };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/teacher/login");
}
