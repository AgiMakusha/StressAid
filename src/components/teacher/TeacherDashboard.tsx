"use client";

import { useMemo, useState } from "react";
import type { SectionId } from "@/lib/questionnaire";
import {
  areResultsAvailable,
  type TeacherDashboardData,
} from "@/lib/teacher/types";
import { buildDashboardView } from "@/lib/teacher/viewModel";
import { ClassEnvironmentWheel } from "./ClassEnvironmentWheel";
import { SectionOverviewList } from "./SectionOverviewList";
import { SectionDetailPanel } from "./SectionDetailPanel";
import styles from "./TeacherDashboard.module.css";

interface TeacherDashboardProps {
  data: TeacherDashboardData;
}

/**
 * Frontend-only teacher dashboard controller. There is no backend: it renders
 * synthetic demonstration data. Whether results are shown is DERIVED from
 * responseCount >= minimumResponseThreshold; below threshold the payload
 * carries no aggregates at all (discriminated union), so nothing can leak.
 */
export function TeacherDashboard({ data }: TeacherDashboardProps) {
  const available = areResultsAvailable(
    data.campaign.responseCount,
    data.campaign.minimumResponseThreshold,
  );

  return (
    <div className={styles.dashboard}>
      <DashboardHeader data={data} />
      {available && data.resultsAvailable ? (
        <DashboardResults data={data} />
      ) : (
        <ThresholdNotice
          responseCount={data.campaign.responseCount}
          threshold={data.campaign.minimumResponseThreshold}
        />
      )}
    </div>
  );
}

function DashboardHeader({ data }: { data: TeacherDashboardData }) {
  const { class: klass, campaign } = data;
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div>
          <p className={styles.demoBadge}>
            <span className={styles.demoDot} aria-hidden="true" />
            Demo data · Synthetic class example
          </p>
          <h1 className={styles.className}>{klass.displayName}</h1>
          <p className={styles.campaignTitle}>{campaign.title}</p>
        </div>
        <span
          className={styles.statusChip}
          data-status={campaign.status}
        >
          {campaign.status === "live"
            ? "Live"
            : campaign.status === "closed"
              ? "Closed"
              : "Draft"}
        </span>
      </div>

      <dl className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <dt>Responses</dt>
          <dd>
            {data.campaign.responseCount} / {klass.expectedStudentCount}
          </dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Participation</dt>
          <dd>{participationPercent(campaign.responseCount, klass.expectedStudentCount)}%</dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Anonymity threshold</dt>
          <dd>{campaign.minimumResponseThreshold} responses</dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Last updated</dt>
          <dd>{campaign.lastUpdatedLabel}</dd>
        </div>
      </dl>
    </header>
  );
}

function DashboardResults({ data }: { data: Extract<TeacherDashboardData, { resultsAvailable: true }> }) {
  const view = useMemo(() => buildDashboardView(data), [data]);
  const [selectedSectionId, setSelectedSectionId] = useState<SectionId>(
    view.defaultSelectedSectionId,
  );

  const selectedSection =
    view.sections.find((section) => section.id === selectedSectionId) ??
    view.sections[0];

  return (
    <>
      <div
        className={styles.srOnly}
        role="status"
        aria-live="polite"
      >
        {`Selected section: ${selectedSection.name}, ${selectedSection.percentageDisplay} percent, ${selectedSection.interpretationLabelText}.`}
      </div>

      <div className={styles.resultsGrid}>
        <div className={styles.wheelColumn}>
          <ClassEnvironmentWheel
            sections={view.sections}
            selectedSectionId={selectedSectionId}
            onSelect={setSelectedSectionId}
            overallScoreDisplay={view.overallScoreDisplay}
            overallInterpretationText={view.overallInterpretationText}
          />
          <div className={styles.overviewCard}>
            <h2 className={styles.sectionHeading}>Section overview</h2>
            <SectionOverviewList
              sections={view.sections}
              selectedSectionId={selectedSectionId}
              onSelect={setSelectedSectionId}
            />
          </div>
        </div>

        <div className={styles.detailColumn}>
          <SectionDetailPanel
            section={selectedSection}
            nextCheckInLabel={data.campaign.nextCheckInLabel}
          />
        </div>
      </div>
    </>
  );
}

function ThresholdNotice({
  responseCount,
  threshold,
}: {
  responseCount: number;
  threshold: number;
}) {
  const remaining = Math.max(threshold - responseCount, 0);
  return (
    <section className={styles.notice} aria-labelledby="threshold-heading">
      <h2 id="threshold-heading" className={styles.noticeTitle}>
        Results are not available yet
      </h2>
      <p className={styles.noticeBody}>
        To protect student anonymity, collective results are shown only once at
        least {threshold} responses have been received. This class currently has{" "}
        {responseCount}{" "}
        {responseCount === 1 ? "response" : "responses"}.
      </p>
      <p className={styles.noticeBody}>
        {remaining === 1
          ? "1 more response is needed before results can be shown."
          : `${remaining} more responses are needed before results can be shown.`}{" "}
        No section averages, distributions, interpretations, or the Class
        Environment Wheel are available until then.
      </p>
    </section>
  );
}

function participationPercent(responseCount: number, expected: number): number {
  if (expected <= 0) return 0;
  return Math.round((responseCount / expected) * 100);
}
