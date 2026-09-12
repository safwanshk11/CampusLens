# Phase 8 — Deployment runbook

Status: deployed and verified at https://campuslens-tan.vercel.app.

## Database

Create a dedicated Neon database for this prototype. Set `DATABASE_URL` to its
pooled URL and `DIRECT_URL` to the direct URL in the environment used for database
commands. Existing environment variables take precedence over `.env.local` in
`prisma.config.ts`. Do not accidentally migrate the local database instead.

```bash
npm ci
npm run db:deploy
npm run db:seed
npm run db:seed-national
```

The seeds are repeatable but overwrite their seeded records. They create 12
fictional profiles and 45 IIT/AIIMS profiles with illustrative data, not verified
institution statistics. Do not run them over a curated production catalogue.

## Hosting

The project imports `safwanshk11/CampusLens` into Vercel with the Next.js preset and repository
root as the project root. Use `npm run build`; `postinstall` generates Prisma.
Add the production pooled `DATABASE_URL`, public `NEXT_PUBLIC_SITE_URL`, and
optional server-only `GEMINI_API_KEY`/`GEMINI_MODEL` in project environment settings.
Use an independent database for preview deployments. Keep `DIRECT_URL` limited
to the environment running migrations when possible.

Never put database credentials or Gemini keys in `NEXT_PUBLIC_` variables or Git.
The app is usable without Gemini; its comparison feature has deterministic insights.

## Release verification

After deployment, require `/api/health` to return HTTP 200 with database `connected`.
The deployment seed command imports the 280-state catalogue after the national
profiles; `/api/colleges?pageSize=1` should return 337 profiles in total.
Check discovery, a college detail, comparison, new-account registration, optional
academic profile, clear-filter action, saving and logout over HTTPS. Check the
session cookie is Secure and HttpOnly. Check narrow-screen layouts and keyboard
navigation in the hosted environment. Record the deployment URL in the README.

For a failed code release, restore the previous Vercel deployment. Do not reset or
reseed the database as a rollback action; database changes need a separate migration.

Sources: [Vercel Git deployment](https://vercel.com/docs/git),
[Neon connection pooling](https://neon.com/docs/connect/connection-pooling),
[Neon Prisma migrations](https://neon.com/docs/guides/prisma-migrations).
