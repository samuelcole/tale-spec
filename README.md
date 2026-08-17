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
  - [`spec/payload.md`](spec/payload.md) — the shape of a tale as a client
    receives it: flat anchored blocks, styled runs. Draft; becomes the
    content API's response contract.
  - [`spec/presentation.md`](spec/presentation.md) — the book column as a
    contract: the three voices, the paper-and-ink palette, paragraph
    geometry, and the chrome line native platforms may cross. Prose-only,
    no vectors yet.
  - [`spec/intent.md`](spec/intent.md) — the user-intent event gate: which
    position changes may advance local progress.
- **`vectors/`** — shared semantic unit fixtures, one JSON file per area. Where
  prose and vector disagree, the vector is the bug report and one of them must
  change under the versioning policy below. They make pure operations portable;
  they do not prove a web page or native app behaves correctly at its
  user-facing surface.

The black-box surface-scenario harness is not implemented yet. Its absence
fails closed for user-facing feature work: that work waits for the harness and
its intentional red result. Foundation work with no user-facing behavior may
proceed under the carve-out in [`AGENTS.md`](AGENTS.md). Until the surface
harness drives a client through its real UI, no client may claim conformance.

## How to consume it

There are three deliberately separate lanes.

1. **Semantic unit fixtures.** Write a thin adapter in your platform's own
   test runner (a few hundred lines) that loads each vector file, dispatches
   each case's `op` to your implementation, and compares the result under the
   rules in [`spec/harness.md`](spec/harness.md). Nothing here requires a
   shared runtime, a specific language, or this repository's code — there is no
   code. These tests help build a client; they never qualify one as conforming.
2. **Surface scenarios.** The authoritative lane. A portable scenario is
   written here and run by a runner that launches the real product, performs
   the scenario's user actions, and observes its outcomes at the rendered app
   surface. A web scenario must pass in the real browser reader; the
   corresponding iOS scenario must pass through the real app and XCUITest.
3. **Foundation.** Work that adds no user-facing behavior — an app target, a
   scheme, CI, a transport, a store — may land before the surface harness
   exists, proved by the narrowest appropriate unit or operational test. It
   receives no conformance credit and cannot make a client green.

For existing behavior, characterize the shipped web surface first, prove it
green there, and sync the scenario to unfinished clients as an intentional red
test. For new behavior, write the scenario first so every client is red, make
web green, then dispatch client implementations. If work remains after a client
is green, add the missing scenario and make it red again.

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
  platform, no shared UI runtime. Their unit tests may walk these vectors in a
  native runner (Swift Testing, JUnit) before a screen exists, and their
  foundation may land under the carve-out; their conformance result stays red
  until the real app implements and exposes the specified behavior at its
  user-facing surface.
- **`tale-align`** — the forced-alignment tool that produces audio sync
  maps (public, on npm). Independent of this suite except where it matters
  most: the word cut in [`spec/timeline.md`](spec/timeline.md) binds it
  too — sync maps and clients must cut identically or highlights drift.

**How a consumer pins.** Each implementation vendors `vectors/` verbatim —
byte-identical, with formatters kept away from the copies — and records the
tale-spec commit it synced from in a pin file. Automate both halves: the
reference consumer's `spec:sync` re-vendors at a commit, rewrites its pin,
and runs its suite, and its every test run re-verifies the vendored bytes
against the pin whenever this repository is reachable — so drift cannot be
silent. (Not a submodule, deliberately: a private submodule sits in build
and deploy clone paths that cannot authenticate to it, and it would still
be the same pin with worse ergonomics.)

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
- **Narration arbitration** — how narration and an intent-approved reader
  position hand control back and forth is planned as a later event-trace area.
  The raw user-intent gate is covered by
  [`spec/intent.md`](spec/intent.md); the later area consumes its result rather
  than defining a second gate.
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
