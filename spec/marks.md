# Marks: immutable plans, authored offline

A plan is an immutable chain of annotation marks addressed by its tip. A mark
names one of the tale's baked-in anchors and may carry a note, a due date, or
both. A bare mark is a highlight; several marks are a reading plan. None of
these forms requires an account.

This document fixes when a client-created mark becomes usable and how a chain
made without a network reaches the shared server. It does not define a second
kind of plan for native clients. The same IDs, parent links, URLs, and
immutability apply everywhere.

## A mark starts locally

The client mints every new node's opaque ID before persistence. The node also
carries its tale, anchor, optional note and due date, and the ID of its parent
tip. A root has no parent.

An ID is exactly eight cryptographically random bytes encoded as unpadded
base64url: eleven case-sensitive `A-Z`, `a-z`, `0-9`, `_`, or `-` characters.
Clients do not translate, lowercase, or replace one after minting. The anchor
is one the tale payload supplied; offline input passes the same bounds and
validation as online input before it enters the local chain.

Minting is enough for the originating client to use the mark immediately. It
must, with no network:

- draw the mark and its note or date;
- keep the unpublished chain as the reader's current local plan;
- append another mark to the local tip;
- edit or remove a mark by rebuilding into another immutable local chain; and
- resolve every locally held tip after a normal relaunch.

The local chain is production data, not optimistic decoration. A failed
request may not roll it back, and a client may not require a round trip before
showing it.

## An unpublished mark is not yet shareable

An unpublished tip is real local data but not yet a public address. The client
must not put its canonical plan URL in copied content or the visible address
bar until the persistence boundary acknowledges every node the tip needs.

What it withholds is that one address, not the link. **A copied passage always
carries a URL that resolves.** A quotation pasted into a message with no way
back to the book is the failure this contract exists to prevent, and being
offline is not an excuse for it: the tale's own canonical reading URL is true
before any network answers, so that is what the copy carries until the tip
becomes an address of its own.

One copy therefore has two possible addresses and one fixed lifecycle:

1. **The tale's URL, written with the copy.** Not a placeholder the reader
   waits through — the passage, its attribution, and a working link are on the
   clipboard by the time the copy is reported, whatever the network is doing.
2. **The plan's URL, written over it on acknowledgement.** When the boundary
   acknowledges the tip that copy names, the client quietly rewrites the same
   copy with the plan's canonical URL. There is no second report and no second
   announcement; the reader was told they copied, once, and that is still true.
3. **The tale's URL, if acknowledgement never comes.** Nothing is retracted and
   nothing fails. The reader keeps a link to the book they quoted.

The rewrite belongs to that copy alone. A client performs it only while the
clipboard still holds byte-for-byte what that copy wrote: a reader who has
copied something else since owns their clipboard, and a quiet upgrade that
overwrites their work is worse than no upgrade at all. Where a platform cannot
read its clipboard back without asking the reader for permission, it does not
ask — it remembers what it wrote and declines the rewrite whenever it cannot
be sure.

The authoring surface must quietly but persistently distinguish unpublished
local changes from a saved plan. "Unsaved" or an equivalent platform treatment
is enough; a blocking network error is not. Connectivity decides which of the
two URLs a copy carries; it never removes the URL and never disables copying.

The client-minted ID that is eventually acknowledged becomes the public tip;
the server does not replace it with a server-minted ID. If a tip has already
been acknowledged and exposed, later edits always fork it and can never change
or retract it. Intermediate local versions that were never acknowledged or
exposed carry no public-address promise and may be superseded by the reader's
newer local chain.

## The local store and durable outbox

The client durably stores the immutable nodes needed to resolve its locally
held tips, whether those nodes are pending or acknowledged. Server
acknowledgement clears a node's pending/outbox state; it does not erase the
local node and make an already kept plan network-dependent. A client may prune
unreferenced acknowledged nodes under its ordinary storage policy, but never a
node still required by a local tip or pending descendant.

Every node in the current unpublished chain, plus every submitted node whose
answer was ambiguous, lives in a durable local outbox. It survives ordinary
relaunch, process termination, app update, and a failed or ambiguous upload.
The outbox is ordered by parent dependency, not by wall-clock time: a child is
never offered without either its parent in the same upload or an acknowledged
parent already on the server.

When connectivity returns, the client uploads automatically. Launch,
foregrounding, and a connectivity transition may all trigger the same
best-effort attempt. They do not create different synchronization semantics.
Reading, marking, copying, and editing never wait for an attempt to finish. An
offline copy carries the tale's URL in place of the unresolved plan URL; an
acknowledgement replaces it, in that copy, without a second gesture.

