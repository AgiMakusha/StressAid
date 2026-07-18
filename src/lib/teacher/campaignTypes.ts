/** Shapes returned by the `list_my_campaigns` teacher RPC. */

export interface CampaignRoundSummary {
  id: string;
  roundNumber: number;
  displayName: string;
  status: string;
  publicCode: string;
  createdOn: string;
  aggregatesUpdatedOn: string | null;
  responseCount: number;
}

export interface CampaignSummary {
  id: string;
  title: string;
  classDisplayName: string;
  expectedParticipantCount: number;
  minimumResponseThreshold: number;
  language: string;
  createdOn: string;
  rounds: CampaignRoundSummary[];
}

/** Builds the absolute public student link for a round. */
export function studentLink(siteUrl: string, publicCode: string): string {
  return `${siteUrl.replace(/\/$/, "")}/student/${publicCode}`;
}
