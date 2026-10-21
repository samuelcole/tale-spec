# Scenario: a new edition keeps your place

**The claim.** A book can change under a reader without moving them. Tale
re-imports books to fix them: a recovered verse, a removed title page, a
corrected typo. Every new edition inserts or edits paragraphs, and every reader
of that book holds anchors into it: a saved position and a plan's marks. Their
place stays where they left it:

- They reopen the book and land where they stopped, even when paragraphs were
  inserted before that point.
- A plan made on the old edition opens on its tip, with its marks on the
  passages they marked.
- A mark on a passage the new edition edited lands at that passage's place.

The scenario walks the book through the two kinds of new edition a reader can
meet:

- **The migration**, the edition that moves a book from positional ids to
  stable anchors. The reader's old ids reach it only through the book's legacy
  alias table.
- **A later edition** of a book already on stable anchors. Anchors of unchanged
  passages match exactly, and an edited passage is found by its place.

This is the surface proof for [`spec/anchors.md`](../anchors.md). It extends
[`plan-opens-on-its-tip.md`](plan-opens-on-its-tip.md) and
[`open-and-read.md`](open-and-read.md), whose landing and resume rules it
reuses unchanged. Read [`README.md`](README.md) in this directory first.

**Required starting state:** all-red. When this was written, every client
matched anchors as whole strings. A book whose paragraphs were renumbered sent
positions and marks to the wrong paragraph, or to none.

## Setup

- One device, signed out, with no plan and no reading position for the fixture
  tale.
- A prose tale served in three editions, in this order. The adapter decides
  how to publish each edition; it publishes each one only where this scenario
  says, and the client learns of it the way it learns of any new edition.
  1. **Edition 1** has positional ids (`{section}-p{n}`), as books did before
     stable anchors. It holds three markable paragraphs far enough apart to
     tell apart, **P**, **Q** and **R**, in that order, with several screens of
     prose after each.
  2. **Edition 2** is the migration. It carries stable anchors and the legacy
     alias table for every edition-1 id. A paragraph is inserted before P in
     P's section, so every positional id after it would have shifted. P, Q and
     R are textually unchanged.
  3. **Edition 3** inserts a paragraph between Q and R, and edits R's text.
- The content service is reachable throughout.
- Ordinary reading conditions: default type size, no narration playing, no
  passage fragment in the address.

## How a passage is named

Observations name a passage by what it is in the fixture (P, Q, R, or the
adapter's label for any other paragraph), never by its id. A passage keeps its
name across editions: an inserted paragraph is a new passage, and R is still R
after edition 3 edits it. "The same paragraph" is exact, as
[`README.md`](README.md) requires. Landing next to it is a failure.

"End the session" has the meaning established by
[`open-and-read.md`](open-and-read.md). "The plan's address" is the one the
product itself offers, reopened unchanged, as in
[`plan-opens-on-its-tip.md`](plan-opens-on-its-tip.md).

## Steps and outcomes

1. **Open edition 1 fresh.** The cover is on screen.
2. **Read to Q and mark it.** The plan holds Q and has an address.
3. **Read on several screens and stop.** Capture where reading stopped and the
   paragraph after it.
4. **End the session, publish edition 2, and open the book.** The reader lands
   on the paragraph after where they stopped, with the dim boundary at the
   stopping point. The inserted paragraph moved every positional id after it,
   so this outcome holds only through the alias table.
5. **End the session and open the plan's address.** It opens on Q, with Q
   marked. The mark's edition-1 anchor reached Q through its alias.
6. **Read to R and mark it.** The plan holds Q and R. R's mark is made on a
   stable anchor.
7. **Read on several screens and stop.** Capture the new stopping point and its
   successor.
8. **End the session, publish edition 3, and open the plan's address.** It
   opens on R, the edited passage, with Q and R both marked. R's mark names
   text edition 3 no longer has, so it lands by its place.
9. **End the session and open the book.** The reader resumes after the second
   stopping point, with the dim boundary there. The paragraph inserted before R
   did not move it.

None of these landings is a reading. Steps 5 and 8 are placements, as
[`marks.md`](../marks.md) already requires.

## What this does not cover

- **Passage fragments in shared links.** Resolving `#…` in an address follows
  the same rule ([`addresses.md`](../addresses.md)), and its operation is
  pinned by `resolve-anchor` in [`vectors/anchors.json`](../../vectors/anchors.json).
  A link-handoff extension would prove it at the surface.
- **A deleted passage that holds a mark.** Placement lands it on the passage
  before its place. The vectors pin this; a surface step would need an edition
  that deletes a marked passage.
- **Narration across editions.** An alignment always names its own edition
  exactly ([`timeline.md`](../timeline.md)), so it has nothing to resolve.
  A press of play on a kept older edition brings the new one, by
  [`the-voice-brings-the-new-edition.md`](the-voice-brings-the-new-edition.md).
- **Kept books on a device that has not seen the new edition.** The keep rules
  ([`kept-on-open.md`](kept-on-open.md)) decide which edition is read. This
  scenario reads whichever edition is current.
