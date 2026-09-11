# Real college catalogue — initial batch

Run `npm run db:deploy`, then `npm run db:import-real`. The importer upserts 93 directory records atomically by stable name-derived slug. It preserves existing courses, reviews, saves and placements and refuses collisions with fictional records. Renames need an explicit identity migration.

Coverage: 23 IITs and 31 NITs from the JoSAA 2026 institution directory; AIIMS Delhi from its official website and 22 AIIMS project identities from the July 2023 PIB PMSSY list; 16 independent universities from NIRF 2025. Private university coverage is an initial selection, not every state. AIIMS inclusion is not confirmation of operational status or current admission availability.

Sources are recorded per institution with the consultation date. Data publication dates differ: a source checked in 2026 is not necessarily a 2026 publication. No fees, courses, rankings, reviews or cutoffs are synthesized. Missing founding years and course fees support null. Identity-level sources do not verify all fields of future enriched profiles.

Real entries appear before fixtures in search. Searching IIT, NIT or AIIMS matches the directory group. The academic filter remains explicitly demo-only; clearing it displays real directory records. Fee/course filters exclude entries without those facts. No inference of admission eligibility is made.

Remaining work: private college coverage across remaining states; current AIIMS admissions validation; course-level sourced data; year, rank, category and quota based cutoff matching; AISHE bulk import once an accessible official export is obtained. Existing Gemini analysis cannot establish missing admissions facts.
