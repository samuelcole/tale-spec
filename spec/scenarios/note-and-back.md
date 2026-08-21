# Scenario: a note and back

**The claim.** A book's endnotes are part of the book. The reference stands in
the prose where the author set it; activating it carries the reader to the
note; the note carries them back; and the whole trip leaves the reading mark
exactly where reading left it.

The pieces already have prose. The payload carries notes inside `sections`
([`spec/payload.md`](../payload.md), "Notes"), so a note is book content, not
chrome. Recognizing a note link is `is-same-document-fragment-link` in
[`spec/reader.md`](../reader.md), whose fragment-links section says why the
reading layer must be able to name a hop. And [`spec/intent.md`](../intent.md)
fixes what a hop does: activating the link is a `link-click`, which expires
the intent window, and the movement that follows — `endnote-hop` out, the
platform's fragment movement back — is programmatic and never reading. The
vector "endnote hop and return do not move the mark" proves that arithmetic;
this scenario proves the product.

Read [`README.md`](README.md) in this directory first: it says what an adapter
may translate and what it may not weaken.

## Setup

- One device, signed out, no account, and no recorded position for this book —
  exactly the baseline of [`open-and-read.md`](open-and-read.md).
- A book whose prose carries a note reference within its opening screens, and
  whose notes sit in an endnotes section at the back of the book, each note
  ending with a link back to its reference. The reference fixture is assembled
  from the curated `frankenstein` at the reference implementation's pinned
  content: the three chapters carrying its references, then its endnotes
  section, every section byte-identical to the stored book.
- Ordinary reading conditions: default type size, no narration playing, no
  plan marks open, no passage fragment in the address.

## Activating a link

Steps 2 and 3 activate a link in the book. That act is a genuine press on the
reference, or on the note's way back — a tap, a primary click, or the
platform's accessibility activation — arriving through the platform's real
input path. What it is not: setting the address's fragment, telling the page
to scroll, or invoking a navigation API. The movement that follows the press
belongs to the platform — a browser's own fragment seek, an app's own jump —
and that movement is programmatic under [`spec/intent.md`](../intent.md),
which is precisely the thing step 4 exists to observe. Faking the press
deletes the test.

The session boundary in step 4 is the one
[`open-and-read.md`](open-and-read.md) defines; this scenario adds nothing to
it.

## Steps

**1. Open the book at its address and read down the prose until the first
note reference is on screen.**

The scroll is a real reading gesture that carries the reader past the cover
and down into the prose. The reference renders inside its paragraph, where
the author set it — in the reference fixture, the numeral at the end of the
verse it annotates — part of the text, not a control beside it. Call the
paragraph at the top of the settled screen **P**.

**2. Activate the reference.**

The page leaves the prose and lands at the note: the note's text is on
screen — in the reference fixture, the note naming the poem the verse came
from — and with it the note's own way back. The paragraph the reader left is
gone from the screen; this was a hop across the book, not a nudge. The reader
does not scroll here.

**3. Activate the note's way back.**

The prose returns: the paragraph carrying the reference is on screen again,
the reference with it, and reading can continue where it stopped. The reader
still does not scroll.

**4. End the session, then open the book again at its address.**

The book opens exactly where [`open-and-read.md`](open-and-read.md) step 3
says a resumed book opens: at the paragraph after **P**, dimmed above it, ink
from it down. It does not open at the notes. The hop crossed nearly the whole
book and came back, and none of that movement was reading — a client that let
it advance the mark reopens at its endnotes with the book above them dimmed
as read, and that is the failure this scenario exists to catch.

## What this does not cover

- **Reading the notes themselves.** The reader here never scrolls at the
  note. What genuine reading gestures inside an endnotes section should do to
  the mark — whether notes even belong to the same paragraph universe as the
  prose, and what that means for percent — is product territory no spec area
  has claimed. Today both readers count note paragraphs like any others; a
  scenario that fixes that behavior has to decide it first.
- **A richer presentation.** These outcomes fix the shipped shape: a hop to
  the note as book content, in the book's own column. A product that wanted a
  popover or an inline expansion would need the spec to move first, and this
  scenario to move with it.
- **The reference's typography.** Size, raise, and color are presentation no
  area has fixed. Step 1 asserts the reference's presence inside its
  paragraph's text and nothing about its geometry.
- **Several notes, and notes met from the notes.** One reference, one note,
  one return. A second reference in the same session, or a reference
  activated while parked at the notes, adds nothing these outcomes don't
  already fix — until one of them breaks.
- **Offline.** Notes ride `sections`, so a kept book keeps its notes; proving
  this round trip with the network gone is the extension
  [`kept-on-open.md`](kept-on-open.md) already names.
- **A fragment in the address.** Same machinery, different origin. Arriving
  from outside the book is the shared-passage extension
  [`open-and-read.md`](open-and-read.md) names.
- **The device matrix.** Declared per platform, not here.

## What the next scenario would extend

1. **The note under the keep** — take this same round trip in a kept book
   with the network gone: one new setup line on top of
   [`kept-on-open.md`](kept-on-open.md)'s step 3.
2. **The shared passage link** — [`open-and-read.md`](open-and-read.md)'s
   second extension. After this scenario the fragment machinery has its
   surface test from inside the book; that one gives it the test from
   outside.
3. **Reading at the notes** — decide what the mark does when a reader
   genuinely reads the endnotes section, then say it here as a new step and
   outcome.
