# Surface scenarios

A scenario is one normative description of a reader's session at the product
surface: user-observable setup, user actions, and user-observable outcomes.
It is the authoritative conformance lane. `vectors/` proves that a pure
operation computes the specified answer; a scenario proves that the shipped
product, driven the way a person drives it, behaves the specified way.

Each scenario is a checked pair. The prose file in this directory explains the
reader story, portability decisions, and boundaries. The executable plan at
`../../scenarios/<id>.json` owns its ordered actions and pass/fail
expectations. `npm run check:pairs` rejects an orphan on either side.

Every product that performs the behavior supplies a thin adapter — a browser
spec against the real web reader, an XCUITest against the real app, an Android
instrumentation test against the launched app. Platform repositories own their
gestures, observation mechanisms, launch mechanism, fixture, device matrix,
and diagnostics. `tale-spec` owns the actions and outcomes. The adapter emits
observations; the shared runner judges them. A producer does not become a
consumer merely to manufacture a green result: a server's HTTP payload
contract is proved at its real HTTP boundary, while the clients that fetch it
own the surface scenario for loading and failure.

## Prose and executable plan

Both halves are normative, for different reasons. Prose preserves the product
judgement behind portable acts such as ending a session or putting the screen
away. The executable plan makes omission and weakening mechanically visible:
it names every action, observation, cross-step capture, and expected result
once. If the two disagree, the pair is a bug and must change together.

This is not the semantic-vector lane in disguise. A surface adapter still
performs real gestures against the launched product and observes only rendered
or accessible outcomes. The JSON plan does not invoke product functions or
model state; it tells adapters what a reader does and tells the shared runner
what the reader must be able to see.

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

Create the prose and executable files together with the same basename. The
prose sections state what the scenario claims, its setup, any act needing a
portability definition, its steps and outcomes, and — required — what it does
not cover and what the next scenario would extend. The JSON expresses those
steps as actions, observations, captures, and expectations. That pairing keeps
scenario two a deliberate extension instead of an accidental fork, and gives
every unfinished client its intentional red test immediately.

- [`open-and-read.md`](open-and-read.md) — open a book, read down it, leave,
  come back to where you stopped.
- [`fetch-fails-honestly.md`](fetch-fails-honestly.md) — a client that cannot
  reach a book says so and gives the reader a working retry.
- [`kept-on-open.md`](kept-on-open.md) — a book you've started is a book you
  keep: it opens and reads offline at your place, with no button anywhere.
- [`note-and-back.md`](note-and-back.md) — a book's endnotes are part of the
  book: the reference hops to the note, the note hops back, and the round
  trip never moves the mark.
- [`play-and-pocket.md`](play-and-pocket.md) — press play and the voice
  starts where your reading stands, carries on with the screen away, holds
  its place across a pause, and moves the one mark.
- [`position-and-motion.md`](position-and-motion.md) — one quiet gutter line
  shows silent and spoken position; product movement interpolates, retargets,
  and becomes immediate under Reduce Motion without changing its destination.
- [`leave-and-return.md`](leave-and-return.md) — a bottom track distinguishes
  the saved mark from the current viewport, and an accessible continue action
  returns from a look back without counting the jump as reading.
- [`choose-a-new-place.md`](choose-a-new-place.md) — two confirmed recovery
  actions move the saved mark backward or remove it entirely, and both choices
  survive a new session.
- [`follow-and-override.md`](follow-and-override.md) — the spoken word lights
  the page and follows in a comfortable band until a genuine reader scroll
  takes control; automatic movement never becomes reading progress.
- [`mark-offline-and-sync.md`](mark-offline-and-sync.md) — mark, annotate,
  edit, and remove offline; the local plan survives relaunch, stays visibly
  unsaved, and becomes shareable only after automatic publication.
- [`reading-preferences.md`](reading-preferences.md) — change the book text
  size and appearance behind one quiet control; reflow keeps the passage and
  mark, and both choices survive a new session.
- [`library-open.md`](library-open.md) — cold launch into the library, open a
  row, see started and finished progress, and understand offline availability
  without losing the door into an unkept book.
- [`library-search.md`](library-search.md) — type against title and byline with
  the shared normalization, open the filtered book, and return to the same
  search.
- [`library-browse.md`](library-browse.md) — open list, genre, era, and author
  results and canonical addresses as native shelves backed by one payload.
- [`finish-and-leave.md`](finish-and-leave.md) — finish the text, find its
  provenance and original year in a quiet colophon, then take the way home.
- [`voice-rides-along.md`](voice-rides-along.md) — play once online and the
  voice replays across its seams offline; a voice never played explains what
  is missing and remains retryable.
- [`book-navigation.md`](book-navigation.md) — a directly opened book keeps a
  way home, and a producer-linked byline opens its native author shelf.
