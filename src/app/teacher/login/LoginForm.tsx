"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type AuthState } from "../auth-actions";
import styles from "../auth.module.css";

const initialState: AuthState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState,
  );

  return (
    <section className={styles.card} aria-labelledby="login-heading">
      <div>
        <h1 id="login-heading" className={styles.title}>
          Teacher sign in
        </h1>
        <p className={styles.lede}>
          Sign in to manage your class campaigns and rounds.
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
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className={styles.altLink}>
        No account yet?{" "}
        <Link href="/teacher/signup">Create a teacher test account</Link>
      </p>
    </section>
  );
}
