# Loom walkthrough script

**Target length:** 4–5 minutes  
**Recording setup:** share the browser and keep a temporary account ready. Never show `.env.local`, keys, passwords, cookies or database URLs.

## 0:00–0:25 — Opening

“Hi, this is CampusLens, a college discovery platform built for the Full Stack Engineer Track A assignment. It helps a student go from a broad catalogue to a shortlist they understand. I’ll show the product flow first, then the architecture behind it.”

Show the homepage and briefly point to **Discover**, **Compare** and **Saved**. Mention that signed-out product actions lead to sign-in so saved data stays private.

## 0:25–1:20 — Discover

“I’ll start with Discover. I can search by college, course or city, then refine by state, discipline, ownership, degree level, fees and rating. Results are paginated so the page stays quick as the catalogue grows.”

Sign in, open Discover, and show:

1. Search for a college or city.
2. Open **Refine your search** and apply one filter.
3. Switch between **Cards** and **List**. Explain that List is a compact, responsive row layout.
4. Change sorting and move to the next page.

“The left filter column stays available while I browse. College names, locations, ratings and fees are visible at a glance, and missing values remain clearly unavailable.”

## 1:20–2:00 — College detail

“Every college card is clickable, so the user can open the detail page without hunting for another button.”

Open a college and scroll through the page.

“This page brings the decision context together: a campus image, overview, courses and fees, placements, ratings and reviews. The page keeps source and availability details close to the numbers instead of implying false precision.”

Point out the back-to-results path and the Save control.

## 2:00–2:45 — Compare

“From Discover I can select two to four colleges and open Compare. The same fields are aligned side by side, which makes tradeoffs easy to read.”

Select two colleges and show the comparison table.

“The optional insight panel explains the supplied figures. It is deliberately constrained: it does not invent rankings, browse for unsupported claims, or pretend that one college is universally best.”

## 2:45–3:30 — Account and shortlist

“CampusLens also supports a private account. The academic profile is optional: a student can enter their stream, marks, exam scores, budget and interests, or skip it and browse normally.”

Open **My account**, show the form, then return to Discover.

“When the profile is saved, the student can apply or clear the academic filter from Discover. Saving a college or comparison stores it for this account, and another user cannot see it.”

Open **Saved** and show the saved item.

## 3:30–4:25 — Architecture

Switch to the repository or VS Code.

“Technically, this is a modular Next.js App Router application. Server-rendered pages and route handlers define the request boundary. Domain services handle search, authentication, saved items and comparison logic. Prisma is the only database access layer, backed by PostgreSQL or Neon.”

Show these files briefly:

- `prisma/schema.prisma` — users, colleges, courses, placements, reviews and saved items.
- `src/server/colleges/search.ts` — SQL filtering, aggregates and pagination.
- `src/server/auth/` — scrypt password hashing, hashed sessions, origin checks and throttling.
- `src/components/` — shared PRISM design-system primitives and responsive UI.

“Client components are limited to interactions such as filters, compare toggles, saves and motion. Secrets stay server-side.”

## 4:25–4:50 — Close

“I validated the build, linting, type checks, API and detail flows, account isolation and authentication throttling. The live app is available at campuslens-tan.vercel.app. The next data-quality step would be replacing prototype catalogue figures with verified institutional sources. Thanks for watching.”

## Recording checklist

- Use a temporary account and safe, fictional profile values.
- Keep the browser at 100% zoom and close unrelated tabs.
- Show the live app before the code walkthrough.
- Do not show secrets, personal data, payment details or private database screens.
- Pause briefly on the Cards/List toggle, comparison table and architecture files.
