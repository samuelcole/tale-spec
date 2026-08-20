# Surface scenarios

A scenario is one normative description of a reader's session at the product
surface: user-observable setup, user actions, and user-observable outcomes.
It is the authoritative conformance lane. `vectors/` proves that a pure
operation computes the specified answer; a scenario proves that the shipped
product, driven the way a person drives it, behaves the specified way.

Each scenario is run by a hand-written adapter in every product that performs
the behavior — a browser spec against the real web reader, an XCUITest against
the real app — in that platform's own test runner. Platform repositories own
their adapters, launch mechanism, device matrix, and diagnostics. This
directory owns the outcomes. A producer does not become a consumer merely to
manufacture a green result: a server's HTTP payload contract is proved at its
real HTTP boundary, while the clients that fetch it own the surface scenario
for loading and failure.

## Prose, not a format

Scenarios are written as prose deliberately. A scenario's hard part is the
judgement about what a platform may substitute for an act with no literal
equivalent — "end the session" is not the same gesture twice — and that
judgement does not survive being flattened into a table of ops. That table is
`vectors/`, and it is the wrong tool here: it would prove that two adapters
agree about a script, not that two products agree about reading. A scenario
format may earn its way in later, once enough scenarios exist to show what is
genuinely common between them. Two adapters implementing one written scenario
is the shape until then.

## What an adapter may translate

- **The gesture.** A scroll is a wheel, a swipe, a drag, or a key — whatever
  the platform's ordinary reading gesture is.
- **The route to a book.** A typed address, a deep link, or the app's own
  navigation, as long as the route carries the book's address and nothing
  else.
- **The session-end mechanism**, within the definition the scenario gives.
- **The fixture** — which book, at which pinned content, at which viewport,
  in which appearance. A scenario names the properties a fixture needs, never
  a particular file.
- **Waiting.** Settling, animation, and layout timing are the adapter's
  problem.

## What an adapter may not weaken

- **No looking inside.** Every outcome is observed on screen or through the
  platform's accessibility surface. Reading the progress store, importing a
  reducer, or asking the app what it believes its position to be proves
  nothing about the product.
- **No synthetic movement in place of input.** Where a scenario says the
  reader scrolls, the scroll arrives through the platform's genuine input
  path. Telling the page to scroll is precisely the thing several outcomes
  exist to distinguish from reading, so substituting it deletes the test.
- **No softened outcome.** "The same paragraph" does not become "about the
  same place". An outcome stated as an exact paragraph is exact.
- **No skipped step.** A step the platform cannot yet perform is a red
  result, not an omission — as is a scenario that does not run at all.

## Writing one

One file per scenario, named for the reader's session. Sections: what the
scenario claims, its setup, any act that needs a portability definition, its
numbered steps with the outcome each must produce, and — required — what it
does not cover and what the next scenario would have to extend. That last
section is what keeps scenario two a deliberate extension instead of an
accidental fork.

- [`open-and-read.md`](open-and-read.md) — open a book, read down it, leave,
  come back to where you stopped.
- [`fetch-fails-honestly.md`](fetch-fails-honestly.md) — a client that cannot
  reach a book says so and gives the reader a working retry.
