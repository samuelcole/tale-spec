# Scenario: your place follows you

**The claim.** Identity adds sync and never unlocks text. A signed-out reader
gets a whole book and a durable local place. Signing in makes that place
follow the reader: a fresh device shows nothing of theirs until they sign in,
and shows their place the moment they do. The merge only ever carries a reader
forward — except that an explicitly chosen earlier place is a decision, not a
position to be corrected, and it follows the reader too. Signing out ends the
following and touches nothing local.

This scenario is the surface proof for the sync half of
[`spec/progress.md`](../progress.md) — `merge-remote`, the forward-only
comparison, and the rewind exception — driven the way a person drives it.
Read [`README.md`](README.md) in this directory first: it says what an
adapter may translate and what it may not weaken.

**Required starting state:** web-green, native-red. The reference web product
ships pull, push, rewind, and sign-out; a native client stays red until the
same session story runs through its shipped UI. If any step proves red on
web, that is a finding about the web product, recorded with the adapter — not
a reason to soften the step.

## Setup

- A book fixture with three prose paragraphs in reading order, far enough
  apart that each occupies its own screen at the fixture viewport. Call them
  **P**, **Q**, and **R**.
- An account fixture: one email address whose sign-in code the launched
  product can genuinely request and redeem inside the test environment. The
  delivery mechanism is the environment's (a development handoff route, a
  stubbed sender); the *entry* of the address and code goes through the
  product's shipped sign-in surface.
- A progress service the launched product syncs with, holding no record for
  the account at the start of the run.
- The run begins signed out, with no local reading data.

## Identity, contexts, and connectivity

**Signing in** means the reader enters their email address and the code it
receives, through the product's own sign-in surface. The route to that
surface is the adapter's — a settings door, an index footer, a quiet offer —
but it is the shipped surface, and reaching it never interrupts or gates
reading. **Signing out** likewise goes through the shipped surface.

**A fresh product context** has the meaning established by
[`mark-offline-and-sync.md`](mark-offline-and-sync.md): the same launched
product with no local data from earlier in the run. It stands in for the
reader's other device — the laptop when the run began on the phone. A step
that opens one abandons the previous context's local data; the account and
the progress service persist across all of them.

**Session boundaries** follow [`open-and-read.md`](open-and-read.md):
destroy the user-facing product context, then launch a fresh one against the
same durable local data.

**Connectivity** follows [`mark-offline-and-sync.md`](mark-offline-and-sync.md):
offline means requests from the launched product cannot reach the service;
reconnecting restores the route without a product retry control.

A push may ride a session boundary: the product owes the server its current
place by the time the session has ended, not at any particular moment during
it. Every cross-device outcome below is therefore observed after a session
boundary, and none of them names a request.

## Steps

**1. Read signed out.**

Open the book in a clean context and read to P. The whole text is present,
nothing asks for an account, and no blocking prompt interrupts. This is
[`open-and-read.md`](open-and-read.md)'s ground; the step establishes P and
the signed-out baseline.

**2. Sign in at the place.**

Sign in as the fixture account, then return to the book. The place is exactly
where it was: the saved mark still sits at P, the reader resumes immediately
after it. Signing in moves data, never the reader.

**3. A fresh context, signed out, shows nothing.**

Open the book in a fresh product context, still signed out. It opens at the
start, with no saved mark and no trace of the first context's reading. The
place exists on the server by now; without identity it is nobody's.

**4. Sign in, and the place arrives.**

In that same fresh context, sign in as the account and open the book. It
opens at the place: the saved mark at P, reading resuming immediately after
it. This is `merge-remote` adopting the server copy into an empty store,
observed as a reader sees it.

**5. Read ahead on the new device.**

Read forward to Q. The mark advances to Q locally; the first context's older
place must never pull this one back (the forward-only comparison, proved by
the steps that follow).

**6. An explicit rewind follows the reader too.**

Read back to P and choose it with the confirmed read-from-here act of
[`choose-a-new-place.md`](choose-a-new-place.md). The saved mark now sits
immediately before P. End the session and reopen: still immediately before
P — the server's higher copy does not resurrect Q, because an explicit
rewind is a decision the merge must honor. Then open a fresh product context
and sign in: the rewound place followed. The reader who deliberately went
back is at the earlier place on every device, not silently "corrected"
forward.

