# Scenario: the last page opens outward

**The claim.** A finished book is not a dead end. Before its provenance and
way home, a bare curated book offers the same quiet doors as the reference web
reader: what to read next, its genres, the lists it appears in, and its
publication era. Every door follows a producer-supplied canonical address.

Read [`README.md`](README.md) first. The executable plan beside this prose owns
the ordered actions and observations. Adapters reach the end through ordinary
reader input, activate rendered or accessible links, and observe only the
product surface.

## Setup

- One signed-out compact-width reader with no recorded position.
- A stable, short curated book at `/finish-and-leave-scenario`, titled
  `A Narrow Measure`, by `Scenario Author`, first published in 1897.
- Its payload supplies a `More by Scenario Author` recommendation for
  `A Wider Measure` at `/a-wider-measure-scenario`, a `Gothic` genre door at
  `/genre/gothic`, a `Small wonders` list door at `/~small-wonders`, and an
  `1897` era door at `/eras/1897`.
- Each browse address serves a native shelf whose title and canonical identity
  match that supplied door.

These names are fixture material, not prescribed production content.

## Portable surface

The discovery surface follows the final passage and precedes or joins the
colophon according to the client's native layout. Headings, rows, and spacing
belong to the client; the supplied labels, link roles, and destinations do not.

The producer owns the entire projection. A client does not invent a
recommendation, turn prose metadata into a route, derive a genre or author
slug, or assume that a displayed year is a valid shelf. Missing discovery data
stays quietly absent.

## Steps

**1. Read through the final passage.**

The finished-book surface shows `More by Scenario Author`, with
`A Wider Measure`, `Gothic`, `Small wonders`, and `1897` exposed as links.

**2. Activate `A Wider Measure`.**

That canonical book opens at `/a-wider-measure-scenario`.

**3. Reopen the source book and read through its final passage.**

The source book is again visible at `/finish-and-leave-scenario`, with its
finished-book discovery present.

**4. Activate `Gothic`.**

The native genre shelf opens with title `Gothic` and canonical identity
`/genre/gothic`.

**5. Reopen the source book and read through its final passage.**

Its finished-book discovery is present again.

**6. Activate `Small wonders`.**

The native list shelf opens with title `Small wonders` and canonical identity
`/~small-wonders`.

**7. Reopen the source book and read through its final passage.**

Its finished-book discovery is present again.

**8. Activate `1897`.**

The native era shelf opens with title `1897` and canonical identity
`/eras/1897`.

## Required starting result

This characterizes existing reference behavior. The web adapter is green
against the rendered footer. Before native implementation, the Apple adapter
is intentionally red because the launched reader reaches its colophon without
recommendations, genre or list doors, or a linked era.

## What this does not cover

- Recommendation ranking, personalization, analytics, or author following.
- Discovery after a plan read or a published user tale.
- Offline shelf caching or whether a destination can load without a network.
- Restoring the exact source-book position after leaving for a shelf.
- Visual card fidelity. The links stay in the product's quiet reading voice;
  platform presentation belongs to each client.

