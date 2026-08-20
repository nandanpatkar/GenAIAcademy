# Data Science

## Data Science

![The Data Science course.](/docs-shots/sections/data-science.jpg)

Sets `showDataScience`; the panel is `src/components/DataScienceCourse.jsx`.

## How the content is produced

This course is generated, not authored in React. Two scripts run as one npm script:

```bash
npm run build:datascience
# → python3 scripts/build_datascience_course.py
# → python3 scripts/build_datascience_mirror.py
```

The first builds the course from its source corpus; the second produces a mirror. Output is split the way every generator in this repo splits it — a small navigable index into `src/data/`, and the large page bodies into `public/` or R2 for fetch-on-demand delivery. See [Content pipeline](doc:content-pipeline).

`Data_science_interview_question.md` at the repo root is a related but separate content source, feeding the interview bank rather than this course.

This generator is **not** part of the root `build` chain. Its output is committed, so a fresh clone renders the course without running it.
