# Scenario: a book keeps its doors

**The claim.** A book is readable on its own, but it is not a dead end. A
reader who enters through the book's canonical address can always leave for
the library. When Tale supplies an author address, the visible byline is a
link to that author's shelf inside the product.

Read [`README.md`](README.md) first. The executable plan beside this prose owns
the ordered actions and observations. Adapters open the book through its
ordinary public address, activate rendered or accessible controls, and observe
only the product surface.

## Setup

- One signed-out compact-width device with no restored navigation state.
- A reachable book at `/frankenstein-scenario`, titled `Frankenstein`, whose
  byline is `Mary Shelley` and whose producer-supplied author address is
  `/author/mary-shelley`.
- The author address serves a native shelf titled `Mary Shelley` with canonical
  identity `/author/mary-shelley`.

These names are test material, not prescribed production content.

## Portable controls

The way home may be a link, a native navigation button, or another ordinary
platform control. Its words and shape belong to the client; its availability
and destination do not.

The author is different: when the payload supplies an author address, the
byline itself is a link. A client follows the address as supplied and applies
its ordinary route semantics. It does not derive an author slug from the
displayed name or turn an unlinked byline into a guessed shelf.

## Steps

**1. Open the book's canonical address.**

The book opens directly. A way to the library is available, and `Mary Shelley`
is exposed as a link.

**2. Activate the author byline.**

The native author shelf opens with title `Mary Shelley` and canonical identity
`/author/mary-shelley`.

**3. Open the book's canonical address again.**

The directly opened book again exposes its way to the library.

**4. Activate the reader's way home.**

The reader closes and the library is visible at `/`.

## What this does not cover

- Back-stack restoration from the author shelf to the book.
- Author following, profiles, or account behavior.
- External or malformed author addresses. Existing URL routing remains the
  authority for whether an address belongs in the app.
- Byline parsing, translator links, or any author identity inferred by a
  client.

## What the next scenario would extend

A navigation-history scenario may require an author shelf to return to the
exact open book and reading position. It must preserve the producer-owned
author address and must not invent identity from display text.
