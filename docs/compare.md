# Phase 5 — Compare colleges

Discovery cards now include a compact icon button with a named `aria-pressed` state.
The icon changes to a checkmark when selected; the tray carries the shared Compare action.
Selected slugs live in the URL as
`compare=slug-a,slug-b`, so refresh, sharing and browser navigation preserve the working
comparison. The fixed tray caps selection at four and enables Compare now at two.

`/compare?colleges=...` reads the selected colleges from PostgreSQL and renders an
aligned side-by-side table for tuition, ratings, latest median salary, report year and
programme count. The table keeps its minimum width on small screens and scrolls
horizontally rather than compressing numbers into unreadable columns. College names link
to their detail pages. Invalid or stale selections produce a recoverable empty state.

This phase intentionally uses URL state only. Saved comparisons and authentication are
Phase 6. The compare selection does not enter the search API validator; catalogue query
parameters and comparison state are separate concerns. Existing card links remain the
primary card action, while the compare control sits above the card link and remains
keyboard accessible.

Tuition uses the lowest offered annual fee and placements use the latest report. Missing
values remain unavailable. The existing Phase 1 illustrative-data labels stay visible.

## Explain the trade-offs

The comparison page calls `GET /api/compare/insights?colleges=slug-a,slug-b` on demand.
This is a CampusLens API backed by the stored database, not an external AI or live
college-ranking service. It returns separate leaders for starting tuition, median
salary and average rating, including ties. It does not produce an overall winner.
Missing values suppress a category's leader. Salary leaders require the same report
year across all selected colleges. Tuition may represent different programmes, and
review sample counts are disclosed. Fictional data produces an illustrative notice.

Input requires two to four distinct slugs (400 for invalid input, 404 for missing
colleges, sanitized 503 for data failures). Responses are not cached. Unit tests cover
ties, opposing strengths, missing metrics, mismatched years, zero fees and validation.
Browser checks exercised the compact controls, comparison navigation and actual API call.
Selections now survive search submissions and selecting a card preserves the current page.
