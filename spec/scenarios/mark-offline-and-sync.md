# Scenario: mark offline and publish when saved

**The claim.** Marking belongs to the offline reader. A reader can highlight a
passage, add a note and date, extend the plan, and fork it again with no
network. The local plan survives relaunch and publishes automatically when the
device reconnects. Until then, it is visibly unsaved and copied passages carry
the tale's own URL in place of the unresolved mark URL — never no URL at all.

This scenario is the surface proof for [`spec/marks.md`](../marks.md). Read
[`README.md`](README.md) in this directory first: it says what an adapter may
translate and what it may not weaken.

**Required starting state:** all-red. The reference web product does not yet
retain a complete offline chain through failure and relaunch, and the native
client does not yet expose mark authoring. A client stays red until these steps
run through its shipped UI.

## Setup

- One device, signed out, with no plan for the fixture tale and no pending mark
  data from an earlier run.
- A tale already kept under [`kept-on-open.md`](kept-on-open.md), with two
  markable prose paragraphs far enough apart to distinguish them. Call the
  first **P** and the later one **Q**.
- A clean server fixture on which none of the IDs minted during this run
  exists.
- The device starts with the content service genuinely unreachable. Cached
  responses or a UI-only offline flag do not qualify.
- The platform's ordinary way to observe a copied address is available. The
  adapter may paste through the system's user-facing clipboard surface; it may
  not read a product-internal value and call that a copy.

## Connectivity and session boundaries

Going offline means requests from the launched product cannot reach the
content service. Reconnecting restores that route without relaunching or
pressing a product retry control. The automatic upload is part of the outcome.

"End the session" has the meaning established by
[`open-and-read.md`](open-and-read.md): destroy the user-facing product
context, then launch a fresh one against the same durable local data. Keeping a
component or process alive is not a relaunch.

## The plan's URL, and the tale's

Two addresses run through this scenario and they are not interchangeable. The
**tale's URL** is the book's own canonical reading address, true from the
moment the reader opens it. The **plan's URL** is that address carrying the
acknowledged tip. `planUrl`, `planUrlValue`, and `clipboardMarkUrl` are only
ever about the second: a copy carrying the tale's URL still observes
`planUrl: absent`, because the book's address is not the plan's. What
`clipboardUrl` observes is the one the copy actually ends with — `book` before
acknowledgement, the plan's URL after.

Where the plan's URL is read is the platform's to decide, and platforms differ
in kind here, not in detail. A client with a visible address bar states it as a
standing fact, and an adapter reads it there. A client with no address bar —
a native reader whose plan travels only inside a copied mark — makes no
standing statement, so its adapter copies a mark and reads the address out of
the payload. Both are the product's own answer. Neither may become a question
put to the plan store.

That difference carries a cost the scenario accepts rather than hides. An
adapter with no address surface spends a copy and a paste on every reading of
`planUrl`, and that probe overwrites the clipboard it reads. Such an adapter
may carry one live reading forward across the steps that merely restate it —
the offline steps, where a plan cannot have become an address — provided every
reading that decides its step is live: the first copy, the reconnection, and
the fresh-context open. It also means the clipboard is only observable at the
steps where a copy is the reader's own action, which is why steps 1 and 7 name
what it holds and the steps between them do not.

## Steps

**1. Open the kept tale while offline and activate P's marking gesture.**

P becomes marked immediately. Call this local version **A**. The authoring
surface quietly shows that the plan is unsaved. The clipboard contains P, its
attribution, and the tale's own canonical URL — not the unpublished tip, and
not nothing: a quotation with no way back to the book is the outcome this step
forbids. The product reports the successful passage copy normally; it does not
put an unpublished tip in the visible address bar, show a blocking network
error, or remove the mark.

**2. Give P a note and a due date while still offline.**

The note and date render with P. Because editing is immutable, the current
local version becomes **B**. It remains visibly unsaved and still exposes no
plan URL of its own.

**3. Activate Q's marking gesture while still offline.**

