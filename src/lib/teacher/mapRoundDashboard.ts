/**
 * Maps the `get_round_dashboard` RPC payload into the existing
 * `TeacherDashboardData` model so the current dashboard + radial donut render
 * real (non-demo) aggregate data unchanged.
 *
 * The database performs the threshold gate: below threshold the payload has NO
 * `sections`, so this mapper cannot leak hidden aggregates. Only raw counts are
 * carried through; all scores/labels are derived downstream by scoring.ts.
 */

import type { SectionId } from "@/lib/questionnaire";
import { DEFAULT_LOCALE, getMessages, type Locale } from "@/lib/i18n";
import type {
  CampaignStatus,
  TeacherDashboardData,
} from "./types";

export interface RoundDashboardMeta {
  title: string;
  classDisplayName: string;
  roundDisplayName: string;
  status: string;
  expectedParticipantCount: number;
  aggregatesUpdatedOn: string | null;
}

export interface RoundSectionRow {
  sectionId: SectionId;
  never: number;
  rarely: number;
  sometimes: number;
  often: number;
  always: number;
}

export type RoundDashboardResponse =
  | {
      resultsAvailable: false;
      responseCount: number;
      threshold: number;
      remaining: number;
      meta: RoundDashboardMeta;
    }
  | {
      resultsAvailable: true;
      responseCount: number;
      threshold: number;
      sections: RoundSectionRow[];
      meta: RoundDashboardMeta;
    };

function statusLabel(status: string): CampaignStatus {
  return status === "closed" ? "closed" : "live";
}

/** Coarse, human wording — never a precise timestamp. */
function updatedLabel(
  aggregatesUpdatedOn: string | null,
  locale: Locale,
): string {
  if (!aggregatesUpdatedOn) {
    return locale === "it"
      ? "In attesa delle prime risposte"
      : "Awaiting first responses";
  }
  return locale === "it"
    ? `Aggiornato il ${aggregatesUpdatedOn}`
    : `Updated on ${aggregatesUpdatedOn}`;
}

export function mapRoundDashboard(
  payload: RoundDashboardResponse,
  locale: Locale = DEFAULT_LOCALE,
): TeacherDashboardData {
  const { meta } = payload;

  const base = {
    isDemo: false as const,
    class: {
      displayName: meta.classDisplayName,
      expectedStudentCount: meta.expectedParticipantCount,
    },
    campaign: {
      title: meta.title,
      status: statusLabel(meta.status),
      responseCount: payload.responseCount,
      minimumResponseThreshold: payload.threshold,
      lastUpdatedLabel: updatedLabel(meta.aggregatesUpdatedOn, locale),
      nextCheckInLabel: getMessages(locale).teacherDashboard.reassessDefault,
    },
  };

  if (!payload.resultsAvailable) {
    return { ...base, resultsAvailable: false };
  }

  return {
    ...base,
    resultsAvailable: true,
    sections: payload.sections.map((row) => ({
      id: row.sectionId,
      validResponses:
        row.never + row.rarely + row.sometimes + row.often + row.always,
      distribution: {
        never: row.never,
        rarely: row.rarely,
        sometimes: row.sometimes,
        often: row.often,
        always: row.always,
      },
    })),
  };
}
