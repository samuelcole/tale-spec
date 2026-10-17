# Scenario: a language is a shelf

**The claim.** A reader can find every book Tale holds in one language. A
language is a discovery result and a shelf, like an author or a genre: search
finds it by its own name or its English one, and its canonical address opens
the same shelf. A book in a language other than English says which language it
is wherever it appears as a search result.

Read [`README.md`](README.md) first. This extends
[`library-browse.md`](library-browse.md): the language shelf is one more browse
kind of the same portable browse payload, and every rule there holds for it.
The executable plan beside this prose owns the ordered actions and
observations.

## Portable additions

- **A browse kind, `language`.** Its canonical identity path is
  `/language/<tag>`, where `<tag>` is the lowercase BCP-47 primary subtag the
  producer stores for every book (`pt`, `fr`). Its title is the language's own
  name as the producer supplies it — `Português`, not `Portuguese` — and its
  roster is every findable book in that language, in producer order.
- **A language discovery index.** Each result carries the tag, the own name,
  the English name, and the book count. A query matches a language by either
  name, under the same folding as every other discovery result (case,
  accents, surrounding space). Its result meta reads `<n> books · a language`.
- **A language on every book row.** Each book in the library index and every
  browse roster carries its language tag. A client shows the language's own
  name on a book row whose language is not English, and nothing on an English
  one. (The reader's chosen language, which changes that default, is the
  next scenario.)
- Clients never infer a book's language from its title, its author or its
  text. A row with no language from the producer is a malformed index.

## Setup

- One signed-out device with no restored navigation state and an English
  device language.
- Reachable, stable indexes holding books in two languages:
  - `Frankenstein` by `Mary Shelley`, language `en`, canonical path
    `/frankenstein-scenario`;
  - `Dom Casmurro` and `Helena`, both by `Machado de Assis`, language `pt`,
    in that producer order, the first with canonical path
    `/dom-casmurro-scenario`.
- The language index holds exactly `pt` (own name `Português`, English name
  `Portuguese`, 2 books) and `en` (own name `English`).

These names are test material, not prescribed production content.

## Steps

**1. Open the library and search for `português`.**

One discovery result is visible: kind `language`, title `Português`, meta
`2 books · a language`.

**2. Activate it.**

The native language shelf opens with canonical identity `/language/pt`, title
`Português`, `2 books`, and the roster `Dom Casmurro`, `Helena` in producer
order, the first with the byline `Machado de Assis`.

**3. Open the first book, then go back twice.**

The canonical book opens in the reader. Back restores the same shelf; back
again restores the library with `português` in the input and the same result.

**4. Replace the query with `Portuguese`.**

The same single language result is visible. A reader who doesn't know the
language's own name still finds it.

**5. Replace the query with `casmurro`.**

One book result: `Dom Casmurro` by `Machado de Assis`, labelled `Português`.

**6. Replace the query with `frankenstein`.**

One book result: `Frankenstein` by `Mary Shelley`, with no language label.

**7. Open `https://tale.fyi/language/pt`.**

The same native shelf as step 2: identity, title, count and roster. It does not
open a browser or web view.

## What this does not cover

- The reader's own language: choosing one, a home page that leads with it,
  and search that favours it. That is the next scenario.
- Translating the interface. Every label here except the language names is
  the existing English chrome.
- Languages the library holds no books in; they are absent from the index.
- Multilingual books, or one book in several editions and languages.

## What the next scenario would extend

A reader chooses the language they read in. The choice persists across a
relaunch; the home page leads with that language's shelf; among equally strong
search matches, books in it come first; and book rows label every language but
the chosen one.
