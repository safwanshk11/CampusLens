# Phase 5 — Compare colleges

Discovery cards now include a native Compare toggle. Selected slugs live in the URL as
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
