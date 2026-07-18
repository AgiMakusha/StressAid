# StressAid

StressAid is a privacy-first school environment feedback tool developed for Social Hackathon Umbria 2026.

It helps teachers understand how students collectively experience their school environment without asking students for names, email addresses, or individual profiles.

## Live public beta

[Open StressAid](https://stress-aid.vercel.app)

The current version is a small public beta intended for demonstration and controlled product testing.

## How it works

### For teachers

Teachers can:

- create an account with an email address and password;
- create a feedback campaign for a class;
- choose English or Italian for the student questionnaire;
- share a public questionnaire link;
- create multiple feedback rounds;
- view class-level aggregate results after the anonymity threshold is reached.

Teacher accounts are required to create campaigns and access results.

### For students and testers

Anyone with an active student questionnaire link can:

- open the questionnaire without creating an account;
- answer six short questions;
- submit answers without entering a name or email address;
- see a generic completion message after submitting.

Student links do not provide access to teacher dashboards or class results.

## Feedback areas

The questionnaire covers six areas:

- Mood
- Safety
- Engagement
- Fear of missing out
- Social aspects
- Predictability

The interface and questionnaire are available in:

- English
- Italian

The language of the public questionnaire is selected when the teacher creates the campaign.

## Privacy-first approach

StressAid is designed around aggregate-only feedback.

The application:

- does not request student names;
- does not request student email addresses or student IDs;
- does not create individual student profiles;
- does not provide individual student scores;
- does not show individual answers to teachers;
- does not store individual response records;
- stores only aggregate answer counts;
- displays detailed class results only after the minimum anonymity threshold is reached.

The current minimum anonymity threshold is 10 submitted questionnaires.

StressAid is not a medical, psychological, or diagnostic tool. Its results are collective indicators intended to support human discussion and interpretation.

## Public beta limitations

This version is a hackathon MVP and early public beta.

Current limitations include:

- anyone with an active student link can submit the questionnaire;
- multiple submissions by the same person or browser are not currently prevented;
- password recovery is not included in the current beta;
- questionnaire links should currently be used only for demonstrations and controlled testing;
- further legal, accessibility, security, and school-specific review is required before production use with real students.

## Technology

StressAid is built with:

- Next.js
- TypeScript
- Supabase
- PostgreSQL
- Vercel

The application uses static, human-authored interpretation guidance. It does not provide automated medical or psychological conclusions.

## Local development

### Requirements

- Node.js
- npm
- a Supabase project

### Installation

Clone the repository:

```bash
git clone https://github.com/AgiMakusha/StressAid.git
cd StressAid
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Configure these environment variables in `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
```

Use only the public Supabase anonymous key in the client application.

Never commit `.env.local`, private credentials, service-role keys, access tokens, or environment-variable values.

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Quality checks

Run:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```

## SHU2026

StressAid was developed as part of Social Hackathon Umbria 2026.

## Project status

Public beta / hackathon MVP.
