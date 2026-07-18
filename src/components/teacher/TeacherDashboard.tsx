"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { SectionId } from "@/lib/questionnaire";
import {
  areResultsAvailable,
  type TeacherDashboardData,
} from "@/lib/teacher/types";
import { buildDashboardView } from "@/lib/teacher/viewModel";
import {
  DEFAULT_LOCALE,
  getMessages,
  useLocale,
  type Locale,
} from "@/lib/i18n";
import { ClassEnvironmentWheel } from "./ClassEnvironmentWheel";
import { SectionOverviewList } from "./SectionOverviewList";
import { SectionDetailPanel } from "./SectionDetailPanel";
import styles from "./TeacherDashboard.module.css";

interface TeacherDashboardProps {
  data: TeacherDashboardData;
  /**
   * Interface language for the teacher dashboard. When omitted the component
   * reads the current locale from context (falling back to English), so both
   * server-rendered pages and tests behave correctly.
   */
  locale?: Locale;
}

/**
 * Teacher dashboard controller. Whether results are shown is DERIVED from
 * responseCount >= minimumResponseThreshold; below threshold the payload
 * carries no aggregates at all (discriminated union), so nothing can leak.
 */
export function TeacherDashboard({ data, locale }: TeacherDashboardProps) {
  const contextLocale = useLocale();
  const activeLocale = locale ?? contextLocale ?? DEFAULT_LOCALE;
  const available = areResultsAvailable(
    data.campaign.responseCount,
    data.campaign.minimumResponseThreshold,
  );

  return (
    <div className={styles.shell}>
      <div className={styles.dashboard}>
        <DashboardHeader data={data} locale={activeLocale} />
        {available && data.resultsAvailable ? (
          <DashboardResults data={data} locale={activeLocale} />
        ) : (
          <ThresholdNotice
            responseCount={data.campaign.responseCount}
            threshold={data.campaign.minimumResponseThreshold}
            locale={activeLocale}
          />
        )}
      </div>
    </div>
  );
}

function DashboardHeader({
  data,
  locale,
}: {
  data: TeacherDashboardData;
  locale: Locale;
}) {
  const t = getMessages(locale).teacherDashboard;
  const { class: klass, campaign } = data;
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.titleBlock}>
          {data.isDemo ? (
            <p className={styles.demoBadge}>
              <span className={styles.demoDot} aria-hidden="true" />
              {t.demoBadge}
            </p>
          ) : null}
          <div className={styles.classRow}>
            <Image
              src="/brand/Student/Icon 9.svg"
              alt=""
              width={120}
              height={120}
              className={styles.classIcon}
              unoptimized
            />
            <div>
              <h1 className={styles.className}>{klass.displayName}</h1>
              <p className={styles.campaignTitle}>{campaign.title}</p>
            </div>
          </div>
        </div>
        <span
          className={styles.statusChip}
          data-status={campaign.status}
        >
          {campaign.status === "live"
            ? t.live
            : campaign.status === "closed"
              ? t.closed
              : t.draft}
        </span>
      </div>

      <dl className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <dt>{t.responses}</dt>
          <dd>
            {data.campaign.responseCount} / {klass.expectedStudentCount}
          </dd>
        </div>
        <div className={styles.metaItem}>
          <dt>{t.participation}</dt>
          <dd>{participationPercent(campaign.responseCount, klass.expectedStudentCount)}%</dd>
        </div>
        <div className={styles.metaItem}>
          <dt>{t.anonymityThreshold}</dt>
          <dd>{t.thresholdResponsesUnit(campaign.minimumResponseThreshold)}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt>{t.lastUpdated}</dt>
          <dd>{campaign.lastUpdatedLabel}</dd>
        </div>
      </dl>
    </header>
  );
}

function DashboardResults({
  data,
  locale,
}: {
  data: Extract<TeacherDashboardData, { resultsAvailable: true }>;
  locale: Locale;
}) {
  const t = getMessages(locale).teacherDashboard;
  const view = useMemo(() => buildDashboardView(data, locale), [data, locale]);
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
        {t.selectedSectionStatus(
          selectedSection.name,
          selectedSection.percentageDisplay,
          selectedSection.interpretationLabelText,
        )}
      </div>

      <div className={styles.wheelRow}>
        <ClassEnvironmentWheel
          sections={view.sections}
          selectedSectionId={selectedSectionId}
          onSelect={setSelectedSectionId}
          overallScoreDisplay={view.overallScoreDisplay}
          overallInterpretationText={view.overallInterpretationText}
          overallLabelId={view.overallLabelId}
          locale={locale}
        />
      </div>

      <div className={styles.resultsGrid}>
        <div className={styles.overviewCard}>
          <h2 className={styles.sectionHeading}>{t.sectionOverview}</h2>
          <SectionOverviewList
            sections={view.sections}
            selectedSectionId={selectedSectionId}
            onSelect={setSelectedSectionId}
            locale={locale}
          />
        </div>

        <div className={styles.detailColumn}>
          <SectionDetailPanel
            section={selectedSection}
            nextCheckInLabel={data.campaign.nextCheckInLabel}
            reviewNote={view.responsibleReviewNote}
            locale={locale}
          />
        </div>
      </div>
    </>
  );
}

function ThresholdNotice({
  responseCount,
  threshold,
  locale,
}: {
  responseCount: number;
  threshold: number;
  locale: Locale;
}) {
  const t = getMessages(locale).teacherDashboard;
  const remaining = Math.max(threshold - responseCount, 0);
  return (
    <section className={styles.notice} aria-labelledby="threshold-heading">
      <h2 id="threshold-heading" className={styles.noticeTitle}>
        {t.thresholdNoticeTitle}
      </h2>
      <p className={styles.noticeBody}>
        {t.thresholdNoticeBody(threshold, responseCount)}
      </p>
      <p className={styles.noticeBody}>{t.thresholdRemaining(remaining)}</p>
    </section>
  );
}

function participationPercent(responseCount: number, expected: number): number {
  if (expected <= 0) return 0;
  return Math.round((responseCount / expected) * 100);
}
