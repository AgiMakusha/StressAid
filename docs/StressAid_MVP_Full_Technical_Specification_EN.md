# StressAid MVP - Full Technical Specification

**Document status:** Final hackathon MVP specification  
**Version:** 1.0  
**Date:** 18 July 2026  
**Product:** StressAid  
**Event:** Social Hackathon Umbria 2026 (#SHU2026)

## 1. Executive summary

StressAid is a privacy-first school environment feedback tool. Students answer a short, anonymous questionnaire. The application does not show individual results and does not create individual student profiles. Answers are aggregated at class level and presented to a teacher through a visual Class Environment Wheel, section averages, and five-colour response distributions.

The MVP is deliberately simple:

- one student workflow;
- one teacher dashboard;
- six positively scored sections;
- anonymous class-level aggregation;
- no question-level breakdown in the teacher dashboard;
- no artificial intelligence;
- no medical, diagnostic, therapeutic, or predictive claims;
- no open-text answers;
- no parent, municipality, psychologist, or school-wide dashboard.

The central product promise is:

> One student's answer remains private. Together, the answers become a collective signal that helps the teacher improve the classroom environment.

## 2. Product purpose and intended use

### 2.1 Intended purpose

StressAid is intended to help teachers understand how students collectively experience selected aspects of the classroom and school environment:

1. Mood
2. Safety
3. Engagement
4. FOMO
5. Social Aspects
6. Predictability

The tool supports reflection and school-level improvement. It does not determine the cause of a low score and does not replace professional judgement, safeguarding procedures, incident reporting, or direct conversations with students.

### 2.2 Approved product positioning

Use statements such as:

- "School environment feedback tool"
- "Anonymous class-level insights"
- "Collective environmental signals"
- "Areas that may need attention"
- "Support for classroom improvement"

### 2.3 Prohibited product positioning

Do not use statements such as:

- "Diagnoses student stress"
- "Detects mental illness"
- "Identifies an unsafe child"
- "Predicts violence, bullying, or self-harm"
- "Provides clinical screening"
- "Recommends treatment"
- "Determines whether a teacher or school is performing adequately"

## 3. MVP scope

### 3.1 Included

The MVP must include:

- responsive student web interface;
- QR-code or direct-link access to a campaign;
- English and Italian user interface;
- six questions, one per section;
- five smile-based answers scored from 0 to 4;
- anonymous submission;
- threshold-based class aggregation;
- teacher dashboard with live response count;
- Class Environment Wheel with six equal segments;
- section averages on 0-4 and 0-100 scales;
- five-colour response distribution for each section;
- section detail side panel;
- static, human-authored suggested actions;
- polling-based updates;
- privacy page and child-friendly notice;
- Vercel deployment;
- Supabase PostgreSQL storage in an EU region where available;
- synthetic-data fallback mode;
- SHU2026 attribution and licensing information.

### 3.2 Excluded

The MVP must not include:

- student accounts;
- student names, email addresses, IDs, dates of birth, or demographic profiles;
- individual student results;
- individual teacher access to raw responses;
- question-level breakdown in the teacher dashboard;
- open-text answers;
- AI, machine learning, LLMs, emotion recognition, or automated profiling;
- psychologist case management;
- parent or municipality dashboards;
- public school rankings;
- full school information system integration;
- native mobile apps;
- medical or clinical interpretation;
- automated disciplinary, safeguarding, or educational decisions.

## 4. User roles and permissions

### 4.1 Student

The student can:

- open the assessment;
- choose English or Italian;
- read a child-friendly privacy explanation;
- answer six questions;
- navigate backward and forward;
- submit the response;
- see a neutral thank-you screen.

The student cannot:

- see a personal score;
- see any section score;
- see class results;
- compare themselves with classmates;
- enter open text;
- create an account;
- identify another respondent.

### 4.2 Teacher

The teacher can:

- access a protected class dashboard;
- see class and campaign metadata;
- see response count and participation percentage;
- see whether the anonymity threshold has been reached;
- see aggregated section averages and distributions after the threshold;
- click a section to open a section-level detail panel;
- read a short collective interpretation;
- review suggested classroom actions;
- record a selected action and a proposed review date.

The teacher cannot:

- open an individual response;
- identify who chose a particular answer;
- see submission timestamps attached to visible answer values;
- export raw responses;
- create subgroup filters;
- view aggregated results below the threshold;
- access another class without authorisation.

## 5. Questionnaire and scoring system

### 5.1 Canonical answer scale

| Answer | Stored score | Response colour | Meaning |
|---|---:|---|---|
| Never | 0 | Magenta / pink | lowest positive experience |
| Rarely | 1 | Orange | low positive experience |
| Sometimes | 2 | Yellow | mixed / neutral experience |
| Often | 3 | Green | positive experience |
| Always | 4 | Blue | strongest positive experience |

Canonical UI colour tokens:

```text
response.never      = #E71183
response.rarely     = #F07D00
response.sometimes  = #F7A704
response.often      = #009844
response.always     = #169EDA
```

The same colour, smile icon, label, and order must be used in the student interface, teacher distribution bars, legends, tooltips, and accessible tables.

### 5.2 Canonical sections and questions

All MVP questions are positively scored. A higher response always produces a higher score.

| Section | Canonical MVP question |
|---|---|
| Mood | I come to school feeling curious and excited. |
| Safety | I feel safe at school. |
| Engagement | I enjoy exploring new things and learning new subjects. |
| FOMO | I do not worry about missing out on things my friends are doing. |
| Social Aspects | I do not feel lonely at school. |
| Predictability | I know where to find information about schedules, homework, and class activities. |

The wording must remain configurable in a central content file. Before a real child pilot, the final language must be reviewed by an education or child-wellbeing expert and by the participating school.

### 5.3 Section score

The MVP has one question per section.

```text
sectionAverageRaw =
sum(valid scores for the section)
/
number of valid responses
```

Valid range:

```text
0.00 to 4.00
```

### 5.4 Section percentage

```text
sectionPercentage =
(sectionAverageRaw / 4) * 100
```

Example:

```text
Average = 2.60 / 4
Percentage = 65 / 100
```

### 5.5 Overall class score

```text
overallScore =
average of the six section percentages
```

The overall score is orientation only. The UI must still prioritise the lowest section. A high overall score must not hide a low Safety score.

### 5.6 Provisional display labels

These labels are deterministic MVP display rules and are not scientifically or clinically validated thresholds.

| Score | Teacher-facing label |
|---:|---|
| 80-100 | Strong |
| 65-79 | Generally positive |
| 50-64 | Monitor |
| 35-49 | Needs attention |
| 0-34 | Strong concern |

The dashboard must include a persistent note:

> Results describe collective class responses. They do not diagnose students or prove the cause of a classroom issue. School staff must interpret them in context.

## 6. Student experience

### 6.1 Welcome screen

The welcome screen must include:

- StressAid logo;
- official SHU2026 logo as event attribution, visually separate from the StressAid identity;
- language selector;
- short purpose statement;
- anonymity explanation;
- estimated completion time;
- explanation that answers are combined with other responses;
- Start button.

Recommended child-friendly copy:

> Your voice helps the school understand what supports students and what could be improved. We do not ask for your name. Your answers will be combined with answers from other students.

### 6.2 Question flow

Requirements:

- one question at a time;
- clear section label;
- progress indicator, for example "2 of 6";
- five smile options in the canonical order;
- text label under every smile;
- selected state that uses colour, outline, icon, and text;
- Back and Next controls;
- keyboard and screen-reader support;
- mobile-first layout;
- no score or interpretation.

### 6.3 Submission

On submission, the server must validate all six answers and store the response only if the campaign is open.

The student must receive only a generic success response. No individual score may be returned to the browser.

### 6.4 Completion screen

Recommended copy:

> Thank you. Your response has been recorded without your name and will be combined with responses from other students.

> Together, your voices can help make school a better place for everyone.

A static support message may be shown to every student, such as:

> If something at school makes you feel unsafe, speak with a trusted adult or use the school's official support channel.

The support message must not change based on the student's answers.

## 7. Teacher dashboard

### 7.1 Dashboard header

Display:

- class name;
- grade;
- campaign title and period;
- campaign status;
- responses received;
- expected class size;
- participation percentage;
- last-updated time;
- proposed next check-in date.

### 7.2 Minimum response threshold

Default hackathon threshold:

```text
10 responses
```

The threshold must be configurable per campaign.

Before the threshold is reached:

- show response count;
- show threshold progress;
- hide averages, wheel, distributions, and interpretations;
- show a privacy explanation.

Suggested copy:

> Results are hidden until at least 10 responses have been received. This reduces the risk of identifying individual students.

The number 10 is an MVP design assumption, not a universal legal or scientific threshold.

### 7.3 Class Environment Wheel

The main visual must be a six-segment radial wheel.

Requirements:

- all six segments have equal geometry;
- segment size must not change with score;
- each segment represents one section;
- each segment shows section icon, short label, and percentage score;
- centre shows overall score;
- selecting a segment opens the corresponding detail panel;
- keyboard selection must be supported;
- accessible text summary must be available.

Recommended section colours, derived from the extended SHU2026 palette:

```text
section.mood            = #F7A704
section.safety          = #E71183
section.engagement      = #F07D00
section.fomo            = #6B3F91
section.social          = #009844
section.predictability  = #169EDA
```

### 7.4 Section overview list

Each section row must show:

- section name;
- raw average (0-4);
- percentage (0-100);
- valid response count;
- provisional status label;
- five-colour 100% stacked answer distribution;
- click affordance.

### 7.5 Answer distribution

For every section calculate:

```text
neverCount
rarelyCount
sometimesCount
oftenCount
alwaysCount
```

And:

```text
categoryPercentage =
categoryCount / validSectionResponses * 100
```

The five segments must use the canonical response colours and remain in the order:

```text
Never -> Rarely -> Sometimes -> Often -> Always
```

Desktop hover or keyboard focus must show:

- answer label;
- count;
- percentage.

Mobile tap must show the same values.

Charts must include an accessible text/table equivalent. Colour alone is insufficient.

### 7.6 Section detail panel

When a teacher selects a wheel segment or section row, open a side panel.

The panel must show:

- section name and icon;
- raw average;
- percentage;
- response count;
- status label;
- full five-colour distribution;
- concise collective interpretation;
- static suggested actions;
- proposed next check-in;
- button to record a selected action.

The panel must not show:

- question-level breakdown;
- individual responses;
- respondent timestamps;
- free-text quotes;
- subgroup filters.

### 7.7 Suggested actions

Suggested actions must come from a static, human-authored library.

Example Safety actions:

- clarify which adults students can approach;
- review classroom safety and reporting routines;
- establish shared respectful-behaviour expectations;
- schedule a follow-up class check-in.

No AI-generated recommendations are permitted in the MVP.

## 8. Visual and brand specification

### 8.1 Brand hierarchy

StressAid is the product identity. SHU2026 is event attribution.

Rules:

- use the official SHU2026 logo file supplied or authorised by the organisers;
- use the official StressAid logo file supplied by the product team;
- do not redraw, recolour, stretch, crop, or merge either logo;
- keep the two logos visually separate;
- do not imply that StressAid is an official SHU product or endorsed by the organisers;
- include alt text for both logos;
- preserve clear space and legibility;
- use the official event logo only in accordance with organiser permission and brand guidance.

Recommended attribution:

> Created during Social Hackathon Umbria 2026, organised by EGInA in Cascia, Italy.

### 8.2 Primary visual palette

```text
shu.blue       = #169EDA
shu.green      = #009844
shu.magenta    = #E71183
shu.orange     = #F07D00
shu.yellow     = #F7A704
shu.purple     = #6B3F91
ui.navy        = #081C2C
ui.charcoal    = #0D0D0D
ui.offWhite    = #F6F8FA
ui.white       = #FFFFFF
ui.border      = #DDE4EA
```

### 8.3 Peace motif

A dove and olive branch may be used as a supportive decorative motif on:

- student welcome screen;
- student completion screen;
- dashboard empty state;
- pitch and documentation.

The motif must not reduce readability or be used as a substitute for functional icons.

Recommended tagline:

> Peace through listening. Insights for inclusion.

## 9. Technical architecture

### 9.1 Recommended stack

- Next.js with TypeScript
- React Server Components where appropriate
- Supabase PostgreSQL
- Vercel
- GitHub
- CSS Modules, Tailwind CSS, or another single consistent styling approach
- schema validation with Zod
- unit tests with Vitest or Jest
- end-to-end tests with Playwright

### 9.2 High-level flow

```text
Student browser
  -> Next.js student interface
  -> server-side validation
  -> Supabase response storage
  -> deterministic aggregation
  -> teacher dashboard API
  -> teacher dashboard polling
```

### 9.3 Required routes

```text
/
  Product introduction or role choice

/student/[campaignCode]
  Student welcome and questionnaire

/student/[campaignCode]/complete
  Thank-you screen

/teacher/login
  Demo teacher access

/teacher/[campaignId]
  Teacher dashboard

/privacy
  Privacy information

/accessibility
  Accessibility statement or MVP commitment

/api/campaigns/[campaignCode]
  Public campaign configuration

/api/responses
  Anonymous response submission

/api/dashboard/[campaignId]
  Protected aggregated dashboard data

/api/interventions
  Protected selected-action endpoint
```

### 9.4 Live update strategy

For hackathon reliability, use polling every 20 seconds.

Refresh:

- response count;
- participation percentage;
- section averages;
- distributions;
- wheel scores;
- status labels;
- last-updated timestamp.

Supabase Realtime is optional and must not replace a stable polling fallback.

## 10. Data model

### 10.1 classes

```text
id uuid primary key
display_name text not null
grade text
expected_student_count integer
created_at timestamptz not null
```

### 10.2 assessment_campaigns

```text
id uuid primary key
class_id uuid references classes(id)
public_code text unique not null
title text not null
status text not null
minimum_response_threshold integer not null default 10
opens_at timestamptz
closes_at timestamptz
created_at timestamptz not null
```

Allowed statuses:

```text
draft
open
closed
archived
```

### 10.3 responses

```text
id uuid primary key
campaign_id uuid references assessment_campaigns(id)
mood_score smallint not null check (mood_score between 0 and 4)
safety_score smallint not null check (safety_score between 0 and 4)
engagement_score smallint not null check (engagement_score between 0 and 4)
fomo_score smallint not null check (fomo_score between 0 and 4)
social_aspects_score smallint not null check (social_aspects_score between 0 and 4)
predictability_score smallint not null check (predictability_score between 0 and 4)
language text not null
submitted_at timestamptz not null
```

The application data model must not include:

- name;
- email;
- student ID;
- date of birth;
- address;
- phone number;
- gender;
- nationality;
- diagnosis;
- open text;
- device fingerprint;
- advertising identifier.

### 10.4 interventions

```text
id uuid primary key
campaign_id uuid references assessment_campaigns(id)
section_id text not null
action_id text not null
status text not null
selected_at timestamptz not null
review_date date
```

### 10.5 suggested_actions

```text
id text primary key
section_id text not null
title text not null
description text not null
sort_order integer not null
active boolean not null default true
```

## 11. API requirements

### 11.1 Public campaign configuration

```http
GET /api/campaigns/[campaignCode]
```

May return only:

- campaign title;
- class display label if approved;
- open/closed status;
- language options;
- questionnaire version;
- privacy copy.

It must not expose teacher or database identifiers unnecessarily.

### 11.2 Submit response

```http
POST /api/responses
```

Example request:

```json
{
  "campaignCode": "7B-SPRING-2026",
  "language": "en",
  "answers": {
    "mood": 3,
    "safety": 1,
    "engagement": 4,
    "fomo": 2,
    "socialAspects": 3,
    "predictability": 2
  }
}
```

Server requirements:

- verify campaign exists;
- verify campaign is open;
- accept exactly six defined answer keys;
- require integer values 0-4;
- reject unknown fields;
- reject identifiers;
- apply rate limiting;
- avoid request-body logging;
- store no IP address in application tables;
- return no student score.

Example response:

```json
{
  "success": true
}
```

### 11.3 Dashboard aggregation

```http
GET /api/dashboard/[campaignId]
```

Below threshold:

```json
{
  "responseCount": 7,
  "threshold": 10,
  "resultsAvailable": false
}
```

Above threshold:

```json
{
  "responseCount": 18,
  "threshold": 10,
  "resultsAvailable": true,
  "overallScore": 57,
  "sections": []
}
```

The endpoint must return aggregated data only.

### 11.4 Record action

```http
POST /api/interventions
```

Protected endpoint. Records:

- campaign;
- section;
- selected action;
- review date;
- status.

## 12. Authentication and authorisation

### 12.1 Hackathon MVP

A teacher demo access code is acceptable if:

- validation occurs server-side;
- the code is stored in environment variables;
- the code is never embedded in client bundles;
- a secure session cookie is used;
- teacher dashboard APIs verify the session;
- the demo route cannot query other campaigns by arbitrary ID.

### 12.2 Production requirement

Before a real school pilot, replace the demo code with:

- institutional authentication;
- role-based access control;
- organisation and class separation;
- staff account lifecycle management;
- audit logs;
- secure password or SSO policy;
- least-privilege database access.

## 13. GDPR and privacy requirements

### 13.1 Raw responses must be treated as personal data

Removing names does not automatically make responses anonymous. A response connected to a small class may still be linkable to a student through context, timing, or auxiliary information.

Therefore:

- treat raw responses as personal or pseudonymous data;
- display only threshold-protected aggregates;
- keep raw response access unavailable to teachers;
- document provider logs and metadata;
- use irreversibly aggregated statistics for longer-term reporting where possible.

### 13.2 Controller, processor, and subprocessors

For a typical school deployment:

- the school or municipality will usually be the controller;
- the StressAid provider will usually be a processor;
- hosting, database, email, monitoring, and support vendors may be subprocessors.

Before a real pilot, prepare:

- Data Processing Agreement;
- subprocessor list;
- data-flow map;
- records of processing;
- deletion procedure;
- incident procedure;
- technical and organisational measures.

### 13.3 Lawful basis

Do not hardcode consent as the lawful basis.

The participating school and its Data Protection Officer must determine the appropriate lawful basis under GDPR and national education law. Participation and parent information requirements must be confirmed locally.

### 13.4 Data minimisation

The MVP must collect only:

- campaign reference;
- six scores;
- language;
- submission timestamp needed for operation.

Do not collect identity, demographics, free text, device fingerprints, advertising identifiers, or behavioural profiles.

### 13.5 Child-friendly transparency

Before the assessment, provide concise, plain-language information explaining:

- who is collecting the answers;
- why;
- what is collected;
- that no name is requested;
- that results are combined;
- who can see the combined results;
- retention period;
- contact point for questions.

A full adult privacy notice must include:

- controller identity;
- DPO contact;
- lawful basis;
- purposes;
- recipients and subprocessors;
- hosting and transfers;
- retention;
- rights;
- complaint authority;
- automated decision-making statement.

### 13.6 Data subject rights and anonymous design

Because the application intentionally avoids identifying respondents, it may be impossible to find or delete one specific response after submission.

The privacy notice must explain this clearly. The system must not collect extra identity data solely to make individual response retrieval possible.

### 13.7 DPIA release gate

A Data Protection Impact Assessment must be completed before use with real schoolchildren.

The DPIA must assess:

- children as vulnerable data subjects;
- small-class re-identification;
- provider logs and IP addresses;
- threshold selection;
- teacher access;
- retention;
- international transfers;
- security incidents;
- safeguarding boundary;
- risk of misuse for teacher or school ranking.

### 13.8 Retention

Proposed hackathon defaults:

- synthetic data preferred;
- adult visitor test submissions deleted within 7 days;
- no real child data.

Proposed pilot defaults, subject to DPO approval:

- raw responses retained until campaign closure plus 30 days;
- raw responses then deleted or irreversibly aggregated;
- aggregated campaign results retained for up to 24 months;
- security logs retained 30-90 days;
- answer values and request bodies excluded from logs.

### 13.9 Breach response

The system must support:

- incident detection;
- processor notification to controller without undue delay;
- documented investigation;
- preservation of relevant security logs;
- controller assessment of supervisory-authority and data-subject notification duties.

### 13.10 International transfers

Prefer EU/EEA hosting.

If any provider processes data outside the EEA:

- document the transfer;
- identify the legal transfer mechanism;
- assess supplementary safeguards;
- disclose the transfer;
- obtain controller approval.

## 14. EU AI Act requirements

### 14.1 MVP rule: no AI

The MVP must use only:

- fixed questionnaire content;
- arithmetic scoring;
- deterministic threshold logic;
- static interpretations;
- human-authored suggested actions.

No machine learning, LLM, inference model, automated sentiment analysis, or generative recommendation is permitted.

### 14.2 Prohibited feature additions

Do not add:

- webcam or facial analysis;
- voice-emotion detection;
- biometric emotion recognition;
- automated emotional-state inference;
- individual student risk prediction;
- automatic disciplinary recommendations;
- automatic educational placement;
- automated psychological profiling.

### 14.3 Future AI change control

Any future AI feature requires a separate approved change request containing:

- intended purpose;
- AI Act classification;
- fundamental-rights and data-protection assessment;
- bias and discrimination assessment;
- human oversight design;
- model/provider data-use terms;
- logging and explainability requirements;
- explicit prohibition on training with student responses unless separately lawful and approved.

## 15. Medical Device Regulation requirements

### 15.1 Non-medical intended purpose

StressAid must remain a school environment feedback tool.

It must not be intended for:

- diagnosis;
- prevention or prediction of disease;
- monitoring of a medical condition;
- prognosis;
- treatment;
- clinical decision support.

### 15.2 Claims control

The intended purpose is shaped by website copy, UI labels, pitch materials, sales materials, instructions, and promotional claims.

Avoid terms such as:

- medical screening;
- mental-health diagnosis;
- clinical stress score;
- validated diagnostic tool;
- treatment recommendation.

Use:

- collective classroom signal;
- school environment indicator;
- area requiring attention;
- classroom improvement action.

If a future version provides information used for diagnostic or therapeutic decisions, obtain a formal MDR classification review before development or marketing.

## 16. Other relevant compliance areas

### 16.1 Accessibility

Target WCAG 2.2 AA.

Requirements:

- semantic HTML;
- native or correctly implemented accessible controls;
- keyboard completion;
- visible focus;
- sufficient contrast;
- 200% zoom;
- reduced-motion support;
- no information communicated only by colour;
- text/table alternative for the wheel and charts;
- alt text for logos and decorative-image handling;
- plain language;
- accessible error messages.

A public-sector school deployment may also need to satisfy national implementation of the EU Web Accessibility Directive and provide an accessibility statement.

### 16.2 ePrivacy and cookies

The MVP must use:

- no advertising;
- no tracking pixels;
- no behavioural analytics;
- no third-party social widgets;
- no non-essential cookies;
- no externally loaded Google Fonts;
- no third-party scripts that profile children.

Necessary session or language storage must be documented. Any future analytics requires a separate ePrivacy and national cookie-law review.

### 16.3 Cyber Resilience Act readiness

The hackathon prototype is not a commercial compliance release. Before placing a production software product on the EU market, conduct a CRA applicability review.

Production-readiness controls should include:

- secure-by-design development;
- vulnerability intake and disclosure process;
- dependency and SBOM management;
- security update policy and support period;
- vulnerability remediation;
- documented risk assessment;
- release and update integrity;
- incident and vulnerability reporting process where legally required.

### 16.4 Safeguarding boundary

StressAid is not an emergency or incident-reporting channel.

Display:

> Aggregated feedback supports school review but does not replace direct reporting of bullying, violence, or immediate safety concerns.

Do not collect open-text incident descriptions in the MVP.

Any future individual reporting module must be a separate system with separate identity, permissions, privacy notice, safeguarding owners, and escalation procedures.

### 16.5 National education law and school policy

Before a real pilot, the school must confirm:

- authority to conduct the questionnaire;
- participation and parent-information rules;
- staff responsibilities;
- school welfare and safeguarding procedures;
- retention and archival duties;
- employee consultation or governance requirements;
- local DPO and supervisory-authority expectations.

## 17. Security requirements

Required controls:

- HTTPS only;
- EU-region database where available;
- encryption at rest through provider;
- server-side schema validation;
- parameterised database access;
- Supabase Row Level Security;
- least privilege;
- secure session cookie;
- teacher authorisation on every protected API;
- rate limiting;
- CSRF protection where applicable;
- secure headers;
- Content Security Policy;
- no secrets in Git;
- separate development and production environments;
- dependency scanning;
- no answer values in logs;
- generic errors;
- backup and recovery procedure;
- periodic permission tests.

Use OWASP ASVS as the secure-development verification baseline.

## 18. Logging and observability

Allowed operational logs:

- request success/failure;
- endpoint;
- anonymised correlation ID;
- aggregate timing;
- error code.

Do not log:

- answer payloads;
- campaign public code with answer values;
- child-entered content;
- authentication secrets;
- raw session cookies.

Monitoring must avoid advertising SDKs and child profiling.

## 19. Internationalisation

Required languages:

- English (`en`)
- Italian (`it`)

All content must be stored in translation files, including:

- questions;
- answer labels;
- privacy notices;
- teacher labels;
- interpretations;
- suggested actions;
- errors;
- accessibility labels.

No hardcoded user-facing copy in components.

## 20. Demo mode and resilience

The hackathon build must include:

- demo campaign with synthetic responses;
- a threshold scenario such as 9 of 10 responses;
- student submission that unlocks the aggregate view;
- database health fallback;
- local synthetic dashboard if Supabase is unavailable;
- visible "Demo data" label where appropriate;
- reset function protected from public users;
- pre-generated QR code;
- production and backup URLs.

## 21. Testing requirements

### 21.1 Functional

- campaign loads;
- closed campaign blocks submission;
- all six answers required;
- only integers 0-4 accepted;
- unknown fields rejected;
- success response contains no score;
- dashboard count updates;
- results hidden below threshold;
- results visible at threshold;
- averages correct;
- percentages total approximately 100%;
- wheel values match API;
- section panel opens;
- no question breakdown exists;
- suggested action can be recorded.

### 21.2 Privacy

- name/email fields rejected;
- raw response route unavailable to teacher;
- dashboard returns aggregates only;
- below-threshold values suppressed;
- no subgroup filters;
- no raw export;
- no answer values in logs;
- cross-campaign access denied;
- session validation enforced;
- environment secrets absent from client bundle.

### 21.3 Accessibility

- keyboard-only completion;
- screen-reader labels;
- colour contrast;
- 200% zoom;
- mobile layout;
- reduced motion;
- accessible chart summaries;
- focus management in side panel;
- form errors announced.

### 21.4 Security and build

Run:

```text
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Also perform:

- dependency audit;
- RLS tests;
- teacher-access bypass test;
- rate-limit test;
- production smoke test;
- Vercel environment-variable review.

## 22. Deployment and repository structure

Recommended repository:

```text
stressaid/
  app/
  components/
  lib/
  data/
  public/
    brand/
      shu2026-logo.*
      stressaid-logo.*
      peace-dove.*
  supabase/
    migrations/
  docs/
    StressAid_MVP_Technical_Specification.md
    SHU-style-reference.png
  tests/
  .cursor/
    rules/
  .env.example
  README.md
  LICENSE
  package.json
```

Workflow:

```text
local development
-> feature branch
-> commit
-> push to GitHub
-> Vercel preview
-> manual verification
-> pull request
-> main
-> production deployment
```

The `main` branch must remain demonstrable.

## 23. SHU2026 event requirements

The repository and product must include:

- CC BY-NC 4.0 licence attribution as required by the event;
- specific mention that the product was created in the context of SHU2026;
- only original or properly licensed assets;
- proof that use of the official SHU2026 logo is authorised;
- no implication of endorsement beyond event participation;
- a clear record of work created during the hackathon;
- a five-minute demo path.

Recommended attribution:

> Created during Social Hackathon Umbria 2026, organised by the European Grants International Academy (EGInA), 16-19 July 2026, Cascia, Italy.

## 24. Acceptance criteria

The MVP is accepted when:

1. Student can open a campaign through QR code.
2. English and Italian are available.
3. Six sections and six questions are displayed.
4. Smile answers use the 0-4 scoring model.
5. Response colours are consistent throughout.
6. No identity is requested.
7. Valid response is stored.
8. Student sees only a thank-you screen.
9. Teacher dashboard response count updates.
10. Results remain hidden below threshold.
11. Six-segment equal-size wheel appears after threshold.
12. Each section displays raw and percentage average.
13. Each section displays five-colour answer distribution.
14. Clicking a section opens a section-level panel.
15. No question-level breakdown exists.
16. No individual response is visible.
17. Suggested actions are static and human-authored.
18. No AI is used.
19. No medical claims are used.
20. Accessibility baseline passes.
21. Teacher access is protected.
22. Application is deployed on Vercel.
23. Supabase or synthetic fallback works.
24. Privacy, accessibility, licence, and SHU attribution are included.
25. Production build and required tests pass.

## 25. Final product statement

> StressAid is a privacy-first school environment feedback tool. Students answer six simple questions without providing their identity. Their answers are combined at class level and displayed to the teacher through a Class Environment Wheel, section averages, and coloured response distributions. The product does not evaluate individual children, diagnose medical or psychological conditions, or use artificial intelligence. It helps responsible adults recognise collective areas that may need attention and choose appropriate classroom-level actions.

## 26. Regulatory and technical references

- [R1] GDPR - https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng
- [R2] EU AI Act - https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng
- [R3] EU Medical Device Regulation - https://eur-lex.europa.eu/eli/reg/2017/745/oj/eng
- [R4] Web Accessibility Directive - https://eur-lex.europa.eu/eli/dir/2016/2102/oj/eng
- [R5] ePrivacy Directive - https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32002L0058
- [R6] Cyber Resilience Act - https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng
- [R7] SHU2026 Hackathon Regulation - https://www.socialhackathonumbria.info/wp-content/uploads/2026/07/SHU2026-Hackathon-Regulation.pdf
- [R8] OWASP ASVS - https://owasp.org/www-project-application-security-verification-standard/

This document is a technical and product specification, not formal legal advice. A real-school deployment requires review by the controller, Data Protection Officer, education/safeguarding specialists, and qualified legal counsel in the deployment country.
