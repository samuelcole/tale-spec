# Scenario: new writing has a door of its own

**The claim.** Tale's library is the classics. Writing that people publish on
Tale themselves is a different thing, and it gets its own door instead of
sitting among two thousand public-domain books with nothing to tell them apart.
A reader browsing the classics never meets a stranger's draft by accident; a
reader looking for new writing finds all of it in one place, newest first; and
search still finds either, saying which is which (Sam, 2026-10-24:
"ugc/modern authors versus the classics seems like a big thing to separate
out").

Read [`README.md`](README.md) first, then
[`library-search.md`](library-search.md) and
[`browse-without-typing.md`](browse-without-typing.md), whose search and browse
line this scenario divides. The executable plan beside this prose owns the
ordered actions and observations. Adapters type through the real library
input, activate rendered links and rows, use the platform's ordinary back
navigation, and observe only the visible or accessible surface.

## Portable rules

- **The producer says which is which.** Every library index row carries
  `collection`, `classics` or `new-writing`
  ([`../payload.md`](../payload.md), "Library index and browse rows"). A
  client groups by it. It never infers the collection from a path, a handle,
  a byline or the presence of a recording.
- **The browse line ends with new writing.** After its directory links, the
  library's browse line offers one more link, `new writing` in the interface
  language, that opens the new writing shelf.
- **The new writing shelf** has canonical identity `/new-writing` and kind
  `new-writing`. It serves the `library-browse` shelf payload shape. Its roster
  is every published piece of new writing, newest first, in the producer's
  order, and each row names its writer as its byline.
- **Search shows classics first.** When a query matches both collections,
  the classics results come first with no group label, then a group labelled
  `new writing` with the new writing results. When a query matches only new
  writing, that group appears alone, still labelled. Matching is
  `library-search`'s, unchanged.
- **The classics browse stays classics.** The directories of
  `browse-without-typing` and the blank library's rows never include new
  writing or name its writers.

## Setup

- One signed-out device with no restored navigation state, preferred language
  English.
- The fixture library of `browse-without-typing`, with two published pieces of
  new writing added to the library index:
  - `After Frankenstein` by `@scenario-writer`, the newer; and
  - `A Quiet Draft` by `@other-writer`.
- The author directory is unchanged: `Mary Shelley` then `Ann Radcliffe`.
- `/new-writing` serves those two rows, newest first.

These names are test material, not prescribed production content.

## Steps

**1. Open the library on a fresh device.**

The browse line ends with a `new writing` link. No new writing row is among
the blank library's rows.

**2. Activate `new writing`, then go back.**

The native new writing shelf opens with canonical identity `/new-writing`,
kind `new-writing` and title `New writing`. Its roster is `After Frankenstein`
then `A Quiet Draft`, bylined `@scenario-writer` and `@other-writer`. Back
returns to the blank library.

**3. Type `frankenstein`.**

The classics result `Frankenstein` comes first, with no group label. Below it
a group labelled `new writing` holds `After Frankenstein`.

**4. Replace the query with `quiet`.**

Only the `new writing` group is shown, holding `A Quiet Draft`.

**5. Clear the query and open the author directory.**

It lists `Mary Shelley` then `Ann Radcliffe`. Neither writer of new writing
appears.

**6. Open `https://tale.fyi/new-writing`.**

The same native new writing shelf opens, with the same roster. It does not
open a browser or web view.

## What this does not cover

- Who may publish, how a piece is written, edited or unpublished, or any
  moderation. Those belong to the writing surface, not the library.
- Pagination of a long new writing shelf, or sorting it any other way.
- Which classics count toward the library's size on the web home page; that
  is the reference implementation's copy.

## What the next scenario would extend

A writer's own page (`/@handle`) already lists their published pieces. A later
scenario may let the new writing shelf filter by language, under
[`filter-by-language.md`](filter-by-language.md)'s rules, without changing the
`collection` rule.
