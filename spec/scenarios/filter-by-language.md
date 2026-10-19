# Scenario: a shelf that mixes languages filters by them

**The claim.** When one shelf holds books in more than one language — an
author read in several translations, a list that crosses languages — the
reader can narrow it to one. The choice is offered only where it means
something, each language by its own name, and it narrows the roster without
changing the shelf.

Read [`README.md`](README.md) first. This builds on
[`library-browse.md`](library-browse.md) (a shelf and its roster) and
[`library-language.md`](library-language.md) (every row carries its
language, named by its own name).

## Portable rules

- **Offered only on a mixed shelf.** The filter appears when the shelf's
  roster holds books in at least two languages, and is absent otherwise — a
  language shelf, a genre that is all English.
- **Each language by its own name** (`English`, `Français`, `Português`), in
  the order the roster first reaches each one, after an "all" choice that is
  the default.
- **Narrowing, not navigating.** Choosing a language leaves the reader on the
  same shelf, with the roster reduced to that language in the producer's
  order and the count to match. Opening a book and coming back keeps the
  choice; choosing "all" restores the whole roster.
- **The rows decide.** A book's language is its row's `language`
  ([`../payload.md`](../payload.md), "Library index and browse rows"); a
  client never infers it from a title.

## Observing it

- `languageFilter` is the list of offered language names, in order, without
  the "all" choice; `absent` when the shelf offers none.
- `languageFilterChosen` is the chosen language's name, or `all`.
- `bookCount`, `roster`, `state`, `kind` and `canonicalBook` are as in
  `library-browse`.

## Setup

- A signed-out device with no restored state.
- An author shelf at `/author/victor-hugo-scenario` whose roster is, in
  producer order: `Notre-Dame of Paris` (English), `Notre-Dame de Paris`
  (French, at `/notre-dame-de-paris-scenario`), `O Corcunda de Notre-Dame`
  (Portuguese).
- The `library-language` fixture's Portuguese shelf at `/language/pt`.

These names are test material, not prescribed production content.

## Steps

**1. Open `/author/victor-hugo-scenario`.**

Three books, and a language choice offering English, Français and Português,
with all chosen.

**2. Choose Français.**

Only `Notre-Dame de Paris` remains; the count is one.

**3. Open it.** The French book opens.

**4. Go back to the shelf.** Still narrowed to Français.

**5. Choose all.** All three books again.

**6. Open `/language/pt`.** One language, so no language choice.

## Platform note

The iOS shelf has no filters yet — no genre, era or sort either — so this
scenario starts on the web, and a native client declares it not applicable
until its shelves gain filtering.

## What this does not cover

- Filtering search results by language; search offers a language as a
  result of its own ([`library-language.md`](library-language.md)).
- Remembering the choice across shelves or sessions.
