# Scenario: pick a book from the library

**The claim.** The app has a front door. A cold launch with no book address
shows a useful list immediately; a reader can choose a book there, return to
see their place named honestly, and still understand and try a book that is not
on the device when the network is gone.

This is the first surface consumer of the title, byline, and percent already
stored by [`spec/progress.md`](../progress.md), and the second surface governed
by [`spec/presentation.md`](../presentation.md). It does not create a second
reading route: activating a row opens the same book surface and the same local
record as `open-and-read`.

Read [`README.md`](README.md) first. The executable plan beside this prose owns
the ordered actions and observations; adapters translate them into native
launch, navigation, reading gestures, and accessible/rendered observations.

## Setup

- One signed-out device with no reading progress or kept books at the start.
- No incoming URL or restored navigation state. The product is launched at its
  ordinary front door.
- A stable library fixture containing at least two readable books. Both carry
  a title and byline; the first runs for several screens, can be read to its
  end, and has a working read-along. Neither has progress at the start.
- How a client fetches and snapshots the catalog is platform-owned foundation,
  not a second surface behavior.

"First" and "second" name the fixture's stable displayed order, not an
alphabetical rule. A product may put started books ahead of curated books; this
scenario does not specify the larger catalog's ordering policy.

## Network

Making the service unreachable is the platform's genuine offline condition,
not an intercepted row tap or a test-only availability flag. The library is
already open when the condition changes. A native client may additionally
terminate and relaunch here as stronger lifecycle evidence, but the portable
claim is the rendered offline list; durable cold-launch recovery belongs to
the native catalog store's integration proof.

## Steps

**1. Cold-launch the product with a reachable service and no URL.**

The library is on screen with at least two books. Every row exposes its title
and byline and remains an ordinary tappable control. Its visual construction is
the library section of `spec/presentation.md`: machine voice, title first,
quiet metadata, soft rules, no cards. The narrated first book carries the
trailing play control that also identifies it as an audiobook.

**2. Activate the first row.**

The same book surface established by `open-and-read` opens at its cover and at
the start. A list-row doorway does not mint another book identity, preselect a
paragraph, or change the reader.

**3. Read forward several screens and use the platform's ordinary way back to
the library.**

The library shows the stored integer percent for that book, between 1 and 99,
with `%`. The observation comes from the rendered row; reading the progress
store is forbidden.

**4. Activate the first book's play control.**

The canonical book opens and its read-along is already playing. The play
gesture does not lead to a parallel audiobook screen, wait for a second press,
or leave the reader behind on the library while audio starts elsewhere.

**5. Pause, read that book to its end, and return to the library.**

The same row now says **read**. It does not say `100%`, and finishing does not
remove the book from the list.

**6. While the library is open, make the service unreachable.**

The library stays usable. The first book is available because opening it kept
it on the device. The never-opened second book is dimmed but remains tappable.
One line above the list says
`you're offline · the dimmed tales aren't available right now`; dimming never
has to explain itself.

**7. Activate the dimmed second row.**

The activation is real. It reaches the existing honest offline-not-kept
surface: `you're offline, and you haven't started this one.` followed by `a
tale keeps itself once you've read a little of it.`, with the existing way
onward. A disabled row or an adapter that jumps straight to that error without
activating the row is red.

## What this does not cover

- Typing, filtering, ranking, empty queries, or keyboard selection. Those are
  the next discovery scenario.
- Catalog transport shape, validators, refresh cadence, snapshot atomicity, or
  malformed-response recovery. Those are client-owned foundation contracts
  proved through their public transport/store boundary.
- Syncing progress from an account or another device. The percent is local.
- Offline eviction, an explicit keep control, narration downloads, or storage
  management. Opening remains the only trigger for keeping text; this scenario
  only fixes discovery and immediate playback for narration.
- Exact library contents, global order, synopsis copy, covers, genres, badges,
  search, or curation tools.
- Reading behavior beyond the cover, ordinary progress, finish, and way back
  already owned by earlier scenarios.

## What the next scenario would extend

`typing-finds-a-book` should begin at this same library, type through the
platform's native text input, specify normalization and result order, activate
one filtered row, and prove the same canonical book opens. It should not add a
second catalog, row component, or navigation path.
