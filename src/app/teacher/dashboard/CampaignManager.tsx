"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { CampaignSummary } from "@/lib/teacher/campaignTypes";
import { studentLink } from "@/lib/teacher/campaignTypes";
import { signOutAction } from "../auth-actions";
import {
  createCampaignAction,
  setRoundStatusAction,
  startRoundAction,
  type CreateCampaignState,
} from "../campaign-actions";
import styles from "./dashboard.module.css";

interface CampaignManagerProps {
  campaigns: CampaignSummary[];
  siteUrl: string;
  userEmail: string;
}

const initialCreateState: CreateCampaignState = {};

export function CampaignManager({
  campaigns,
  siteUrl,
  userEmail,
}: CampaignManagerProps) {
  const [createState, createAction, creating] = useActionState(
    createCampaignAction,
    initialCreateState,
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.heading}>Your campaigns</h1>
          {userEmail ? (
            <p className={styles.userLine}>Signed in as {userEmail}</p>
          ) : null}
        </div>
        <form action={signOutAction}>
          <button type="submit" className={styles.signOut}>
            Sign out
          </button>
        </form>
      </div>

      <p className={styles.betaNotice}>
        Hackathon beta — use synthetic or test data only.
      </p>

      <section className={styles.panel} aria-labelledby="create-heading">
        <h2 id="create-heading" className={styles.panelTitle}>
          Create campaign
        </h2>
        <form className={styles.form} action={createAction}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              Title
            </label>
            <input
              className={styles.input}
              id="title"
              name="title"
              type="text"
              maxLength={120}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="className">
              Class name
            </label>
            <input
              className={styles.input}
              id="className"
              name="className"
              type="text"
              maxLength={80}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="expected">
              Expected participants
            </label>
            <input
              className={styles.input}
              id="expected"
              name="expected"
              type="number"
              min={1}
              defaultValue={24}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="threshold">
              Anonymity threshold
            </label>
            <input
              className={styles.input}
              id="threshold"
              name="threshold"
              type="number"
              min={10}
              max={1000}
              defaultValue={10}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="language">
              Language
            </label>
            <select
              className={styles.select}
              id="language"
              name="language"
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="it">Italian</option>
            </select>
          </div>
          <div className={styles.formActions}>
            {createState.error ? (
              <p className={styles.error} role="alert">
                {createState.error}
              </p>
            ) : null}
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={creating}
            >
              {creating ? "Creating…" : "Create campaign"}
            </button>
          </div>
        </form>
      </section>

      {campaigns.length === 0 ? (
        <p className={styles.empty}>
          You have no campaigns yet. Create one above to get your first round
          and student link.
        </p>
      ) : (
        <ul className={styles.campaignList}>
          {campaigns.map((campaign) => (
            <li key={campaign.id} className={styles.campaignCard}>
              <div>
                <h2 className={styles.campaignTitle}>{campaign.title}</h2>
                <p className={styles.campaignMeta}>
                  {campaign.classDisplayName} · threshold{" "}
                  {campaign.minimumResponseThreshold} · expected{" "}
                  {campaign.expectedParticipantCount}
                </p>
              </div>

              <form className={styles.startRoundRow} action={startRoundAction}>
                <input type="hidden" name="campaignId" value={campaign.id} />
                <input
                  className={styles.input}
                  name="displayName"
                  type="text"
                  maxLength={80}
                  placeholder="New round name (optional)"
                  aria-label="New round name"
                />
                <button type="submit" className={styles.primaryBtn}>
                  Start new round
                </button>
              </form>

              {campaign.rounds.length === 0 ? (
                <p className={styles.empty}>No rounds yet.</p>
              ) : (
                <ul className={styles.roundList}>
                  {campaign.rounds.map((round) => (
                    <li key={round.id} className={styles.roundCard}>
                      <div className={styles.roundHead}>
                        <span className={styles.roundName}>
                          {round.displayName}
                        </span>
                        <span
                          className={styles.statusChip}
                          data-status={round.status}
                        >
                          {round.status === "live" ? "Live" : "Closed"}
                        </span>
                      </div>

                      <p className={styles.campaignMeta}>
                        {round.responseCount} responses
                      </p>

                      <div className={styles.linkRow}>
                        <span className={styles.linkText}>
                          {studentLink(siteUrl, round.publicCode)}
                        </span>
                        <CopyLinkButton
                          value={studentLink(siteUrl, round.publicCode)}
                        />
                      </div>

                      <div className={styles.roundActions}>
                        <Link
                          href={`/teacher/rounds/${round.id}`}
                          className={styles.secondaryBtn}
                        >
                          Open results
                        </Link>
                        <form action={setRoundStatusAction}>
                          <input
                            type="hidden"
                            name="roundId"
                            value={round.id}
                          />
                          <input
                            type="hidden"
                            name="status"
                            value={round.status === "live" ? "closed" : "live"}
                          />
                          <button type="submit" className={styles.secondaryBtn}>
                            {round.status === "live"
                              ? "Close round"
                              : "Reopen round"}
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CopyLinkButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className={styles.secondaryBtn} onClick={copy}>
      {copied ? "Copied!" : "Copy student link"}
    </button>
  );
}
