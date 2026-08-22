# tale-spec

The portable product contract for [tale](https://tale.fyi): one definition of
the reader behavior every client must ship — the progress model, the reader's
position and resume rules, the read-along timeline math, and the user-intent
gate. One spec, many implementations — each platform implements these rules in
its own language and must be proved to ship them through its own product
surface.

The stance behind the contract: **every platform ships the same product.**
Same semantics, same payload, same presentation — a reader moving between
the web and a native app is holding the same book. What a platform keeps
for itself is its native chrome: scroll physics, selection UI, system
furniture, the things that should feel like the device. Anything
product-defining lives here, once, instead of forking per platform.

**Conformance means black-box integration at the user-facing surface.** The web
runner drives the actual rendered reader in a browser; a native runner drives
the actual app. Both perform user actions and observe outcomes through that
surface, including persistence by terminating and relaunching the product.
Importing an internal reducer or passing a shared semantic vector is unit-test
evidence, not client conformance. The mandatory red-green delivery process and
the foundation carve-out are in [`AGENTS.md`](AGENTS.md).

## What's here

- **`spec/`** — the normative prose. Each document states the rules of one
  contract area, self-contained: an implementer needs nothing but this
  repository to build a reading layer with the same product semantics.
  - [`spec/harness.md`](spec/harness.md) — the shared semantic-vector format
    and comparison rules for implementation-owned unit tests. Read this first.
  - [`spec/progress.md`](spec/progress.md) — the local progress store: the
    high-water mark, merging across devices and across renamed keys, and the
    plan-tip rules.
  - [`spec/reader.md`](spec/reader.md) — the one current-paragraph rule and
    everything derived from it: percent, arrival dimming, resume, finished.
  - [`spec/timeline.md`](spec/timeline.md) — the whole-book audio timeline:
    section starts, phrase lookup, and the word cut that keeps a highlight
    on the word being spoken.
  - [`spec/payload.md`](spec/payload.md) — the content API response contract:
    the exhaustive sanitized sections shared by web and native readers,
    version-bound narration, and content-addressed HTTP validation.
  - [`spec/follow-scroll.md`](spec/follow-scroll.md) — event traces for
    narration arbitration after the intent gate approves a reader position.
  - [`spec/presentation.md`](spec/presentation.md) — the book column as a
    contract: the three voices, the paper-and-ink palette, paragraph
    geometry, and the chrome line native platforms may cross. Prose-only,
    no vectors yet.
  - [`spec/intent.md`](spec/intent.md) — the user-intent event gate: which
    position changes may advance local progress.
  - [`spec/scenarios/`](spec/scenarios/) — the surface scenarios: portable,
    prose descriptions of a reader's session, stated as user-observable setup,
    actions, and outcomes. The authoritative conformance lane.
    [`README.md`](spec/scenarios/README.md) states what a platform adapter may
    translate and what it may not weaken; the first scenario is
    [`open-and-read.md`](spec/scenarios/open-and-read.md).
- **`vectors/`** — shared semantic unit fixtures, one JSON file per area. Where
  prose and vector disagree, the vector is the bug report and one of them must
  change under the versioning policy below. They make pure operations portable;
  they do not prove a web page or native app behaves correctly at its
  user-facing surface.
- **`scenarios/`** — executable surface scenarios. Actions and expected
  observations live here once; clients do not restate either in JavaScript,
  Swift, Kotlin, or another implementation language.
- **`bin/tale-spec.mjs`** — validates scenarios, launches each client adapter,
  and judges its observations centrally. Missing steps, missing observations,
  stale vendored scenarios, and changed outcomes fail closed.

Every prose scenario has a machine-readable, executable test plan with
the same basename: `spec/scenarios/<id>.md` explains the reader story, intent,
and boundaries; `scenarios/<id>.json` defines the actions and pass/fail
expectations. Neither form may exist without the other; `npm run check:pairs`
enforces the pairing and validates every plan.

## How to consume it

There are three deliberately separate lanes.

1. **Semantic unit fixtures.** Write a thin adapter in your platform's own
   test runner (a few hundred lines) that loads each vector file, dispatches
   each case's `op` to your implementation, and compares the result under the
   rules in [`spec/harness.md`](spec/harness.md). Nothing here requires a
   shared runtime or a specific language. These tests help build a client; they
   never qualify one as conforming.
2. **Surface scenarios.** The authoritative lane. `tale-spec` owns the ordered
   actions and expected observations. A client adapter translates each action
   into real user gestures, observes the rendered product surface, and emits a
   normalized result record. The shared runner alone decides whether it
   passes. Web must drive the real browser reader; iOS must drive the launched
   app through XCUITest; Android must drive the launched app through its native
   instrumentation runner.
3. **Foundation.** Work that adds no user-facing behavior — an app target, a
   scheme, CI, a transport, a store — may land before the surface harness
   exists, proved by the narrowest appropriate unit or operational test. It
   receives no conformance credit and cannot make a client green.

For existing behavior, characterize the shipped web surface first, prove it
green there, and sync the scenario to unfinished clients as an intentional red
test. For new behavior, write the scenario first so every client is red, make
web green, then dispatch client implementations. If work remains after a client
is green, add the missing scenario and make it red again.

## Bootstrapping a client

A new client starts with the adapter, before product behavior. The adapter has
only three responsibilities:

1. load the exact vendored executable scenario selected by
   `TALE_CONFORMANCE_SCENARIO`, or the scenarios named in
   `TALE_CONFORMANCE_SCENARIO_IDS` when running as a batch;
2. map every action it understands to real UI gestures and report only the
   named, user-observable facts; and
3. print exactly one `TALE_CONFORMANCE_RESULT ` record per selected scenario
   using protocol version 1. An unknown action is an error, never a skipped
   step.

Add that command to the conformance matrix:

```json
{
  "clients": [
    {
      "id": "android",
      "cwd": "../tale-android",
      "scenarioDir": "app/src/androidTest/resources/tale-spec/scenarios",
      "command": ["./scripts/run-conformance", "{scenario}"]
    }
  ]
}
```

An expensive native harness may also provide `batchCommand`. `run-all` launches
that command once with `TALE_CONFORMANCE_SCENARIO_DIR` and the JSON-encoded
`TALE_CONFORMANCE_SCENARIO_IDS`, then independently judges the one result record
for every applicable scenario. Missing, duplicate, or unknown results fail
closed. Keeping `command` alongside it preserves focused `tale-spec run` calls:

```json
{
  "clients": [
    {
      "id": "ios",
      "cwd": "../tale-ios",
      "scenarioDir": "TaleUIGates",
      "command": ["bash", "scripts/run-surface-conformance.sh", "{scenario}"],
      "batchCommand": ["bash", "scripts/run-surface-conformance.sh", "--all"]
    }
  ]
}
```

Then run:

```sh
tale-spec run-all scenarios path/to/matrix.json
```

At that point the new client has the full red contract. The implementation
loop—whether driven manually or with `/goal`—is simply to make the matrix green.
It is complete only when the shared runner accepts every step; a platform-local
test cannot grant itself conformance by weakening or omitting an expectation.
`run-all` requires every plan by default. A product may declare a scenario
`notApplicable` only with a checked-in explanation—for example, the web reader
produces rather than consumes its content API—so an absent adapter cannot look
like a pass.

## The constellation

tale is several repositories, and this one is the hub — the only thing every
implementation must read. The map, and each repo's relationship to the spec:

- **`tale`** — the product: the web reader at [tale.fyi](https://tale.fyi)
  and the server behind every client. The *reference implementation*: existing
  behavior is characterized through its real rendered surface. The semantic
  vectors were extracted from its pure functions and it runs them as consumer
  zero over a vendored copy of `vectors/`, but that unit lane is not surface
  conformance. It is also where the generation this suite deliberately excludes
  lives single-sourced: anchor ids and payload content are produced server-side
  and only ever *received* by clients — the payload's *shape* is specified
  here (`spec/payload.md`), its content never is.
- **`tale-ios`**, **`tale-android`** (planned) — native readers, one per
  platform, no shared UI runtime. A new client implements the small action and
  observation adapter first, immediately acquiring the complete red scenario
  matrix. Its unit tests may also walk the semantic vectors in a native runner
  (Swift Testing, JUnit) before a screen exists, and its foundation may land
  under the carve-out; its conformance result stays red until the real app
  implements and exposes the specified behavior at its user-facing surface.
- **`tale-align`** — the forced-alignment tool that produces audio sync
  maps (public, on npm). Independent of this suite except where it matters
  most: the word cut in [`spec/timeline.md`](spec/timeline.md) binds it
  too — sync maps and clients must cut identically or highlights drift.

**How a consumer pins.** Each implementation vendors `vectors/` and
`scenarios/` verbatim — byte-identical, with formatters kept away from the
copies — and records the tale-spec commit it synced from in a pin file.
Automate both halves: `spec:sync` re-vendors at a commit, rewrites its pin, and
runs the suite. The central runner also compares the selected scenario with
the client's copy before launching it, so drift cannot be silent. (Not a
submodule, deliberately: a private submodule sits in build and deploy clone
paths that cannot authenticate to it, and it would still be the same pin with
worse ergonomics.)

**How a product change rolls out.** A portable surface scenario lands first and
produces the intentional red result; web then implements the reference
behavior, and the remaining clients follow. Semantic vectors roll out the same
direction: additive cases are picked up at a consumer's next sync and may newly
fail — fix the implementation, not the vector. A changed expected value needs a
version bump and migration note first (see below), then every consumer syncs
and adapts in one deliberate pass — never piecemeal, because two consumers on
different sides of a semantic change are two products.

## What's deliberately absent

- **Anchor identifier generation.** Clients receive anchor ids with the
  content (in the payload of `spec/payload.md`); they never generate them.
  A reading system with two anchor generators has two contracts, so the
  generator stays server-side and out of scope here.
- **Restore retirement** — how a reading layer retires its own restore when a
  platform later applies a competing restored scroll offset.
- **Destructive confirmation** — the two-press arm-then-fire machine for
  actions that discard a mark.

## Versioning

Each vector file carries an integer `version`.

- **Adding cases** to an area keeps its version. An implementation may newly
  fail after a pull; that's the fixture doing its job.
- **Changing any expected value** is a breaking change to a shipped contract:
  it bumps the area's version and requires a migration note in that area's
  spec document explaining what shipped readers experience. It carries the
  same weight as changing a published URL.

Each executable surface scenario also carries an integer `version`. A new
scenario starts at 1. Any change to its actions, captures, observations, or
expected results bumps that version so an adapter cannot report against a
different plan by accident. A prose clarification that leaves the executable
plan unchanged does not bump it; a product decision that changes the plan does.
