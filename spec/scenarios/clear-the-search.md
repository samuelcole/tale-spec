# Scenario: the way back to the whole library

**The claim.** A search is easy to leave. Two ordinary controls return the
index to its unfiltered rows in one act: a clear control inside the search
input, and the `tale.fyi` mark at the top of the index. Neither makes the
reader delete a query a character at a time, and neither depends on a key a
phone does not have.

Read [`README.md`](README.md) first. The executable plan beside this prose owns
the ordered actions and observations. Adapters type through the product's real
text input, activate the rendered controls, and observe only the visible or
accessible surface.

## Setup

The same as [`library-search.md`](library-search.md): one signed-out device
with no incoming book address or restored navigation state, and a reachable
discovery fixture with at least three book rows, the `Sir Arthur Conan Doyle`
author row, and a target book whose byline is `Charlotte Brontë`. A client may
reuse that scenario's fixture unchanged.

## The controls

- **The clear control** stands at the end of the search input and is present
  only while the input holds text. Its accessible name is `clear search`. Its
  drawing — a small ×, in the index's own ink — is the client's; it is not a
  button with a border or a word.
- **The mark** is the `tale.fyi` name the index already shows above its
  introduction. It becomes something a reader can activate. On the web it is a
  link to `/`.

## Steps

**1. Open the library with the reachable fixture.**

The search input is available and empty, at least three ordinary book rows are
visible, and there is no clear control: there is nothing to clear.

**2. Type `doyle` into the input.**

Only the author result is visible, and the clear control has appeared.

**3. Activate the clear control.**

The input is empty, the ordinary library rows are back, and the clear control
is gone. The input still has focus — on a touch screen, the keyboard stays
up — because a reader who clears a search is usually about to type another.

**4. Type `bronte` into the input.**

Only the target book is visible, and the clear control is back.

**5. Activate the `tale.fyi` mark.**

The input is empty, the ordinary library rows are back, and the clear control
is gone.

## Portability

- Whether the input keeps focus after the mark is the platform's. A native
  client puts its keyboard away: the mark is a way home, not a way into the
  search. The web's index focuses its input on arrival and may keep doing so.
- The web's existing Escape-clears-the-input stays; this scenario neither
  requires nor forbids a keyboard shortcut.
- On the web the mark is a link to `/`, so it also works from a page that is
  not the index. That is the web's address contract, not a requirement here.

## What this does not cover

- The mark anywhere but the index — on a shelf, or inside a tale.
- Back navigation after the mark. On the web, activating a link pushes an
  ordinary history entry; where back then leads is the browser's.
- Persisting or restoring a cleared query; [`library-search.md`](library-search.md)
  owns restoring a search after a round trip into a book.
- Scroll position. The mark sits at the top of the index, so a reader who can
  see it is already there.
