# The harness contract

What a vector file contains, how a case's result is compared, and what a
conforming test runner does. This document is normative for every area.

## Vector file schema

Each file in `vectors/` is one contract area:

```json
{
  "area": "reader",
  "version": 1,
  "cases": [
    {
      "op": "percent-of",
      "name": "is 1-based over the paragraph count, rounded",
      "input": { "index": 0, "total": 4 },
      "expected": 25
    }
  ]
}
```

- `area` — the area name; matches the file name (`vectors/<area>.json`).
- `version` — integer, the area's contract version (see the README's
  versioning policy).
- `cases[]` — every case has:
  - `op` — kebab-case operation name. The area's spec document enumerates
    its operations, their input fields, and their result shape. Runners
    must fail loudly on an `op` they don't recognize — an unknown op means
    the suite is newer than the adapter, not that the case passes.
  - `name` — human-readable, unique within its op; failures are reported
    by `op` + `name`.
  - `input` — named fields, never positional. Field meanings are defined
    per-op in the area's spec document.
  - `expected` — the result, compared under the rules below.
  - `note` — optional, informative only. Cases derived by running a
    reference implementation (rather than hand-written) say so here.

## Input encoding

JSON has no `undefined`, so the encoding distinguishes three states, and the
distinction is load-bearing (the progress area's plan-tip rules depend on
it):

- **Absent field** — "not provided" / "never known". An adapter passes its
  language's absence (e.g. omit the argument, pass `nil`/`undefined`).
- **`null`** — a deliberate, recorded null. Pass an explicit null value.
- **Any other JSON value** — itself.

Two special encodings:

- The string `"Infinity"` in a position the op defines as numeric denotes
  positive infinity. (Used for open-ended paragraph bounds on the audio
  timeline.)
- Optional function-valued parameters are encoded as data; each op that
  needs this defines the encoding in its spec document (e.g. the reader
  area's `ineligible` index list).

## Comparing results

Deep structural equality, with:

- **Numbers**: equal when `|actual − expected| ≤ 1e-9 × max(1, |expected|)`.
  This absorbs decimal representation of values like ⅓ while keeping
  integer results exact.
- **Absent vs null in objects**: an expected object field that is absent
  must be absent (or the language's undefined) in the actual result; an
  expected `null` must be an explicit null. Adapters for languages that
  can't make the distinction in a given structure must document the
  mapping they chose and apply it consistently.
- **The stamp marker** `{"$instant": true}`: matches a present **string in
  ISO-8601 date-time shape** — `YYYY-MM-DDThh:mm:ss`, optional fractional
  seconds, and a `Z` or `±hh:mm` offset — that parses as a real instant.
  The contract is the shape *plus* validity, not "whatever parses": a
  runner must reject values its platform's lenient date parser would accept
  (locale dates, bare numbers). Used where an implementation stamps a clock
  the spec doesn't fix; an implementation that stops stamping fails. It
  never matches absence.
- **Arrays**: same length, elements compared in order under these rules.

## The runner

A conforming runner:

1. Loads every file in `vectors/`.
2. For each case, dispatches `op` with `input` to the implementation under
   test and compares the result to `expected` under the rules above.
3. Reports each failure with the file, `op`, `name`, expected, and actual.
4. Fails the whole run on any unknown `area` file it has no adapter for, or
   any unknown `op` — silence is how contracts rot.

The suite has no order dependence: every case is independent, and any state
an op reads (a progress store, a timeline) is part of that case's `input`.
