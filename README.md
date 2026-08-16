# tale-spec

The conformance suite for [tale](https://tale.fyi)'s reading semantics: the
progress model, the reader's position and resume rules, and the read-along
timeline math. One spec, many implementations — each platform implements
these rules in its own language and proves it with the same vectors, run by
its own native test runner.

## What's here

- **`spec/`** — the normative prose. Each document states the rules of one
  contract area, self-contained: an implementer needs nothing but this
  repository to build a conforming reading layer.
  - [`spec/harness.md`](spec/harness.md) — the vector format, the comparison
    rules, and what a conforming test runner does. Read this first.
  - [`spec/progress.md`](spec/progress.md) — the local progress store: the
    high-water mark, merging across devices and across renamed keys, and the
    plan-tip rules.
  - [`spec/reader.md`](spec/reader.md) — the one current-paragraph rule and
    everything derived from it: percent, arrival dimming, resume, finished.
  - [`spec/timeline.md`](spec/timeline.md) — the whole-book audio timeline:
    section starts, phrase lookup, and the word cut that keeps a highlight
    on the word being spoken.
- **`vectors/`** — the executable cases, one JSON file per area. The vectors
  are the spec: where prose and vector disagree, the vector is the bug report
  and one of them must change under the versioning policy below.

## How to consume it

Write a thin adapter in your platform's own test runner (a few hundred lines)
that loads each vector file, dispatches each case's `op` to your
implementation, and compares the result under the rules in
[`spec/harness.md`](spec/harness.md). Nothing here requires a shared runtime,
a specific language, or this repository's code — there is no code.

## What's deliberately absent

- **Anchor identifier generation.** Clients receive anchor ids with the
  content; they never generate them. A reading system with two anchor
  generators has two contracts, so the generator stays server-side and out of
  scope here.
- **Event-driven behavior** — which scrolls may advance progress (the intent
  gate), and how narration and a live scroll arbitrate. Those rules are
  planned as event-trace vectors; until then they are not covered by this
  suite.

## Versioning

Each vector file carries an integer `version`.

- **Adding cases** to an area keeps its version. A conforming implementation
  may newly fail after a pull; that's the suite doing its job.
- **Changing any expected value** is a breaking change to a shipped contract:
  it bumps the area's version and requires a migration note in that area's
  spec document explaining what shipped readers experience. It carries the
  same weight as changing a published URL.
