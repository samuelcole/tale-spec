# Scenario: kept on open

**The claim.** Downloading is not a feature. A book you've started is a book
you keep: opening it is the trigger, and there is no button, no toggle, and no
saving indicator. When the network goes away, a kept book opens and reads
exactly as it would have online, at the place the reader left. A book never
started is not faked from fragments — it says what's wrong and offers a way
onward.

The kept copy is the payload in [`spec/payload.md`](../payload.md), and this
scenario is where that document's cache rule earns its wording. A keep is not
a second speculative cache in front of the HTTP validators: an online open
still revalidates through them, and the keep answers only when the network
cannot answer at all. The position that survives is the store in
[`spec/progress.md`](../progress.md), restored by the resume rules in
[`spec/reader.md`](../reader.md) — this scenario adds nothing to either; it
proves the *text* is as durable as the mark.
[`fetch-fails-honestly.md`](fetch-fails-honestly.md) fixed what an unreachable
book looks like and reserved this file's territory in its exit list: a saved
book must never be replaced by that error. This scenario is the other half of
that sentence.

Read [`README.md`](README.md) in this directory first: it says what an adapter
may translate and what it may not weaken.

## Setup

- One device, signed out, no account, no synced progress.
- A clean state for the books this scenario opens: no recorded position and no
  kept payload on this device.
- A book at a stable public address whose text runs well past the several
  screens the reader will scroll. The reference fixture is the curated
  `dracula` at the reference implementation's pinned commit.
- A second book at a stable public address that this device never opens while
  the network is up.
- The content service is reachable when the scenario begins.
- Ordinary reading conditions: default type size, no narration playing, no
  plan marks open, no passage fragment in the address.

## The session boundary

The boundary between step 2 and step 3 is the one
[`open-and-read.md`](open-and-read.md) defines — what it must destroy, what it
must preserve, what it may not carry — and this scenario does not invent a
second one. On iOS that is terminate and relaunch; on the web it is a fresh
page context navigating to the book's address, with a reload and a
back/forward navigation not permitted, for the reasons that file gives.

## Taking the network away

Steps 3 and 4 happen with the network gone, and "gone" needs a definition that
cannot be quietly weakened. From the moment the network is taken away, **no
request the product makes for this book's content can succeed** — every one
fails as unreachable, at or below the platform's transport.

- An iOS adapter may fail requests deterministically at the transport
  boundary, or use a genuinely disconnected device; either way the production
  loader runs and its requests fail.
- A web adapter makes the content service genuinely unreachable — the server
  is down, not merely slow.

Two tempting substitutes are **not** permitted, for the same reason: each
would let the scenario pass with the keep behavior removed entirely.

- **Flipping an offline flag** while requests would still succeed tests the
  product's belief about the network, not its behavior without one. A product
  that ignored the flag and fetched anyway would pass every step below with
  nothing kept.
- **Intercepting requests above a service worker** takes nothing away: the
  worker's own fetches ride below the interception and still reach the
  network. The page looks offline while the product quietly stays online.

## Steps

**1. Open the first book at its address and read into it.**

This is [`open-and-read.md`](open-and-read.md) steps 1 and 2, with the same
outcomes: the book opens at its cover, and a real reading gesture carries the
reader well into the prose. Call the paragraph at the top of the settled
screen **P**.

One outcome is this scenario's own: **nothing on screen says a keep
happened.** No button was pressed, no toggle exists, and no download indicator
appeared. If the adapter can find a control whose purpose is saving this book
for offline, that is a red result — the rule at the top of this file is
product behavior, not documentation.

**2. End the session, then take the network away.**

**3. Open the first book at its address again.**

- The book opens. Not an error page, not a spinner that never resolves, and
  not a cover with nothing under it.
- The reading surface is indistinguishable from an online open: the book does
  not open at its cover, the paragraph at the top of the screen is the one
  immediately after **P**, everything above it is dimmed, and everything from
  it down is ink — exactly the outcomes
  [`open-and-read.md`](open-and-read.md) step 3 fixes.
- Reading onward works. The same gesture that carried the reader into the
  prose in step 1 carries them further now, through text well past anything
  that was ever on screen while the network was up. A keep that kept only
  what had been looked at is not a keep, and this outcome is what catches it.

**4. Still offline, open the second book — never started on this device — at
its address.**

The attempt resolves to an honest state rather than waiting forever. No cover
or prose is shown as though fragments were a book. The reader says exactly:

> you're offline, and you haven't started this one.

and, so the rule of this scenario is taught where it is felt:

> a tale keeps itself once you've read a little of it.

Both sentences are exposed to the platform accessibility surface in the order
they appear. With them, the reader is offered a way onward, and the adapter
proves the way is real by taking it:

- A client with a surface that lists kept books offers the way to them, and
  taking it lands on that surface, which itself opens without the network.
- A client with no such surface yet offers the retry that
  [`fetch-fails-honestly.md`](fetch-fails-honestly.md) fixes, and with the
  network back, activating it opens the book.

Either way onward satisfies the scenario; a dead end does not.

## What this does not cover

- **Freshness.** Whether a kept copy is the newest version of the text, when
  an online open refreshes it through the validators, and what happens to a
  page a reader is looking at when newer text arrives — nothing here opens a
  kept book while the network is up.
- **Eviction and bounds.** How many books a device keeps, how much space they
  take, and whether a keep is ever discarded. This scenario keeps one book
  and never fills anything.
- **What rides along with the text.** Narration audio and its alignment are
  kept by playing, not by opening, and belong to the read-along scenarios.
  Endnotes belong to [`note-and-back.md`](note-and-back.md); taking its round
  trip offline is that scenario's named extension, not a step here.
- **The list of kept books.** Step 4's way onward may land on one, but what a
  library shows offline — which rows dim, what the dimming says — is not yet
  a portable surface.
- **A crash mid-keep.** The session boundary assumes an ordinary exit. That a
  half-written keep is detected and refused rather than rendered is an
  integrity claim a relaunch cannot observe directly; it is lane-1 unit
  evidence, not a step here.
- **A second device or an account.** Progress synced in from elsewhere, and
  the index rule that keeps a book you started on another device, involve a
  signed-in session this setup excludes.
- **The device matrix.** Which viewports, orientations, and appearances this
  runs in is declared per platform, not here.

## What the next scenario would extend

1. **Freshness across the keep** — end step 3 by restoring the network and
   opening the book again: the validators revalidate the kept copy, a newer
   version replaces it, and prose never changes under a reader mid-session.
   That last clause is the load-bearing one, and no scenario fixes it yet.
2. **The voice rides along** — play narration while online, then relaunch
   offline and press play: opening keeps the text, playing keeps the voice.
   That is the read-along store's scenario, shaped like this one.
3. **The keep answers a link** — a passage fragment into a kept book, opened
   offline, lands on the passage. Combines this file's step 3 with the
   shared-passage extension `open-and-read.md` already names.
