"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMessages, useLocale } from "@/lib/i18n";
import { signInAction, type AuthState } from "../auth-actions";
import styles from "../auth.module.css";

const initialState: AuthState = {};

export function LoginForm() {
  const locale = useLocale();
  const m = getMessages(locale).auth;
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState,
  );

  return (
    <div className={styles.panel}>
      <section className={styles.card} aria-labelledby="login-heading">
        <div className={styles.cardHeader}>
          <Image
            src="/brand/Teacher/Predictability.svg"
            alt=""
            width={120}
            height={120}
            className={styles.cardIcon}
            unoptimized
          />
        </div>

        <div>
          <h1 id="login-heading" className={styles.title}>
            {m.signInTitle}
          </h1>
          <p className={styles.lede}>{m.signInLede}</p>
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
              autoComplete="current-password"
              required
            />
          </div>

          {state.error ? (
            <p className={styles.error} role="alert">
              {state.error}
            </p>
          ) : null}

          <button className={styles.submit} type="submit" disabled={isPending}>
            {isPending ? m.signingIn : m.signInButton}
          </button>
        </form>

        <p className={styles.altLink}>
          {m.noAccountPrompt}{" "}
          <Link href="/teacher/signup">{m.createAccountLink}</Link>
        </p>
      </section>
    </div>
  );
}
