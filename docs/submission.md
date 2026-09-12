# Phase 9 — Walkthrough and submission

Status: script prepared. Recording, public deployment and final submission pending.

## Five-minute Loom script

Read this naturally while sharing your browser. Keep the live app open at
`https://campuslens-tan.vercel.app` and use a temporary account for the recording.

### 0:00–0:30 — Opening

“Hi, this is CampusLens. It is a college discovery platform built for the Full
Stack Engineer Track A assignment. The goal is to help a student move from a
large list of options to a shortlist they understand. I’ll show discovery,
college details, comparison, and saved items, then briefly explain the architecture.”

Show the landing page. Point out that signed-out product actions intentionally go
to sign-in first.

### 0:30–1:15 — Sign-in and discovery

“I’ll start by signing in, because the product experience is account-based.”

Register or sign in with the temporary account. Return to Discover and say:

“Discover gives me a searchable catalogue. I can search by college, course, or
city, refine by discipline, ownership and fees, sort the results, and move through
stable pages. The filter panel starts closed so the catalogue remains the focus.”

Search for **Aurora**, open and close the filter panel, apply one filter, and show
the result count and pagination.

“The current catalogue is prototype data. Fees, placements, and academic rules
are labelled illustrative and should not be used as admissions advice.”

### 1:15–2:00 — College details

Open a college card.

“Cards are clickable, so the action is simple: select the college you want to
understand. This page keeps the information in one place: overview, courses and
fees, placement history, rating, and reviews. When a figure is unavailable, the
interface says that instead of inventing a value.”

Scroll through each section and point out the campus image and illustrative-data
label.

### 2:00–2:45 — Compare

Return to Discover, select two colleges for comparison, and open Compare.

“Compare lines up two to four colleges field by field. The insights explain
tradeoffs such as tuition, ratings, and placement figures. Gemini is optional here:
it only explains the supplied database facts and does not browse for rankings or
claim that one college is universally best.”

Point out a missing-data state or a tied result if visible.

### 2:45–3:45 — Account, academic profile, and saved items

Open My account.

“The academic profile is optional. A student can enter their stream, marks, exam
scores, budget, state, and interests, or skip it and browse normally. The profile
is stored on the account and can be edited later.”

Enter safe demo values, save them, return to Discover, and show the academic filter.

“When the academic filter is on, matching is explicitly labelled as a demo rule.
The clear-filter action immediately returns me to the full catalogue.”

Save a college and a comparison, then open Saved.

“Saved colleges and comparisons belong to this user. A different account cannot
see them, and signing out removes access from the browser session.”

### 3:45–4:30 — Engineering walkthrough

Open the repository or VS Code.

“The application uses Next.js App Router, TypeScript, Tailwind, Prisma, and
PostgreSQL. Search performs filtering and aggregation in SQL before pagination.
The server keeps credentials out of the client, hashes passwords with scrypt,
stores only hashed session tokens, checks request origins, and throttles auth
attempts atomically in PostgreSQL.”

Show `prisma/schema.prisma`, `src/server/colleges/search.ts`, and the shared PRISM
components briefly.

### 4:30–5:00 — Validation and close

“I verified the production health endpoint, the live college API, the build,
linting, type checking, search and detail tests, account isolation, academic
filtering, and concurrent auth throttling. The live deployment is available at
campuslens-tan.vercel.app. The remaining product limitation is that the catalogue
figures are illustrative; verified institutional data would be the next data
quality phase. Thanks for watching.”

Do not show `.env.local`, API keys, passwords, cookies, or database connection
strings at any point.

1. **0:00–0:30 — Product.** Show the homepage: CampusLens helps students explore,
   compare and save college options. Explain the four core features.
2. **0:30–1:30 — Discovery.** Search Aurora, apply an engineering/fee filter,
   clear it and show pagination. Open a card directly. Explain that the catalogue
   contains illustrative figures and must not guide actual admissions.
3. **1:30–2:15 — Details.** Show courses, fees, placement years and demo reviews.
   Contrast a college with missing reports. Missing information stays unreported.
4. **2:15–3:00 — Compare.** Select Aurora and Bluehaven. Explain cost/outcome
   tradeoffs. Gemini is optional and explains supplied facts, not live research.
5. **3:00–4:00 — Account.** Register a temporary account. Show optional academic
   onboarding, save-and-see-matches, clear the academic filter, save a college and
   comparison, then revisit Saved. Open My account to edit scores.
6. **4:00–5:00 — Engineering.** Show Prisma schema, aggregation before pagination,
   shared PRISM components and test results. Explain hashed sessions, user
   ownership checks and atomic attempt counting. State the remaining need for
   verified institution data.

Keep environment files, passwords, cookies and tokens out of the recording.
Use the original demo colleges for the main walkthrough; national profiles have
fewer populated sections and no imported reviews.

## Before submitting

- Add the verified HTTPS deployment link to README.
- Complete hosted verification in `docs/deployment.md`.
- Record and review the Loom, then add its share link to README.
- Confirm reviewer access to the repository, deployed site and recording.
- Check the original assignment for the exact submission destination and fields;
  its complete source document is not present in this repository.
- Keep the data limitations explicit in the submitted description.

## Suggested description

CampusLens is a Next.js/TypeScript/PostgreSQL college discovery prototype with
search, detail pages, comparison, authentication and saved shortlists. Optional
academic profiles support illustrative matching. PRISM provides a consistent
design system. Automated checks cover validation, search, account isolation and
rate limiting. College statistics and admission thresholds are demo data, not
verified admissions guidance.
