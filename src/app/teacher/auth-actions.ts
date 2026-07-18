"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

export interface AuthState {
  error?: string;
  notice?: string;
}

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const auth = getMessages(await getLocale()).auth;
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: auth.genericSignInError };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: auth.genericSignInError };
  }

  redirect("/teacher/dashboard");
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const auth = getMessages(await getLocale()).auth;
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || password.length < 6) {
    return { error: auth.signupValidationError };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${getSiteUrl()}/teacher/login` },
  });

  if (error) {
    return { error: auth.genericSignUpError };
  }

  // Configuration 1: signup returns an active session -> straight to dashboard.
  if (data.session) {
    redirect("/teacher/dashboard");
  }

  // Configuration 2: email confirmation required. Same code path either way.
  return { notice: auth.confirmEmailNotice };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/teacher/login");
}
