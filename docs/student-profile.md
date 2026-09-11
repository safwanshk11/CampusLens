# Student profiles and demo matching

New registrations open `/account`, where users may enter academic details or skip directly to discovery. Existing users can edit the same form. Saving opens `/matches`.

Profiles are stored in the user's nullable JSONB `studentProfile` field, validated with Zod and written through an authenticated, same-origin PUT `/api/account/profile`. Blank numeric values remain null. A profile is never sent to Gemini.

The current matching demonstration uses undergraduate discipline, annual tuition budget, Class 12 percentage and the selected entrance score. Fictional engineering criteria are 60% in Class 12 and 70 JEE Main percentile. Medical demo criteria are 60% and 350 NEET marks, but the current dataset contains no medical courses. These are invented demonstration thresholds, not published admissions rules. Real colleges without rules receive an unknown-requirements status.

Class 10, exam year, other exam results, home state and interests are stored but do not currently affect matching. Production eligibility needs sourced, year-specific course requirements, subject prerequisites and applicable counselling/category rules. The interface explicitly labels demo results and missing data.

Validation: unit tests cover blank/zero scores, invalid numbers, cutoff boundaries, missing results, budget exclusions and unknown real requirements. Live smoke checks cover registration, authenticated saving, account reload, results rendering and rejected anonymous writes.
