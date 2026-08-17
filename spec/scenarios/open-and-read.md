# Scenario: open and read

**The claim.** A reader opens a book, reads down it, leaves, and comes back to
find the book waiting where they stopped — and nothing but their own reading
moved the mark.

This is the surface statement of three contracts that already have prose: the
inclusive high-water mark and the position a book opens at
([`spec/reader.md`](../reader.md)), the local store that outlives a session
([`spec/progress.md`](../progress.md)), and the gate that refuses to count
programmatic movement as reading ([`spec/intent.md`](../intent.md), whose
`resume` source is exactly the movement step 4 tests).

Read [`README.md`](README.md) in this directory first: it says what an adapter
may translate and what it may not weaken.

## Setup

- One device, signed out, no account, no synced progress. Nothing here depends
  on merging a server copy, and a signed-in session would put `merge-remote`
  in the middle of the scenario.
- No recorded reading position for this book on this device: a clean install,
  or a cleared store.
- A book at a stable public address whose text runs well past the several
  screens the reader will scroll. The reference fixture is the curated
  `dracula` at the reference implementation's pinned commit.
- Ordinary reading conditions: default type size, no narration playing, no
  plan marks open, no passage fragment in the address.

## The session boundary

Steps 3 and 4 end a session and start another. That act has no single
mechanism across platforms, so it is defined by what it must destroy and what
it must preserve. A session end must:

1. **destroy the reading layer's memory** — no in-process state carries the
   position forward;
2. **preserve the device's stored reading record** — nothing is cleared, and
   the store is the only thing permitted to carry the position across; and
3. **carry no position into the next session** — the act that reopens the book
   carries the book's address and nothing more: no scroll offset, no restored
   view state, no resume token.

On iOS this is terminate and relaunch: the app goes to the background, is
terminated, and is launched again plainly — no URL, no launch state naming a
position — and the book is then opened again the way a reader would open it.

On the web there is no process to terminate, and the honest equivalent is a
**fresh page context navigating to the book's address**: close the page, open
a new one in the same browser profile, go to the address. The reference
reader's store is `localStorage` under `tale:read`, which is per-origin and
outlives a page, so property 2 holds; the new page has no history entry, no
session-scoped state, and no JavaScript heap from the old one, so properties 1
and 3 hold.

Two tempting web substitutes are **not** permitted, for the same reason in
both cases — each would let this scenario pass with the product's resume
behavior removed entirely:

- **A reload** keeps the same history entry, and the browser reapplies its own
  scroll offset to it. The page lands in roughly the right place whether or
  not the product resumed anything.
- **A back or forward navigation** carries the platform's own restored
  position, and the reference reader deliberately declines to resume on one
  for exactly that reason (`may-auto-continue` in
  [`spec/reader.md`](../reader.md)). It would test the branch this scenario is
  not about.

The scenario assumes an *ordinary* end of session — the platform's normal
exit, which gives the product its normal chance to persist. Surviving a crash
or a force-kill that skips the platform's exit path is out of scope.

## Steps

**1. Open the book at its address.**

The first screen shows the start of the book: its title and its opening line.
No text is dimmed, because none has been read. If a platform's cover pushes
the opening line off the first screen, that is a real difference between the
products and is resolved here — not relaxed in an adapter.

**2. Scroll forward through several screens of text and stop.**

The scroll is a real reading gesture, and the page settles without carrying on
past where the reader let go. Call the paragraph at the top of the settled
screen **P**. Nothing has become dimmed: text read during a session stays ink
until the next visit.

**3. End the session, then open the book again at its address.**

- The reader is not returned to the start: the opening line is above the
  screen.
- The paragraph at the top of the screen is the one immediately after **P**.
  The mark is inclusive — it names the last paragraph read *through* — so
  reading resumes at its successor, with nothing re-read and nothing skipped.
- Everything above that paragraph is dimmed and everything from it down is
  ink. The boundary between them is at the top of the screen.

**4. Without scrolling at all, end the session again and open the book again.**

The book opens at exactly the paragraph it opened at in step 3, and the
dimmed-to-ink boundary is at exactly the same paragraph. Repeating this any
number of times moves neither.

This is the point of the scenario. Restoring the position is itself a movement
of the page, and it leaves a screenful of unread text below the reader. If
that movement counted as reading, every reopening would advance the mark by a
screen, and the book would walk itself forward while nobody read it.
`spec/intent.md` says a `resume` scroll never advances progress and never
opens the intent window; step 4 is what that rule looks like to a person.

## What this does not cover

- **Any position change but a resume.** [`spec/intent.md`](../intent.md) names
  eight programmatic sources; this exercises one. A passage fragment in the
  address, an endnote hop and return, find-in-page, a reflow from rotation or
  a type-size change, and narration follow-scroll are all untested at the
  surface.
- **Backward movement.** "Read from here", "start over", and the two-press
  confirm before either. Every outcome above is monotonic.
- **Finishing.** The book is never read to the end, so a percent of 100, the
  cover that reopens clean, and `is-finished-read` go untested.
- **A second device or an account.** `merge-remote`, the plan-tip pull rule,
  and key folding are all out.
- **Reaching the book from anywhere but its address.** A list row, the title
  and byline recorded for it, and the percent it renders are untested. No area
  specifies a progress indicator yet, so this scenario asserts nothing about
  one.
- **Abnormal exits.** See the session boundary.
- **The device matrix.** Which viewports, orientations, and appearances this
  runs in is declared per platform, not here.

## What scenario two would extend

Extend this file's session boundary; do not invent a second one. Three
candidates, in the order they are worth the most:

1. **A reflow across the boundary** — rotate the device, or change the type
   size, between steps 2 and 3. The mark is an anchor, not an offset, so it
   must survive a re-measure, and the reflow is itself another programmatic
   source that must not count. It is the smallest step from here that tests a
   second row of `spec/intent.md`.
2. **A shared passage link** — open the book at a fragment deep in the text
   and prove the mark does not claim everything above it. This is the case the
   intent gate was built for, and the one a reader notices when it breaks.
3. **The way back in** — reach the book from a list row rather than by its
   address, which is what makes the recorded title, byline, and percent
   observable at all.

Each is a step and an outcome added to a session shaped like this one.
