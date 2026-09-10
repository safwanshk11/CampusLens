# CampusLens — Product Scope

> **See your options clearly.**

CampusLens is a college discovery platform for students choosing where to study. It replaces the
"fifteen tabs and five conflicting numbers" experience with one structured, comparable view of each
college and a private shortlist.

- **Role:** Full Stack Engineer · AI Software Engineer Internship
- **Track:** A — College Discovery Platform

## The journey

```text
DISCOVER      find candidate colleges
    ↓
UNDERSTAND    read one college in a consistent structure
    ↓
COMPARE       line up finalists field by field
    ↓
SHORTLIST     keep the ones that fit
```

Every screen hands off to the next without losing context.

## The four features

| # | Feature | Journey step | What it must do |
|---|---------|--------------|-----------------|
| 1 | **College listing + search** | Discover | Search by name, course or city. Filter by fees, ratings, ownership and similar fields. Paginated result cards showing identity, location, rating, fees and placement data. |
| 2 | **College detail page** | Understand | One college in a consistent structure: overview, courses, fees and placements. Scannable, dense, readable. |
| 3 | **Compare colleges** | Compare | Select several colleges and view them side by side. Rows align field by field and differences are made obvious. |
| 4 | **Authentication + saved items** | Shortlist | Sign in, save and unsave colleges, and view the saved list. Saved items belong to the user. |

## Explicitly out of scope

Not planned for this submission. Adding any of these needs an explicit scope change.

- Admission predictor
- Q&A
- Discussion forum
- Admin dashboard
- AI chatbot
- Scraping
- Recommendation engine
- Social feed

## Phases

| Phase | Focus | Status |
|-------|-------|--------|
| **0** | Architecture, PRISM design system, liquid-glass primitives, motion architecture, homepage visual prototype, `/design-system` lab, Prisma and environment foundation, documentation | **This phase** |
| Later | College data model and seed, search API, filters, detail page, compare, authentication, saved items | Deferred |

## Data honesty

These rules apply in every phase.

- **No fake statistics.** No invented college counts, user counts, testimonials or "live" numbers.
- **Illustrative content is labelled.** Phase 0 previews use fictional college names and are marked
  *Illustrative*, *Specimen data* or *Illustrative values*. Preview illustrations are exposed to
  assistive technology as images with a description, so invented values are never read out as facts.
- **No fake behaviour.** Placeholder routes (`/discover`, `/compare`, `/saved`, `/sign-in`) state
  plainly that the feature is not built yet. The hero search form really submits to `/discover`,
  which echoes the query and explains that results arrive later.
