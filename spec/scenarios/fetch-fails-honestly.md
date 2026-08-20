# Scenario: fetch fails honestly

**The claim.** When a reading client cannot reach a book it has never kept, it
says what failed in Tale's voice and gives the reader a retry that really
retries. It does not leave them looking at an endless spinner or an empty page.

This scenario applies to clients that obtain the book from the content API in
[`spec/payload.md`](../payload.md). The web reader produces that payload and
server-renders its own page; it does not fetch its own API, and changing that
architecture solely to manufacture a web pass would not be conformance. The
web prerequisite is the payload contract proved through its real HTTP route.

Read [`README.md`](README.md) in this directory first: it says what an adapter
may translate and what it may not weaken.

## Setup

- One device, signed out, with no recorded position or kept payload for this
  book.
- A book at a stable public address. The reference fixture is the curated
  `dracula` at the reference implementation's pinned commit.
- The content service is unreachable when the reader opens the address. The
  adapter may fail the request deterministically at the platform transport
  boundary; it may not substitute a test-only screen or bypass the production
  loader.

## Steps

**1. Open the book at its address.**

The attempt resolves to an error state rather than waiting forever. No cover or
prose is shown as though an empty response were a book. The reader says exactly:

> tale.fyi didn’t answer.

It offers a control labeled **try again**. The sentence and control are exposed
to the platform accessibility surface in the same reading order in which they
appear.

**2. Make the content service reachable, then activate try again.**

The client makes a new request through its production loader. The error leaves
the screen and the book opens at its cover, with its title visible and no text
dimmed. The retry must not require leaving and reopening the app, and it must
not reuse the failed result.

## What this does not cover

- A book already kept on the device. Offline fallback belongs to the
  kept-on-open scenario; a saved book must not be replaced by this error.
- A missing tale (`404`), an unsupported payload version or unsafe content, a
  malformed response, or a server error. Typed failures may give those states
  different words, but this scenario fixes only an unreachable transport.
- How long a loading state waits before the transport fails, or what progress
  indicator it uses while a request is genuinely in flight.
- Automatic retry, backoff, background refresh, catalog loading, sync, audio,
  or any cache above the HTTP validators in [`spec/payload.md`](../payload.md).
- The device matrix. Each consuming platform declares the viewports,
  orientations, appearances, and accessibility modes it runs.
