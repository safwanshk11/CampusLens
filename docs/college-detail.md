# Phase 4 — College details

Open `/colleges/<slug>` from a discovery card's View college link. Each detail page
shows the college overview, location, ownership and establishment year, all offered
courses with annual tuition and eligibility, yearly placement reports and recent reviews.
The shared PRISM primitives supply the typography, cards, badges and navigation.

## Data flow

The page, metadata and `GET /api/colleges/<slug>` share `getCollegeDetail`. React cache
avoids duplicate work within a render. Prisma selects only public fields. Related
records and the full review aggregate are read in a repeatable-read transaction.
No authentication information, email addresses or reviewer user IDs are returned.

Courses are sorted by annual fee then ID. Placement reports are newest first. Reviews
are newest first with a stable ID tie-breaker, limited to the latest 20; the total and
average include all reviews. The UI explicitly says how many reviews it displays.
Review submission is not part of this phase.

The header fee is the cheapest of **all** offered programmes, unlike a discovery card
whose fee may reflect a course filter. Detail copy discloses this. Salaries are annual
INR. Placement percentage is placed/eligible only when both counts are available and
the eligible count is positive. Missing data stays unavailable; zero is a real value.

Illustrative colleges and reviews retain visible demo labels. Demo detail pages are
marked noindex. Website/report links render only for HTTP(S) URLs. Fictional seeds
have no invented external source links or campus photos.

## Navigation and recovery

Cards pass their applied discovery URL in `from`. Back to results accepts only
`/discover` or `/discover?...`, so external return URLs cannot be used. Direct visits
fall back to the catalogue. Four anchor links jump to page sections with nav clearance.
Loading skeletons, unavailable-data recovery and a college-specific not-found page
cover non-success paths. Retry reloads the page. The API returns 404 for absent/invalid
slugs and a sanitized 503 for database errors; successful JSON is non-cached.
Next.js streamed not-found pages may retain a 200 transport status after streaming
begins; the API gives an explicit 404 and the page renders the not-found state.

## Verification

`npm test` covers currency null/zero handling, placement denominators, safe external
links, return URL restrictions and existing search validation. `npm run test:detail`
checks the live detail API against Phase 1 fixtures: courses, placement ordering,
ratings, private-field exclusion, missing records and 404s. Use `TEST_BASE_URL` to
target a server other than localhost:3210. Lint and production build are required.

Compare and persistent saved items remain the next two feature phases.
