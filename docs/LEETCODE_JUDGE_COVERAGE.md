# Code Lab judge coverage

Code Lab is backed by the pattern-wise DSA dataset in [`dsanew/`](../dsanew/README.md).
Regenerate the artefacts with `npm run build:codelab`, check them with
`npm run validate:codelab`, and prove the judge with `npm run verify:codelab`.

- Problems in the catalog: **322** (262 from LeetCode, 60 authored classics)
- Categories / patterns: **17 / 70**
- Judge-enabled problems: **322** (100%)
- Test cases: **848** — every one passes against the reference solution when
  executed through the real harness (`npm run verify:codelab`)
- Problems with hidden cases on submit: **52**

## Artefacts

| File | Role |
|---|---|
| `src/data/codelab/catalog.json` | eager index: list, filters, category → pattern navigation |
| `public/codelab/problems/<slug>.json` | per-problem statement, starter code, reference solution, sample cases (fetched on demand) |
| `api/_data/codelabManifests.json` | server-only manifests: entrypoint, serializers, judge config, visible **and hidden** cases |

Hidden cases never reach the client: they live only in the server manifest and
their values are redacted from submit results by `redactHiddenResults`.

## Judging modes

Problems are addressed by **slug** (`3sum`, `aggressive-cows`); LeetCode-sourced
problems also resolve by their question number for older links.

Entrypoints: `solution-method` (301), `class-operations` (16),
`linked-list-cycle` (2), `codec-roundtrip` (1), `clone-graph` (1),
`multilevel-flatten` (1).

Comparators beyond deep equality exist because many problems accept more than
one correct answer: `unordered`, `unordered-outer`, `any-of`, `float` (scalars
and lists), `mutation` / `prefix-mutation` for in-place problems,
`next-pointers`, `node-value`, `frequency-sorted-string`, `reorganized-string`
and `valid-knight-tour`.

## Verification

`npm run verify:codelab` builds the exact script the remote runner would
execute — for all 322 problems, using each problem's reference solution — and
runs it against the local `python3`. A failure there is a harness or manifest
bug, since the same solutions are independently verified by
`python3 dsanew/harness/run_tests.py --all`.
