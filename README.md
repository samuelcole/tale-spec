# tale-spec

The portable product contract for [tale](https://tale.fyi): one definition of
the reader behavior every client must ship.

The stance behind the suite: **every platform ships the same product.**
Same semantics, same payload, same presentation — a reader moving between
the web and a native app is holding the same book. What a platform keeps
for itself is its native chrome: scroll physics, selection UI, system
furniture, the things that should feel like the device. Anything
product-defining lives here, once, instead of forking per platform.

**Conformance means black-box integration at the user-facing surface.** The
web runner drives the actual rendered reader in a browser; a native runner
drives the actual app. Both perform user actions and observe outcomes through
that surface, including persistence by terminating and relaunching the product.
Importing an internal reducer or passing a shared operation vector is unit-test
evidence, not client conformance. The mandatory red-green delivery process is
in [`AGENTS.md`](AGENTS.md).

## What's here

- **`spec/`** — the normative prose. Each document states the rules of one
  contract area, self-contained: an implementer needs nothing but this
  repository to build a reading layer with the same product semantics.
  - [`spec/harness.md`](spec/harness.md) — the shared semantic-vector format
    and comparison rules for implementation-owned unit tests.
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
- **`vectors/`** — shared semantic unit fixtures, one JSON file per area. They
  make pure operations portable and mutation-testable, but they do not prove a
  web page or native app behaves correctly at its user-facing surface.

The black-box surface-scenario harness is not implemented yet. Its absence
fails closed: feature implementation waits for the harness and its intentional
red scenario. Until then, these repositories have portable semantic coverage
but no client may claim full conformance.

## How to consume it

There are two deliberately separate test lanes:

1. An implementation may load `vectors/` in its own unit-test runner and
   compare pure operation results under [`spec/harness.md`](spec/harness.md).
   These tests help build the client but never qualify the client as conforming.
2. The authoritative conformance runner launches the real product, performs
   the portable scenario's user actions, and observes its outcomes at the
   rendered app surface. A web scenario must pass in the real browser reader;
   the corresponding iOS scenario must pass through the real app and XCUITest.

For existing behavior, characterize the shipped web surface first, prove it
green there, and sync the scenario to unfinished clients as an intentional red
test. For new behavior, write the scenario first so every client is red, make
web green, then dispatch client implementations. If work remains after a
client is green, add the missing scenario and make it red again.

## The constellation

tale is several repositories, and this one is the hub — the only thing every
implementation must read. The map, and each repo's relationship to the spec:

- **`tale`** — the product: the web reader at [tale.fyi](https://tale.fyi)
  and the server behind every client. The *reference implementation*: existing
  behavior must be characterized through its real rendered surface. Some
  semantic vectors were derived from its pure functions and it runs those
  fixtures as consumer zero, but that unit lane is not surface conformance. It is
  also where the generation this suite deliberately excludes lives
  single-sourced: anchor ids and payload content are produced server-side
  and only ever *received* by clients — the payload's *shape* is specified
  here (`spec/payload.md`), its content never is.
- **`tale-ios`**, **`tale-android`** (planned) — native readers, one per
  platform, no shared UI runtime. Their unit tests may pass semantic vectors
  before a screen exists; their conformance run must remain red until the real
  app implements and exposes the specified behavior at its user-facing surface.
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

**How a product change rolls out.** A portable surface scenario lands first
and produces the intentional red result. Web then implements the reference
behavior; remaining clients follow. Additive semantic-vector cases use the
same direction: consumers may newly fail after syncing, and the implementation
changes rather than the fixture. A changed expected value requires a version
bump and migration note before every consumer deliberately updates — never
piecemeal, because two consumers on different sides of a semantic change are
two products.

## What's deliberately absent

- **Anchor identifier generation.** Clients receive anchor ids with the
  content (in the payload of `spec/payload.md`); they never generate them.
  A reading system with two anchor generators has two contracts, so the
  generator stays server-side and out of scope here.
- **Event-driven behavior** — which scrolls may advance progress (the intent
  gate), and how narration and a live scroll arbitrate. Those rules are
  planned as event-trace vectors; until then they are not covered by this
  suite.

## Versioning

Each vector file carries an integer `version`.

- **Adding cases** to an area keeps its version. A semantic implementation may
  newly fail after a pull; that's the fixture doing its job.
- **Changing any expected value** is a breaking change to a shipped contract:
  it bumps the area's version and requires a migration note in that area's
  spec document explaining what shipped readers experience. It carries the
  same weight as changing a published URL.
