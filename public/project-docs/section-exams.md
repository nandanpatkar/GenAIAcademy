# Exams and Certification

## Exams and Certification

![The exam bank.](/docs-shots/sections/exams-and-certification.jpg)

Sets `showExamsDocs`; the panel is `src/components/ExamsDocs.jsx`.

One nav item over seven in-viewer tracks, so `getActiveNavId` maps all of them back to the single `exams` id with no extra mapping — the same arrangement Strands uses.

## Related components

| Path | Role |
|---|---|
| `src/components/ExamsDocs.jsx` | The study-guide viewer |
| `src/components/ExamsMarkdown.jsx` | Exam-specific markdown rendering |
| `src/components/quiz/examBank/ExamHub.jsx` | The exam bank hub |
| `src/components/quiz/examBank/PracticeTab.jsx` | Practice questions |
| `src/components/quiz/examBank/FlashcardsTab.jsx` | Flashcards |
| `src/components/quiz/examBank/StudyGuideTab.jsx` | Study guides |
| `src/components/quiz/examBank/VideosTab.jsx` | Video resources |
| `src/components/quiz/examBank/vendorMeta.js` | Per-vendor metadata |
| `src/components/quiz/examBank/apiHelpers.js` | Calls into `/api/exam` |

## The server side

This is one of the few sections with a real backend dependency beyond authentication. `api/exam.js` dispatches on `req.query.resource`, with `exam`, `name`, `path` and `format` as supporting parameters, and `format=csv` switching the response away from JSON.

Scraped results are cached back into Supabase — `cached_exam_questions` and `cached_exam_resources` — using `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS. That is why the handler needs credentials the browser never sees. The scraping logic itself is in `api/_lib/examScraper.js`, covered by `tests/examScraper.test.mjs` (which has no npm script — run it with `node --test`).

Content generation is `npm run build:exams` (`scripts/build_exams_docs.py`), plus `scripts/build-exam-list.js` and the `filtered_exam_urls.csv` source at the repo root.

## A note on history

`LEGACY_EXAM_ITEM_IDS` in `sidebarRegistry.js` lists seven ids the section originally shipped with — `exam_guide`, `exam_ai_services`, `exam_data`, `exam_modeling`, `exam_sagemaker`, `exam_genai`, `exam_mlops`. They are gone from the registry, so a saved layout still naming them would render nothing. Listing them lets `resolveEffectiveLayout()` sweep them out rather than leaving dead entries behind — a useful pattern to copy whenever you consolidate several nav items into one.
