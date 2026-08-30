# Scenario: a plan opens on its tip

**The claim.** A plan address is a link to a *place*. Opening one puts the
reader on the plan's tip — its newest mark — whatever else that reader has
done in this book. A plan is shared by someone who read far enough to mark it,
so the reader most certain to have a saved position of their own is the reader
the link was made for; a plan address that yields to a saved position is a
plan address that works for everyone except the person who sent it.

Landing there is a placement, not a reading. The saved position does not move,
and the plain book address still resumes at it.

This scenario is a surface proof for [`spec/marks.md`](../marks.md) — the tip
is the address, so the tip is the landing — and it extends the session
boundary established by [`open-and-read.md`](open-and-read.md), which pins the
opposite half: an address carrying the book and nothing else resumes. Read
[`README.md`](README.md) in this directory first: it says what an adapter may
translate and what it may not weaken.

**Required starting state:** all-red. No shipped client opened a plan on its
tip when this was written. The reference web reader seeked only for a
single-mark plan, and only for a reader with no position in that book, so it
failed both steps below; the native client parses a tip and draws its marks but
performs no seek for a plan of more than one mark.

## Setup

- One device, signed out, with no plan for the fixture tale and no reading
  position in it.
- A prose tale long enough to hold two markable paragraphs far enough apart to
  distinguish them, with several screens of prose still ahead of the later one.
  Call the earlier one **P** and the later one **Q**.
- The content service is reachable throughout, so marks publish as they are
  made and the plan has an address to reopen.
- Ordinary reading conditions: default type size, no narration playing, no
  passage fragment in the address.

## The two addresses

This scenario turns on the difference between two routes to the same text, and
an adapter must keep them distinct:

- **The book's address** carries the book and nothing else — the route
  [`README.md`](README.md) permits an adapter to translate freely.
- **The plan's address** is the address the product itself offers for the plan
  the reader has just made: the one it puts in the address bar, or the one it
  copies. The adapter reopens *that*, unchanged. Reconstructing an address from
  a mark, or appending a passage fragment to the book's address, is a different
  act and proves nothing here.

"End the session" has the meaning established by
[`open-and-read.md`](open-and-read.md): destroy the user-facing product
context, then launch a fresh one against the same durable local data.

## The reader who authors is the reader who shares

The device that makes the plan is deliberately the device that reopens it. It
is the hard case and the real one: a plan comes from someone who read the book,
so their saved position and their plan's tip disagree by construction. A fresh
device with no local data is the easy case, and
[`mark-offline-and-sync.md`](mark-offline-and-sync.md) already proves a shared
tip *resolves* there.

## Steps

**1. Open the tale fresh.** It opens at its cover, at the start, with nothing
dimmed.

**2. Read down to P**, then **3. mark it.** P is marked and the plan has an
address.

**4. Read on to Q**, which is a different paragraph from P, then **5. mark it
too.** Both passages are marked, the plan holds two marks, and it still has an
address. Q is now the tip: it is the newest mark.

**6. Read several screens past both marks and stop.** Record the paragraph at
the top of the screen and the one after it.

**7. End the session and open the tale at the book's address.** It resumes at
the successor of where reading stopped, dimmed to that boundary. This is
[`open-and-read.md`](open-and-read.md)'s outcome, restated here so the two
addresses are compared under identical conditions rather than across
scenarios.

**8. End the session and open the tale at the plan's address.** The top of the
screen is Q — the tip — not the resumed position, and not P. Both marks are
still drawn. The dim boundary is unmoved: it still sits where reading stopped
in step 6, because arriving somewhere is not reading through everything above
it.

**9. End the session and open the tale at the book's address again.** It
resumes exactly where step 7 did. Step 8 placed the reader without moving the
mark: a plan can carry a reader backward or forward through a book they are
part-way through, as many times as they like, and leave their own position
untouched.

## What this does not cover

- **A passage fragment together with a plan address.** An explicit fragment is
  a more specific request than a plan and outranks it, and nothing here proves
  that ordering.
- **A back or forward navigation onto a plan address**, where the platform's
  own restored position is the better answer.
- **A tip whose anchor is absent from the rendered text** — a plan made against
  a text that has since changed under it. What a client should do there is a
  fallback rule this scenario does not state.
- **A one-mark plan**, which is the same rule with the tip and the only mark
  coinciding. Two marks are used precisely because they can disagree.
- **A fresh device opening a received plan address**, which is the case
  [`mark-offline-and-sync.md`](mark-offline-and-sync.md) covers for resolution
  and neither scenario covers for landing.
- **Dated marks and the pacing they drive.** The plan here is undated.

## What the next scenario would extend

1. **The rest of the ladder.** One session that opens the same book at a
   passage fragment, at a plan address, and at a plan address carrying a
   fragment, proving the order of precedence in one place rather than as three
   separate claims.
2. **A plan a reader received rather than made.** The same landing on a device
   that has read this book but never marked it — the student's side of the
   teacher's link, where the plan is someone else's and the position is
   genuinely their own.
3. **A tip that no longer resolves to a paragraph.** The fallback when a text
   has moved under a shared plan, which is the same anchor-stability question
   [`open-and-read.md`](open-and-read.md) raises for a saved position.
