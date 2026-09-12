# State catalogue expansion — work in progress

Target: ten additional leading colleges in each of India's 28 states, across major
disciplines. IITs and AIIMS are excluded from the new selections. Union territories
are outside this 280-college target.

## Selection evidence

`python3 scripts/research-state-catalogue.py` collects NIRF 2025 ranking and rank-band
pages. `data/research/state-shortlist.json` is a research queue, not an import file.
The shortlist rotates through discipline-specific ranking lists so engineering,
medicine, universities, arts/science colleges, management and other fields can be
represented. It is not a cross-discipline ranking or a claim of definitive state
top tens. Rank bands retain their band; no exact rank is invented.

Many states have fewer than ten candidates in these lists. Those gaps require
additional institution-level research. Name variants and multi-campus institutions
also require manual identity review before publication.

## Completed local pilot

NIT Tiruchirappalli has 65 programme entries transcribed from its
[official Academic Programmes page](https://www.nitt.edu/home/academics/programmes/)
checked 2026-09-12. Entries include UG, PG, integrated and doctoral programmes;
the M.S. research entry retains the source's broad department-level description.
This is coverage of that published listing, not a guarantee that every listed
programme admits students in the current cycle. Fees and placements stay unavailable
until independently verified. Programme-specific admissions are not inferred.

Two selected Google Maps reviews were read in the user's browser. Their summaries
retain author, individual star rating, displayed relative date, observation date
and source link. They are clearly labelled paraphrases and are not mixed into
CampusLens's own ratings or represented as verified student reviews.

Run migrations, then `npm run db:seed-sourced` to import the pilot. The import is
transactional and upserts by stable college/programme identity. It creates no fake
reviewer accounts. Existing IIT/AIIMS demo records are unaffected.

## Remaining work

- Resolve shortlist gaps and duplicates; verify ten distinct institutions per state.
- Read each institution's current programme listing and prospectus, including PG,
  doctoral, diploma and certificate offerings where published.
- Verify fees and placements independently; record their academic year and source.
- Review and attribute public Google reviews for each new profile.
- Validate new records locally, then migrate/import to production in reviewed batches.

No claim is made that the 280-college expansion or its Google review coverage is
complete. The research queue is deliberately not published as empty college cards.
