# Phase 9 — Walkthrough and submission

Status: script prepared. Recording, public deployment and final submission pending.

## Five-minute Loom script

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