**7. Offline reading reconciles by itself.**

In the current context, go offline and read forward to R. Restore the
network, take no further reading action, and end the session. Open a fresh
product context, sign in: the place is R. Progress made offline is not
second-class; it arrives without a button.

**8. Signing out keeps the local place.**

Sign out through the shipped surface. The book still opens at R, and it
still opens at R after a session boundary. Sign-out severs the following,
not the reading: the local store remains whole, exactly as a signed-out
reader's always is.

## What this scenario does not cover

- **When the product offers sign-in.** The web reference keeps its offer on
  the index; a native client may offer it quietly after real progress
  exists. That timing is client chrome, asserted in the client's own gates —
  what is portable, and asserted here, is that reading is never interrupted
  or gated by identity.
- **The tip pull rule and list rows.** How a plan tip follows a reader, and
  what a synced place looks like in a library list, extend
  [`library-open.md`](library-open.md) and the tip rules in
  [`spec/progress.md`](../progress.md); a later scenario owns them.
- **Preferences following the account.** Same shape, different store;
  deliberately out.
- **Two devices racing.** Every cross-device observation here is
  sequential. Concurrent writers are specified by the merge vectors, not by
  this surface.
- **Account linking across addresses**, deferred by the identity contract
  (TAL-182) until authoring reaches native.

## Harness notes

What the first two adapters — web Playwright and iOS XCUITest — had to
interpret, settled here so the next client doesn't re-decide it.

- **Where identity is observed.** `signedIn` is read wherever the shipped
  product states it: the sentence the web index says it in, a native
  client's identity door. Visiting that surface mid-step is route
  translation, not weakening — but the surface must be the product's own,
  and a client that states identity nowhere reachable cannot run this
  scenario. A native identity surface should publish its state through the
  platform's accessibility layer for exactly this reason.
- **The saved mark's live rendering.** `savedFillBlock` is read off the
  client's live statement of the saved mark — on web, the progress bar's
  fill, inverted to a paragraph. Arrival dimming does not work for it:
  dimming is an arrival phenomenon and never moves mid-session, while steps
  5, 6 and 10 observe a mark that moved *this* session. A client with no
  live rendering of the mark cannot observe those steps.
- **The code's delivery.** The account fixture's mailbox is the
  environment's, never a real inbox: the web dev handoff route, a test
  run's own database read where Better Auth wrote the code, a native
  network fixture that redeems the code it minted. *Entering* the address
  and code through the shipped sign-in surface is the conformance part;
  how the environment hands the code to the adapter is not, and no mail
  may leave.
- **A fresh product context, off the web.** The portable meaning is: the
  client's own durable store is gone, the environment's account and
  progress service persist. On a platform with one app container per
  install, that requires the progress-service fixture to live apart from
  the client's own storage root — a constraint on the fixture design, and
  the reason the web adapter's disposable database and an iOS
  `URLProtocol`-backed service store are both faithful translations.
- **How long the reader stays offline.** Unbounded, and the adapter must
  not quietly keep the stay inside a client's push cadence: after the
  offline reading, linger past any debounce the client is known to have
  before restoring the network, so that "arrives without a button" is
  proved against a push that already failed, not one that never fired.
- **Reconnecting is an environment act.** The cue a client may use for
  "the route is back" is the platform's own reachability signal (a browser
  `online` event, a path monitor), or its next naturally scheduled
  request succeeding. An adapter must not require the product to poll, and
  a fixture that couples "the network returned" to "the product retried"
  proves nothing about the retry.
- **Four devices are four clients.** The run signs in from several fresh
  contexts in quick succession; a product's per-client rate limiting is
  real and out of scope. Each context should present as its own client
  (its own forwarded address, its own fixture identity), because that is
  what distinct devices are.
- **P, Q and R are spaced jointly.** The rewind puts the reader back at P,
  so the offline read to R starts from P and passes Q; R must land well
  clear of Q or "Q" and "immediately after R" collapse into neighbours.