P keeps its note and date, Q becomes marked, and the current local version
becomes **C**. The action is immediate and remains visibly unsaved.

**4. End the session and relaunch while still offline.**

The tale opens from the kept content with both marks in reading order. P still
carries the same note and date. C is still the current local plan and still
looks unsaved. No network request is required to reconstruct it.

**5. Remove Q while still offline.**

Q disappears, P and its annotation remain, and immutability produces a fourth
local version, **D**. D contains only the annotated P and remains unsaved. A,
B, and C were never published or exposed as addresses, so the product need not
retain them as public plans merely because D superseded them locally.

**6. Restore the network and take no further marking action.**

The product uploads D's required chain automatically. The unsaved state clears
without changing D, its marks, note, date, or client-minted tip. D's canonical
plan URL becomes available through the platform's normal share or address
surface. An interrupted or ambiguously answered attempt may retry, but the
surface never duplicates a mark and never mints a replacement tip.

**7. Copy annotated P while online.**

The clipboard now contains the assignment or passage copy, its attribution,
and D's canonical plan URL. The same copy behavior that stood in the tale's own
URL offline names the plan itself now that D is saved. The copy carried a
working address in both conditions; only which address changed.

**8. End the session, remove the network again, and open D on the originating
device.**

D still resolves locally with annotated P and without Q. A successful upload
cleared its pending state, not the durable nodes the kept plan needs. The
reader does not need to download their own plan again merely because it has
become public.

**9. Restore the network. In a fresh product context with no local data, open
D.**

D resolves from the server with P, its note and due date, and without Q. The
same tip the client minted is the public tip. Opening it does not redirect to a
replacement, and the plan contains no duplicate node from a retry.

## What this does not cover

- **Clearing local data before sync.** Uninstalling an app or deliberately
  clearing all site data erases the only copy of a pending chain. The product
  must expose pending state before that boundary; no sync contract can recover
  bytes the reader deliberately erased.
- **Account progress sync.** The mark outbox anonymously publishes an
  ownerless plan value. Choosing which tip another device remembers requires a
  signed-in reader and belongs to [`spec/progress.md`](../progress.md), not
  this upload. This scenario stays signed out to prove those are different
  operations.
- **Two devices editing one plan.** They fork independent immutable tips.
  There is nothing to merge.
- **A recipient opening an unpublished tip.** The product does not expose that
  address. A value obtained by inspecting internal storage is not a supported
  share flow.
- **Copy typography and share-sheet furniture.** The copied value carries the
  passage, attribution, and one working address. Native presentation belongs to
  each platform.
- **The quiet rewrite on acknowledgement.** [`spec/marks.md`](../marks.md)
  requires a copy holding the tale's URL to be rewritten with the plan's URL
  once the tip it names is acknowledged, and only while the clipboard still
  holds that copy byte-for-byte. No step here observes it, because the only
  clipboard reading available between the two copies is the one an
  address-less adapter performs to read `planUrl` — and that reading writes the
  clipboard it would have to inspect.
- **The device matrix.** Declared per platform, not here.

## What the next scenario would extend

1. **An upload that dies mid-flight** — interrupt the first attempt after the
   server commits but before the client receives its acknowledgement, then
   prove the same tips publish once after retry. The idempotent boundary is
   normative in [`spec/marks.md`](../marks.md); this would add operational
   surface evidence if a platform exposes a meaningful state for it.
2. **Editing an already-public plan offline** — begin from an acknowledged tip,
   fork it locally, and prove the old URL remains public while the unpublished
   fork is withheld until acknowledgement.
3. **The clipboard nobody touched** — mark offline, reconnect, and read the
   clipboard once without copying anything first, proving the tale's URL became
   the plan's on its own. It needs a clipboard reading that is not also the
   only way to learn the plan's address; a platform that gains a standing
   address surface, or an adapter granted a non-destructive read, could carry
   it. Its twin is the case that must stay red: a reader who copies something
   else in the meantime keeps what they copied.
