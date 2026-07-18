-- 0002_tables.sql
-- Aggregate-only data model. There is intentionally NO individual-response
-- table: only per-round, per-section answer counters are stored. No student
-- identity, open text, timestamps of individual submissions, or scores.

-- 1) Reusable class assessment campaign.
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  class_display_name text not null,
  expected_participant_count integer not null,
  minimum_response_threshold integer not null default 10,
  language text not null default 'en',
  created_at timestamptz not null default now(),
  constraint campaigns_title_len
    check (char_length(btrim(title)) between 1 and 120),
  constraint campaigns_class_name_len
    check (char_length(btrim(class_display_name)) between 1 and 80),
  constraint campaigns_expected_positive
    check (expected_participant_count > 0),
  constraint campaigns_threshold_range
    check (minimum_response_threshold between 10 and 1000),
  constraint campaigns_threshold_feasible
    check (minimum_response_threshold <= expected_participant_count),
  constraint campaigns_language_allowed
    check (language in ('en', 'it'))
);

create index campaigns_owner_id_idx on public.campaigns (owner_id);

-- 2) One repeatable measurement round. Snapshots the campaign defaults so
-- editing the campaign later does not change earlier rounds.
create table public.assessment_rounds (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  public_code uuid not null default gen_random_uuid() unique,
  round_number integer not null,
  display_name text not null,
  status text not null default 'live',
  expected_participant_count integer not null,
  minimum_response_threshold integer not null,
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  aggregates_updated_on date,
  constraint rounds_status_allowed check (status in ('live', 'closed')),
  constraint rounds_number_positive check (round_number > 0),
  constraint rounds_threshold_min check (minimum_response_threshold >= 10),
  constraint rounds_threshold_feasible
    check (minimum_response_threshold <= expected_participant_count),
  constraint rounds_display_len
    check (char_length(btrim(display_name)) between 1 and 80),
  constraint rounds_unique_number unique (campaign_id, round_number)
);

create index assessment_rounds_campaign_id_idx
  on public.assessment_rounds (campaign_id);

-- 3) Exactly six aggregate rows per round (seeded by trigger). Non-negative
-- counters only. No individual answers.
create table public.round_section_aggregates (
  round_id uuid not null references public.assessment_rounds (id) on delete cascade,
  section_id text not null,
  never_count integer not null default 0 check (never_count >= 0),
  rarely_count integer not null default 0 check (rarely_count >= 0),
  sometimes_count integer not null default 0 check (sometimes_count >= 0),
  often_count integer not null default 0 check (often_count >= 0),
  always_count integer not null default 0 check (always_count >= 0),
  primary key (round_id, section_id),
  constraint aggregates_section_allowed check (
    section_id in (
      'mood', 'safety', 'engagement', 'fomo', 'socialAspects', 'predictability'
    )
  )
);
