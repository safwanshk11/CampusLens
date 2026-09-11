# Phase 7 — Reliability

The health endpoint now tests PostgreSQL with `SELECT 1`. It returns 200 for a
connected database and 503 for missing configuration or an unavailable database,
without returning credentials or database error details. The pool has a five-second
connection timeout and a ten-second client query timeout.

## Checks

With the local seeded database and app on port 3210:

```bash
npm test
npm run test:api
npm run test:detail
npm run test:account
npm run test:throttle
npm run lint
npm run typecheck
npm run build
```

The search suite traverses the full catalogue instead of assuming there are only
12 records. Detail tests check missing information, review privacy and 404s.
Account integration tests create two temporary users and remove them in `finally`.
They check registration, login/logout, cookie flags, profile validation and
persistence, academic filtering and clearing, repeated saves, cross-user access
and cross-origin mutation rejection. Run these against a local development database.

## Local recovery

If college pages cannot load, start Docker Desktop, then run
`docker start campuslens-phase1-db`. Start the app with
`npm run dev -- --port 3210` and check `/api/health`.

## Remaining limits

- IIT/AIIMS information is illustrative, including admissions thresholds. It is
  not verified advice and must not be presented as actual admission eligibility.
- Authentication throttling uses a PostgreSQL atomic upsert so simultaneous
  requests cannot overwrite each other's attempt counts.
- Live Gemini quota and production hosting require independent checks.
- Automated tests do not replace a mobile/browser walkthrough or a real-user
  accessibility review.
