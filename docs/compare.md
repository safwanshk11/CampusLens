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

The comparison page calls `POST /api/compare/insights?colleges=slug-a,slug-b` when
the user clicks Ask Gemini. GET no longer triggers generation. The server builds
public aggregate facts from PostgreSQL and sends those to Google's Gemini REST API.
No user identities, raw review text or credentials enter the prompt.

Gemini returns a conditional recommendation and three category explanations in
structured JSON. The server validates the response shape and lengths. Category labels,
leader IDs and the illustrative notice stay controlled by CampusLens. Missing values
suppress a category's leader; salary leaders require matching report years. The prompt
requires the generated prose to respect those constraints, but prose remains AI-generated
and is not independently fact-checked. This is not web research or a live ranking feed.

Set `GEMINI_API_KEY` in ignored `.env.local`. `GEMINI_MODEL` optionally overrides the
default `gemini-3.5-flash`. Restart the dev server if environment changes do not reload.
The key is sent only in the server's `x-goog-api-key` header. There is a 25-second timeout
and no automatic retries. Missing configuration returns an explicit 503, provider quota
limits return 429, and invalid/blocked/truncated responses return a sanitized 503.
There is no silent rule-based fallback labelled as Gemini.

See [Google's API reference](https://ai.google.dev/api) and
[structured-output documentation](https://ai.google.dev/gemini-api/docs/generate-content/structured-output).
`npm run test:gemini` uses mocked provider responses to verify the request, validation,
missing keys, rate limits, network errors and malformed output. The integration was
built and tested without a configured key; a live provider response remains unverified.

Input requires two to four distinct slugs (400 for invalid input, 404 for missing
colleges, sanitized 503 for data failures). Responses are not cached. Unit tests cover
ties, opposing strengths, missing metrics, mismatched years, zero fees and validation.
Browser checks previously exercised the compact controls and comparison navigation.
Selections now survive search submissions and selecting a card preserves the current page.