The client removes nodes from the outbox only after the persistence boundary
acknowledges their IDs. A timeout, lost response, interruption, or process exit
leaves them queued and retries the same IDs and contents later.

Clearing all site data or uninstalling the app destroys the only copy of a
never-synced chain. No product can survive deliberate erasure of its local
store. The visible pending state is what keeps that boundary honest; ordinary
lifecycle events, successful sync, and later offline reading are not allowed
to behave like erasure.

## Idempotent persistence

The server accepts a dependency-ordered batch of immutable nodes. Persistence
is atomic for the offered batch and idempotent by node ID:

- a missing ID with a valid parent and anchor is inserted;
- an existing ID with byte-for-byte equivalent immutable fields is already
  acknowledged and succeeds without a second row;
- an existing ID with different immutable fields rejects the batch; and
- an invalid, cross-tale, missing-parent, over-limit, or malformed node rejects
  the batch without partially publishing its descendants.

This is what makes an ambiguous response safe: retrying cannot duplicate a
mark or fork it into a new address. Random IDs make a conflicting reuse
vanishingly unlikely, but the boundary still fails closed rather than treating
"unlikely" as permission to mutate an immutable value.

An upload may contain several dependent nodes or several local chains.
Structural sharing means common ancestors are sent once. The acknowledgement
names the accepted IDs; it does not choose a winning tip for the reader.

## There is no conflict merge

Plans do not converge into one mutable document. Two devices that add marks
from the same acknowledged parent create two valid tips, exactly as two online
readers do. Once published, both remain addressable. Sync publishes immutable
nodes; it never combines, orders, or overwrites the resulting plans.

The reader's most recent tip is separate local/progress-sync state defined in
[`progress.md`](progress.md). Publishing a chain does not silently replace that
choice, and receiving another device's tip does not rewrite any mark.

## Publication and personal sync are different

Publishing immutable mark rows does not require an account. It is the same
anonymous write that makes an online mark URL resolve today: the URL is the
capability and the plan has no owner. A signed-out client can therefore publish
its outbox when connectivity returns and can copy the resulting public plan.

Remembering "this is my current tip" on another device is separate personal
progress state. It may sync only for a signed-in reader under
[`progress.md`](progress.md). A signed-out reader's newly published URL works
for anyone who receives it, but Tale does not discover or restore that tip on
the reader's other devices.

Ownership, edit tokens, last-write-wins plan contents, background conflict
resolution, and a general-purpose operation log are outside this contract. The
narrow mechanism is a durable outbox for immutable rows.

## The tip is the address, so the tip is the landing

A plan address names a place in a tale, and opening one puts the reader at that
place: the tip's anchor — the newest mark, the one the address is named for.
This holds however many marks the chain carries, and it holds for a reader who
already has a position in that tale. Their position is not consulted, because a
plan is shared by someone who read far enough to mark it: yielding to a saved
position makes the address work for every reader except the one who sent it.

The placement is not a reading. It moves no mark and advances no progress —
[`progress.md`](progress.md)'s rule that only genuine input advances a position
governs here exactly as it governs a passage fragment. The tale's own address,
carrying no tip, still resumes where the reader left off.

Which ask wins when a reader is given more than one is a client concern rather
than this contract's: an explicit passage fragment is more specific than a plan
address and outranks it, and a back or forward navigation leaves the platform's
own restored position alone.

## Surface proof

[`scenarios/mark-offline-and-sync.md`](scenarios/mark-offline-and-sync.md)
proves the contract through the real product: a plan is authored offline,
survives relaunch, publishes without a second marking gesture, and moves a copy
from the tale's URL to its own resolvable mark URL after acknowledgement.

That scenario pins both ends of the lifecycle — the tale's URL in the offline
copy, the plan's URL in a copy made after acknowledgement — at the two steps a
copy is the reader's own action. The quiet rewrite *between* them, on a
clipboard nobody touched, has no portable observation point yet: the adapters
that have no standing address surface must copy a mark to read the plan's
address at all, and that probe writes the very clipboard the rewrite would be
observed on. It is normative here and named under "what the next scenario would
extend" there.

[`scenarios/plan-opens-on-its-tip.md`](scenarios/plan-opens-on-its-tip.md)
proves ["The tip is the address, so the tip is the landing"](#the-tip-is-the-address-so-the-tip-is-the-landing):
the device that made a two-mark plan reopens it at
its address and lands on the tip rather than on its own reading position, and
the plain book address still resumes at that position afterwards.
