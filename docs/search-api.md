# Phase 2 — College search API

## What changed

`GET /api/colleges` now reads the Phase 1 PostgreSQL database. This phase supplies
the backend; `/discover` remains a placeholder until Phase 3 builds the discovery UI.
No schema migration is required for Phase 2.

The route validates URL parameters with Zod, calls the server-only search service,
and returns a typed JSON result. The service uses Prisma's parameterized SQL because
rating and course-fee aggregates must be filtered and sorted before pagination.

## Parameters

All parameters are optional. Each may appear once; unknown keys are rejected.
Text filters are trimmed. Enum and sort values are case-sensitive.

| Parameter | Meaning / accepted values |
| --- | --- |
| `q` | Case-insensitive literal substring of college name, city or matching course name; maximum 100 characters. Blank means no text filter. |
| `city`, `state` | Case-insensitive exact location, maximum 100 characters |
| `ownership` | `PUBLIC`, `PRIVATE`, `DEEMED` |
| `discipline` | Case-insensitive exact course discipline, e.g. `Engineering` |
| `degreeLevel` | `UNDERGRADUATE`, `POSTGRADUATE`, `DIPLOMA` |
| `minFee`, `maxFee` | Inclusive annual tuition bounds in whole INR, 0–2,147,483,647; minimum cannot exceed maximum |
| `minRating` | Inclusive average rating threshold, 0–5 with at most two decimal places; excludes unrated colleges even at 0 |
| `sort` | `name_asc` (default), `fee_asc`, `fee_desc`, `rating_desc` |
| `page` | 1–10,000; default 1 |
| `pageSize` | 1–50; default 12 |

Examples on the current development server:

- [Default results](http://localhost:3210/api/colleges)
- [Engineering below ₹100,000 annually](http://localhost:3210/api/colleges?discipline=Engineering&maxFee=100000&sort=fee_asc)
- [Bengaluru search](http://localhost:3210/api/colleges?q=bengaluru)
- [Ratings of at least 4](http://localhost:3210/api/colleges?minRating=4&sort=rating_desc)

## Response contract

`data` contains college identity, location, ownership, image URL and demo flag, plus:

- `minAnnualFeeInr`, `maxAnnualFeeInr`: range among programmes matching the course
  filters. Without course filters, the range spans all programmes. Both fee sort
  directions sort the **minimum** of that range; `fee_desc` is not highest-course-fee sorting.
- `matchingCourseCount`: number of programmes matching discipline, degree and fee filters.
- `averageRating`, `reviewCount`: aggregate of college reviews; unrated means null and 0.
  The rating is not rounded before filtering or sorting; the UI may round for display.
- `placementYear`, `medianSalaryInr`: the latest report's year and median. Missing
  latest-year median stays null; the query does not substitute an older year's number.

`pagination` returns page, pageSize, total, totalPages and navigation flags. An
out-of-range page returns an empty data array while retaining the true total.
Zero results means zero totalPages and both navigation flags false. On an out-of-range
page with results elsewhere, hasPreviousPage is true so the UI can navigate back.

`query` echoes normalized validated parameters and defaults. `meta.feeBasis` labels
the fee semantics; `meta.demoDataNotice` is set when the current page contains demo
colleges. Every item also carries `isDemo`. No private user or review-author data is exposed.

## Filter semantics

All filters combine with AND. All course conditions must match the **same programme**.
For example, a college with a ₹40,000 engineering programme and a ₹52,000 business
programme does not match Engineering with a ₹50,000–₹60,000 fee range.

The `q` search is OR across college name, city and a course name. Course-name matches
must also meet the active course filters. College-name/city matches need only have a
programme meeting those filters. Text search does not narrow the displayed fee range;
explicit course filters do. Label the range accordingly in the discovery UI.

Location/ownership filters apply to the college. Unrated colleges and colleges without
courses are retained unless the user applies a relevant rating/course filter. Unknown
values such as a nonexistent city produce an empty result rather than a validation error.

## Correctness and failure handling

The SQL uses bound values, escaped LIKE wildcard characters and an allowlisted sort
fragment. Pagination has explicit limits. Ties use name and ID for deterministic ordering;
null fee/rating values sort last. Separate lateral aggregates prevent duplicate review
counts from course joins. Count and page reads share a repeatable-read transaction,
so they see the same database snapshot. Different requests can still reflect later edits.

- `200`: results or a valid empty result.
- `400`: `{ error: { code: "INVALID_QUERY", message, issues: [{ field, message }] } }`.
- `503`: `{ error: { code: "SEARCH_UNAVAILABLE", message } }` for database/configuration
  failures. No connection strings, raw SQL or stack traces are returned or logged.
- Unsupported POST requests receive Next.js's `405` response.

Responses use `Cache-Control: no-store`. The Node.js route is dynamic. This is a bounded
MVP query, not a benchmarked large-catalogue search engine. Substring scans and offset
pagination should be profiled on representative data before adding search indexes or
switching to cursor pagination. There is no relevance ranking or fuzzy matching yet.

## Verification

```bash
npm test            # 21 validation tests, no server/database required
npm run test:api    # live HTTP integration checks against Phase 1 fixtures
npm run lint
npm run typecheck
npm run build
```

API tests use `http://localhost:3210` by default. Set `TEST_BASE_URL` for another server.
Run against a database containing the unchanged Phase 1 seed; tests are read-only and
expect its 12 colleges. Tests cover case-insensitive search, course/location combinations,
fee semantics, ratings, missing data, ordered pagination, empty results, literal wildcard
and SQL-like inputs, validation responses and unsupported methods.

The production failure path was also checked using a separate local server with an
unreachable database: valid search returned a sanitized 503 and invalid input still
returned 400 before database access. Automatic Prisma error logging is disabled; the
route emits a generic diagnostic without connection details.
