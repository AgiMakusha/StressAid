"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CampaignSummary } from "@/lib/teacher/campaignTypes";
import { studentLink } from "@/lib/teacher/campaignTypes";
import { getMessages, useLocale } from "@/lib/i18n";
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
  const locale = useLocale();
  const d = getMessages(locale).dashboard;
  const [createState, createAction, creating] = useActionState(
    createCampaignAction,
    initialCreateState,
  );

  return (
    <div className={styles.shell}>
      <div className={styles.wrap}>
        <div className={styles.topBar}>
          <div className={styles.headingBlock}>
            <Image
              src="/brand/Teacher/Safety.svg"
              alt=""
              width={120}
              height={120}
              className={styles.headingIcon}
              unoptimized
            />
            <div>
              <h1 className={styles.heading}>{d.yourCampaigns}</h1>
              {userEmail ? (
                <p className={styles.userLine}>{d.signedInAs(userEmail)}</p>
              ) : null}
            </div>
          </div>
          <form action={signOutAction}>
            <button type="submit" className={styles.signOut}>
              {d.signOut}
            </button>
          </form>
        </div>

        <section className={styles.panel} aria-labelledby="create-heading">
          <h2 id="create-heading" className={styles.panelTitle}>
            {d.createCampaign}
          </h2>
        <form className={styles.form} action={createAction}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              {d.titleLabel}
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
              {d.classNameLabel}
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
              {d.expectedLabel}
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
              {d.thresholdLabel}
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
              {d.languageLabel}
            </label>
            <select
              className={styles.select}
              id="language"
              name="language"
              defaultValue="en"
            >
              <option value="en">{d.langEnglish}</option>
              <option value="it">{d.langItalian}</option>
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
              {creating ? d.creating : d.createCampaign}
            </button>
          </div>
        </form>
        </section>

        {campaigns.length === 0 ? (
          <p className={styles.empty}>{d.noCampaigns}</p>
        ) : (
          <ul className={styles.campaignList}>
            {campaigns.map((campaign) => (
              <li key={campaign.id} className={styles.campaignCard}>
                <div>
                  <h2 className={styles.campaignTitle}>{campaign.title}</h2>
                  <p className={styles.campaignMeta}>
                    {d.campaignMeta(
                      campaign.classDisplayName,
                      campaign.minimumResponseThreshold,
                      campaign.expectedParticipantCount,
                    )}
                  </p>
                </div>

                <form className={styles.startRoundRow} action={startRoundAction}>
                  <input type="hidden" name="campaignId" value={campaign.id} />
                  <input
                    className={styles.input}
                    name="displayName"
                    type="text"
                    maxLength={80}
                    placeholder={d.startRoundPlaceholder}
                    aria-label={d.startRoundAria}
                  />
                  <button type="submit" className={styles.primaryBtn}>
                    {d.startNewRound}
                  </button>
                </form>

                {campaign.rounds.length === 0 ? (
                  <p className={styles.empty}>{d.noRounds}</p>
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
                            {round.status === "live" ? d.live : d.closed}
                          </span>
                        </div>

                        <p className={styles.campaignMeta}>
                          {d.responses(round.responseCount)}
                        </p>

                        <div className={styles.linkRow}>
                          <span className={styles.linkText}>
                            {studentLink(siteUrl, round.publicCode)}
                          </span>
                          <CopyLinkButton
                            value={studentLink(siteUrl, round.publicCode)}
                            copyLabel={d.copyStudentLink}
                            copiedLabel={d.copied}
                          />
                        </div>

                        <div className={styles.roundActions}>
                          <Link
                            href={`/teacher/rounds/${round.id}`}
                            className={styles.secondaryBtn}
                          >
                            {d.openResults}
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
                              value={
                                round.status === "live" ? "closed" : "live"
                              }
                            />
                            <button
                              type="submit"
                              className={styles.secondaryBtn}
                            >
                              {round.status === "live"
                                ? d.closeRound
                                : d.reopenRound}
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
    </div>
  );
}

function CopyLinkButton({
  value,
  copyLabel,
  copiedLabel,
}: {
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
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
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}
