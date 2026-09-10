# Phase 1 — Database and seed

## What this phase delivers

A PostgreSQL schema, versioned initial migration, Prisma client, repeatable fictional
fixtures and an integration verification command. The homepage and placeholder pages
remain Phase 0 UI; search API implementation begins in Phase 2.

## Relationships

- **College** holds identity, location, ownership and overview. A unique slug becomes
  its readable detail URL. A college owns many courses, yearly placements and reviews.
- **Course** belongs to one college. Its slug is unique within that college. It stores
  discipline, degree level, duration in months, eligibility and annual tuition in INR.
  This is an actual offered programme, not a global course catalogue.
- **Placement** holds one college-wide report per year. Salary figures are annual INR.
  Null means unavailable. Placement percentage is calculated from placed / eligible
  students only when both are known and eligible is greater than zero.
- **Review** links a user and college, with one rating from 1–5 per pair. Derive the
  average rating and count from reviews; no duplicated cached rating can go stale.
  An empty review set means unrated. This model supports detail content, not a discussion feature.
- **User** holds identity only. Authentication/provider/session design is deferred to
  Phase 6. There are no passwords, working demo accounts or authentication endpoints.
  Email must be trimmed and lowercased before writing and looking up accounts.
- **SavedCollege** joins user and college. Its composite primary key prevents duplicate saves.
- **SavedComparison** is a named, private collection belonging to one user.
  **ComparisonCollege** joins it to colleges with explicit display positions 0–3.
  Unique positions cap a comparison at four colleges and duplicate colleges are forbidden.
  Phase 5 must enforce a minimum of two colleges when saving, in one transaction;
  the schema alone permits an empty draft. Authorization must scope reads/writes to
  the signed-in user in Phase 6; foreign keys do not implement authorization.

Deleting a user cascades through reviews and saved items. Deleting a college cascades
through courses, placements, reviews and saves, but is restricted if it appears in a
saved comparison. That prevents silently breaking a comparison. There is no deletion UI.

## Money, filters and missing information

Integer INR avoids floating-point money arithmetic. Annual tuition excludes hostel,
meals and other living expenses. Later UI can format lakh values by dividing by 100,000;
keep raw database/API values in INR. Fee comparisons must label the selected programme
or disclose that the minimum annual offered fee is being shown.

Indexes cover location, ownership, name, course fees, discipline/level and relational
lookups. These are a baseline, not a claim that substring search is optimized. Phase 2
should inspect the search query plan before adding PostgreSQL trigram/full-text indexes.

The migration adds SQL CHECK constraints for ratings, nonnegative fees/salaries,
positive duration, placement counts, normalized email and comparison positions.
Prisma does not represent these CHECK constraints in its schema: preserve them in
future migrations and apply migrations rather than replacing them with `db push`.

## Fixtures and data honesty

`prisma/seed-data.ts` defines 12 fictional colleges across 10 states/territories and
three ownership types. The seed creates 36 courses, 22 annual placement records,
10 fictional reviewer identities and 10 illustrative reviews. Two colleges have no
reviews, one has no placements and another has a missing median salary.

College and Review have explicit `isDemo` flags. Future pages and API consumers must
carry and display the illustrative-data label; related course and placement records
inherit the college's demo status. No fixtures are verified admissions information.
There are no fabricated institutional websites, photos, source links or credentials.

Run the seed explicitly. It uses stable unique keys and upserts in a transaction, so
running it again does not multiply records. It refreshes fixture values, does not
clear tables, preserves unrelated records and refuses a non-demo college slug collision.
Saved items are not prepopulated; integration verification uses a temporary user and
cleans that user up. Demo identities use the reserved `.example` domain.

## Local database

The implementation was tested with PostgreSQL 17 in Docker, bound only to localhost
on port 54329. `.env.local` is ignored by Git and contains local development settings.
This is a local database, not a Neon deployment.

If the existing container is stopped:

```bash
docker start campuslens-phase1-db
```

For a fresh local installation:

```bash
docker run --name campuslens-phase1-db \
  -e POSTGRES_USER=campuslens -e POSTGRES_PASSWORD=campuslens_local \
  -e POSTGRES_DB=campuslens -p 127.0.0.1:54329:5432 -d postgres:17-alpine
```

Set `DATABASE_URL` in `.env.local` to
`postgresql://campuslens:campuslens_local@localhost:54329/campuslens`.
The database remains in this container between stops; removing the container removes
its data. These credentials are for this localhost-only development instance.

```bash
npm run db:generate
npm run db:deploy
npm run db:seed
npm run db:verify
npm run db:studio
```

For Neon, put the pooled connection in `DATABASE_URL` and optionally the direct
connection in `DIRECT_URL`. The CLI prefers DIRECT_URL; runtime uses DATABASE_URL.
`npm run db:migrate -- --name change_name` creates future development migrations.
`db:deploy` applies checked-in migrations without resetting existing data.
Do not run demo seeding against a production catalogue.

Prisma 7 requires explicit seed execution; it is configured in `prisma.config.ts`.
See the [official Prisma configuration reference](https://docs.prisma.io/docs/orm/reference/prisma-config-reference).

## Verification

`db:verify` requires migrated, seeded PostgreSQL. It checks fixture counts, missing
placements, duplicate saves, foreign keys, invalid ratings/fees/placement counts,
comparison ordering/position constraints and cascading removal of saved data.
It creates a temporary user and removes it in a finally block. Run it on development
or test databases, not production. Run the seed twice before verification to confirm
repeatability. Also run schema validation, lint, typecheck and the production build.
