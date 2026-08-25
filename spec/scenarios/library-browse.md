# Scenario: discovery opens a native shelf

**The claim.** A discovery result is part of the library, not a doorway out of
the app. Lists, genres, eras, and authors open the same shelf from search or
from their canonical tale.fyi address. A book opens from that shelf, and
ordinary back navigation restores each level of the reader's path.

Read [`README.md`](README.md) first. The executable plan beside this prose owns
the ordered actions and observations. Adapters activate rendered discovery and
book rows, use the platform's ordinary back navigation, and observe only the
visible or accessible surface.

## Portable browse payload

Tale is the sole producer of one versioned browse payload used by the web
browse surface and native clients. The payload names:

- its browse kind: `list`, `genre`, `era`, or `author`;
- the canonical identity path and slug;
- the displayed shelf title and total book count; and
- an ordered roster of books, each with its canonical book path, displayed
  title and byline, and the ordinary library facets needed to render its row.

All four kinds use that one shape. Clients do not derive author identities,
parse eras, expand genre headings, resolve list membership, repair routes, or
combine discovery-index rows into a shelf. A payload whose kind, identity,
count, or roster is absent or malformed is unavailable.

The total count equals the roster length in this slice. A future paginated
contract must change that rule explicitly rather than quietly returning a
partial shelf.

## Setup

- One signed-out device with no restored navigation state.
- Reachable, stable discovery indexes containing one list, genre, era, and
  author result.
- The canonical paths are `/~gothic-monsters`, `/genre/gothic`,
  `/eras/19th-century`, and `/author/mary-shelley`.
- Each address serves the same portable two-book payload shape. Its first book
  is `Frankenstein` by `Mary Shelley`, has a read-along, and has canonical path
  `/frankenstein-scenario`.
- The fixture can also return one unavailable canonical shelf and one
  malformed browse document without affecting the ordinary catalog.

These names are test material, not prescribed production content.

## Steps

**1. Open the library and search for `gothic monsters`.**

Only the fixture's list discovery result is visible, and the text input retains
that query.

**2. Activate the list result.**

The native list shelf opens. It displays `Gothic monsters`, `2 books`, its two
payload books in payload order, and the first book's title, byline, and audio
affordance. Its canonical identity is `/~gothic-monsters`.

**3. Activate the first book, then use ordinary back navigation.**

The canonical book route opens in the reader. Back returns to the same list
shelf with the same title, count, and roster.

**4. Use ordinary back navigation again.**

The library returns with `gothic monsters` still in the input and the same one
discovery result visible.

**5. Replace the query with `gothic`, activate its result, then go
back.**

The native genre shelf has canonical identity `/genre/gothic`, title `Gothic`,
and the payload's two-book roster. Back restores the genre
query and its two matching discovery results: `Gothic monsters` and `Gothic`.

**6. Replace the query with `19th century`, activate its result, then go
back.**

The native era shelf has canonical identity `/eras/19th-century`, title `19th
century`, and the payload's two-book roster. Back restores the era query and
result.

**7. Replace the query with `shelley`, activate its result, then go back.**

The native author shelf has canonical identity `/author/mary-shelley`, title
`Mary Shelley`, and the
payload's two-book roster. Back restores the author query and result.

**8. Open each of the four canonical tale.fyi browse addresses.**

Each address opens the same native shelf identity, title, count, and roster as
its discovery result. It does not open a browser or web view.

**9. Open an unavailable canonical shelf and a canonical shelf whose payload
is malformed.**

Both remain in the native library surface and state plainly that the shelf is
unavailable. A working retry is present. Neither failure opens the web.

## What this does not cover

- Editing, following, subscribing to, or submitting to a list.
- Account shelves, profiles, or a new taxonomy.
- Pagination, remote sorting, or client-derived shelf membership.
- Reader behavior after the canonical book opens; earlier scenarios own the
  reading, progress, keeping, and read-along surfaces.
- Offline shelf snapshots. Failure is honest and retryable; keeping a shelf is
  future work.

## What the next scenario would extend

An offline-browse scenario may reopen a previously saved shelf without a
service. It must preserve this canonical identity and payload order and must
not infer a shelf from the smaller discovery indexes.
