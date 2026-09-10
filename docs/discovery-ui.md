# Phase 3 — College discovery UI

`/discover` now renders database-backed college results. The homepage search already
submits here, so the homepage journey now leads to working results.

## How it works

The page awaits URL search parameters, validates them with the Phase 2 parser, and
calls the same server-only search service as `/api/colleges`. Server Components call
the shared service directly rather than making an HTTP request back to their own app.
The response stays consistent with the public API's filtering and fee semantics.

The search form is a small client island: it submits a trimmed URL, drops blank
controls and navigates without reloading the site shell. A native GET action also
works without JavaScript. The UI route ignores empty control values; the public API
retains its strict validation. Submitting a search, filter or sort resets pagination.
Filter removal and pagination are links preserving the other applied parameters.
Back/Forward and refresh restore applied controls from the URL, including sort.
The UI defaults to six results per page; the API keeps its default of twelve.

There are explicit Search colleges, Apply filters and Sort actions. Editing an input
alone does not fetch results. Pending navigation is announced through a status region.
The loading route uses PRISM college skeletons; empty, invalid-query, out-of-range and
database-failure states offer recovery. Database failure Retry performs a full reload.

## Design

The intelligence regime reuses Geist functional type, PRISM ink/azure colours, existing
ambient light, quiet glass utility chrome and solid result cards. No new tokens or
motion libraries were introduced. Filter controls collapse on mobile and expand on
desktop; native details and labelled fields support keyboard use. Cards have headings,
location, ownership, ratings, annual fees, latest placement median, programme counts
and expandable explanations. The card specimen is also in `/design-system`.

Illustrative status is visible both at catalogue and card level. Currency is formatted
in INR with Indian digit grouping. Missing figures are shown as unavailable, and zero
reviews remain unrated. Starting tuition is the minimum across programmes matching
explicit course filters; living costs are excluded. Text search alone does not narrow
the fee range, consistent with the API.

## Phase boundary

College detail navigation was connected in Phase 4. Compare is Phase 5; authentication
and persisted saved items are Phase 6. Cards have no nonfunctional save or compare
buttons. View college preserves applied filters for the return journey.

## Verification

Browser checks covered desktop rendering, search submission, combined search and fee
filtering, browser Back, reset, pagination, mobile layout at 390px and empty results.
The mobile document width matches its viewport without horizontal overflow.
Lint, production build, query tests and the live API integration suite remain quality gates.

Use `http://localhost:3210/discover` to inspect the implemented page.
