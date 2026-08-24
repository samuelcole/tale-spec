# Scenario: typing finds a book

**The claim.** The library is searchable without becoming a second catalog.
Typing narrows the rows already on screen with the same title-and-byline rules
on every client; choosing a result opens that book's canonical route, and the
ordinary way back returns to the search the reader left.

Read [`README.md`](README.md) first. The executable plan beside this prose owns
the ordered actions and observations. Adapters type through the product's real
text input, activate a rendered result, and observe only the visible or
accessible surface.

## Setup

- One signed-out device with no incoming book address or restored navigation
  state.
- A reachable, stable discovery fixture containing at least three book rows
  plus one curated list, genre, era, and author row. Each discovery row carries
  the canonical web route and book count the reference index exposes.
- One target row has the title `The Long Conversation: A 9–12 Reading List`,
  the byline `Charlotte Brontë`, and a working canonical book route.
- No progress or kept-book state is required. Catalog transport and snapshot
  storage remain platform-owned foundation.

The target's wording is test material, not prescribed catalog content. It puts
an accented name and a typographic dash on one ordinary row so every adapter
proves the same normalization against the same displayed strings.

## Matching

The reference search alphabet is deliberately small:

- case does not distinguish a match;
- Unicode combining marks do not distinguish a match, so `bronte` finds
  `Brontë` whether the stored text is composed or decomposed;
- the typographic dash characters U+2010 through U+2015 and mathematical minus
  U+2212 match the keyboard hyphen-minus U+002D; and
- whitespace before or after the query is ignored.

All other punctuation and internal whitespace remain part of the text. A
match is a substring of either the displayed title or the full displayed
byline. An empty query shows the ordinary library rows.

## Steps

**1. Open the library with the reachable fixture.**

The real library text input is available and empty, and at least three ordinary
book rows are visible.

**2. Type the fixture's curated-list name into the input.**

Only that list result is visible. It names itself, its number of books, and
`a list`; it is not styled or announced as a book.

**3. Replace the query with the fixture's genre name.**

Only that genre result is visible. It names itself, its number of books, and
`a genre`.

**4. Replace the query with the fixture's era name.**

Only that era result is visible. It names itself, its number of books, and `an
era`.

**5. Replace the query with `doyle`.**

Only the `Sir Arthur Conan Doyle` author result is visible. It names itself,
its number of books, and `an author`. Author matching uses the same fold as a
book byline; there is no second author-search alphabet.

**6. Replace the query with `  BRONTE  `.**

Rows filter as the text is entered. When typing settles, only the target row is
visible. Its displayed byline still says `Charlotte Brontë`; matching never
rewrites catalog text.

**7. Replace the query with `9-12`.**

Only that same row remains visible. The keyboard hyphen found the typographic
dash in its displayed title.

**8. Activate the filtered row.**

The target's canonical book route opens. Search does not mint a search-specific
reader route or an intermediate result screen.

**9. Use the platform's ordinary back navigation.**

The library returns with `9-12` still in its text input and the same one-row
result still visible. Restoring the query means restoring the search itself,
not merely remembering a value in storage for some later launch.

## What this does not cover

- Network traffic, catalog refreshes, remote typeahead, or offline snapshot
  recovery. A client proves separately that typing only filters its in-memory
  snapshot and causes zero network calls.
- Ranking among several matches, result caps, aliases, empty-result copy,
  keyboard highlight/return, or search analytics.
- Rendering a list, genre, era, or author shelf after its result is activated.
  These rows preserve Tale's canonical web destinations; a native client whose
  current address contract hands those routes to the browser may do so rather
  than invent a partial native shelf in this slice.
- Persisting a query across termination, relaunch, sign-in, or an incoming
  deep link. The query survives the navigation round trip in one session.
- Reader behavior after the canonical route opens; earlier scenarios own the
  cover, progress, offline, and read-along surfaces.

## What the next scenario would extend

An offline-library scenario may search a previously saved catalog snapshot and
open a kept result without a service. It must reuse this normalization and the
existing honest availability behavior rather than introduce an offline search
mode.
