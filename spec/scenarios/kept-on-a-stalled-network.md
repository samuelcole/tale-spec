# Scenario: kept on a stalled network

**The claim.** A network that never answers is not allowed to hold a book
hostage. A kept book opens from the keep at once, at the reader's place, without
first waiting for the network to give up. A book that was never kept stops
waiting after a bounded time and says what is wrong, rather than spinning.

[`kept-on-open.md`](kept-on-open.md) proves the keep against a network that is
*gone*: every request fails at once, so a client that consults its keep only
after the network fails still passes. Real networks fail more slowly. With one
bar of signal, a subway that connects at each station and fades in the tunnel,
a satellite-only link, or a captive portal, a request is accepted and then never
answered, or answers partway and goes silent. Before
this scenario, a client that waited out its transport's own timeout (a minute
or more) before consulting its keep conformed. Its reader still saw an
endless spinner over a book that was already on their phone.

So this scenario, together with the amended cache rule in
[`spec/payload.md`](../payload.md), makes a kept book open first and refresh
second. An open with a kept copy reads the keep immediately and revalidates in
the background. Newer bytes are kept for the *next* open and never replace text
under a reader mid-session.

Read [`README.md`](README.md) in this directory first: it says what an adapter
may translate and what it may not weaken.

## Setup

The same as [`kept-on-open.md`](kept-on-open.md): one signed-out device; a
clean state for both books; a first book whose text runs well past several
screens (the reference fixture is the curated `dracula`); a second book this
device never opens while the network is up; the content service reachable when
the scenario begins; and ordinary reading conditions.

## The session boundary

The one [`open-and-read.md`](open-and-read.md) defines, unchanged.

## Stalling the network

From the moment the network stalls, **every request the product makes for
either book's content is accepted and never answered**: no response, no error,
and no closed connection for as long as the step observes. A request that fails
quickly is the other scenario's network, not this one's.

- An iOS adapter may hold requests open at the transport boundary: a protocol
  that receives the request and never calls back. The production loader runs,
  and nothing tells it the request is doomed.
- A web adapter stalls the content service itself, for example a server that
  accepts the connection and never writes a response, or does so beneath the
  service worker. The restriction in [`kept-on-open.md`](kept-on-open.md),
  "Taking the network away", applies for the same reason. Interception above
  the worker stalls nothing the worker sends.

An offline flag is not a stall. Neither is a delay that eventually answers.

## Timing

Each open below is timed from the moment the adapter's open action completes,
meaning the tap, the navigation, or the delivered link, to the first moment the
stated outcome is observable. Adapters report the elapsed seconds. The bounds
are product promises, not harness slack. An adapter whose own machinery cannot
observe within them reports that as a red result, not a pass.

- **A kept book: 3 seconds.** That is long enough for a cold launch's layout and
  far too short for any transport timeout to have fired first.
- **A book never kept: 12 seconds.** The product gives up after about 10
  seconds in which nothing arrives; the rest is margin for observing it. The
  deadline is on silence, not on the whole download. A large book still
  arriving, slowly, between two stations is not a stall and must not be
  abandoned for being slow.

## Steps

**1. Open the first book at its address and read into it.**

[`kept-on-open.md`](kept-on-open.md) step 1, with the same outcomes, including
that nothing on screen says a keep happened. Call the paragraph at the top of
the settled screen **P**.

**2. End the session, then stall the network.**

**3. Open the first book at its address again.**

- Within 3 seconds the book is open. No spinner is on screen at that moment,
  and there is no error.
- The reading surface is the one [`kept-on-open.md`](kept-on-open.md) step 3
  fixes. The book does not open at its cover, the paragraph at the top of the
  screen is the one immediately after **P**, everything above it is dimmed, and
  everything from it down is ink.

**4. Read onward, with the network still stalled.**

The same gesture carries the reader several screens further, through text that
was never on screen while the network was up. The stalled request the client may
still have in flight for this book changes nothing on the page.

**5. Still stalled, open the second book, never started on this device, at its
address.**

Within 12 seconds the attempt resolves to the honest state
[`kept-on-open.md`](kept-on-open.md) step 4 fixes. No spinner, cover, or prose
is shown, and the reader says exactly:

> you're offline, and you haven't started this one.

and

> a tale keeps itself once you've read a little of it.

in that order on the accessibility surface, with a way onward.

A stall cannot tell a dead network from a silent service. This sentence names
the case a reader is far more likely to be in, and it teaches the rule that
would have saved them. [`fetch-fails-honestly.md`](fetch-fails-honestly.md)'s
sentence stays the answer to a service that *refuses* or errors.

**6. Restore the network and take the way onward.**

As [`kept-on-open.md`](kept-on-open.md) step 4 describes. With a retry, the
retry makes a new request, and the book opens at its cover.

## What this does not cover

- **Freshness.** This scenario allows a kept copy to open while the network is
  up and requires that newer text never replaces a page under a reader. It does
  not prove that a newer version reaches the *next* open. That needs a fixture
  that publishes a second version, and it remains
  [`kept-on-open.md`](kept-on-open.md)'s first named extension.
- **The exact deadline, and a slow download.** About 10 seconds of silence is
  the product's choice; the scenario fixes only the 12-second bound a reader
  can observe on a total stall. That a book arriving slowly is not abandoned
  is required above but not exercised: it needs a fixture that trickles bytes.
- **Everything else that loads.** The library index, discovery rows, plans,
  and synced progress have their own requests and their own scenarios.
  Whether a stalled index holds a reader up is not fixed here. A stalled
  alignment or recording is
  [`voice-on-a-stalled-network.md`](voice-on-a-stalled-network.md).
- **Distinguishing a stall from being offline.** A client that can prove the
  device has no path may say so sooner. Nothing here requires waiting the full
  deadline.
- **The device matrix**, declared per platform.

## What the next scenario would extend

1. **The index on a stalled network.** The library opens from what it last
   knew, and its kept books open as step 3 does here.

The voice on a stalled network, this file's first named extension, is now
[`voice-on-a-stalled-network.md`](voice-on-a-stalled-network.md).
