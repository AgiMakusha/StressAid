"use client";

import { useActionState } from "react";
import Link from "next/link";
import { getMessages, useLocale } from "@/lib/i18n";
import { signUpAction, type AuthState } from "../auth-actions";
import styles from "../auth.module.css";

const initialState: AuthState = {};

export function SignupForm() {
  const locale = useLocale();
  const m = getMessages(locale).auth;
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState,
  );

  return (
    <section className={styles.card} aria-labelledby="signup-heading">
      <div>
        <h1 id="signup-heading" className={styles.title}>
          {m.signupTitle}
        </h1>
        <p className={styles.lede}>{m.signupLede}</p>
      </div>

      <form className={styles.form} action={formAction}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            {m.emailLabel}
          </label>
          <input
            className={styles.input}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            {m.passwordLabel}
          </label>
          <input
            className={styles.input}
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        {state.error ? (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        ) : null}
        {state.notice ? (
          <p className={styles.notice} role="status">
            {state.notice}
          </p>
        ) : null}

        <button className={styles.submit} type="submit" disabled={isPending}>
          {isPending ? m.creatingAccount : m.createAccountButton}
        </button>
      </form>

      <p className={styles.altLink}>
        {m.haveAccountPrompt} <Link href="/teacher/login">{m.signInLink}</Link>
      </p>
    </section>
  );
}
