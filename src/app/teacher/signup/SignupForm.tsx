"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "../auth-actions";
import styles from "../auth.module.css";

const initialState: AuthState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState,
  );

  return (
    <section className={styles.card} aria-labelledby="signup-heading">
      <div>
        <h1 id="signup-heading" className={styles.title}>
          Create a teacher test account
        </h1>
        <p className={styles.lede}>
          Hackathon beta — use synthetic or test data only.
        </p>
      </div>

      <form className={styles.form} action={formAction}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
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
            Password
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
          {isPending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className={styles.altLink}>
        Already have an account? <Link href="/teacher/login">Sign in</Link>
      </p>
    </section>
  );
}
