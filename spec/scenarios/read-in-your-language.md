# Scenario: read in your language

**The claim.** Tale has one language setting: the interface language. When
that language is not English, the library leads with it. The home page opens
on its shelf, and search ranks its books first among equally good matches.
Every book in any other language carries a tag saying which language it is.
A reader who keeps their own language and opens another language's shelf is
a guest there: the books are a tap away and tagged, and nothing else moves.
A reader who wants that language to lead switches Tale to it
([`choose-language-from-a-shelf.md`](choose-language-from-a-shelf.md)).

Read [`README.md`](README.md) first. This extends
[`library-language.md`](library-language.md), whose shelf, discovery index,
and per-book language this scenario relies on. The language itself is
decided by [`interface-follows-the-device.md`](interface-follows-the-device.md)
and [`choose-interface-language.md`](choose-interface-language.md). The
executable plan beside this prose owns the ordered actions and observations.

## Portable rules

- **One language.** The language the library leads with is the interface
  language: the reader's choice, otherwise their device's when Tale speaks it,
  otherwise English. There is no separate reading language. (Version 4 and
  earlier had one, chosen on a language's shelf; it is retired, and a stored
  choice of it is ignored.)
- **Home.** When the interface language is not English, the home page opens
  with that language's shelf — its title, then its books in shelf order —
  ahead of the rest of the home page, which is otherwise unchanged. An English
  interface leaves home exactly as it was.
- **Search.** Among results of equal strength — the same kind of match in the
  same kind of field — books in the interface language come first. A stronger
  match in another language still ranks above a weaker one in the interface
  language. Discovery results keep their place ahead of books.
- **Labels.** A book row names its language, by that language's own name,
  whenever it differs from the interface language, everywhere a row appears,
  a language shelf included. It is a tag, set apart from the byline and the
  synopsis, not more text beside them. With an English interface this is
  exactly `library-language`'s rule.

## Setup

- One signed-out device with no restored state for each `clean` step.
- The fixture library of `library-language`, plus one English book whose title
  begins with a Portuguese one's: `Helena's Path` (`en`), beside `Helena`
  (`pt`). The query `helena` matches those two books and nothing else, both
  as equally strong title-prefix matches, so their order is the tie-break
  alone and no database collation can decide it.

These names are test material, not prescribed production content.

## Steps

**1. On a fresh device whose preferred language is English, open the
library.**

The home page opens on its ordinary first row; no language shelf leads it.

**2. Search for `helena`.**

`Helena's Path` is first and `Helena` second; `Helena` is tagged `Português`
and `Helena's Path` is not.

**3. Open the `Português` shelf.**

Every row is tagged `Português`: the reader is a guest here, and Tale is still
English.

**4. On a fresh device whose preferred language is Portuguese, open the
library.**

The controls are Portuguese, and the home page opens with the `Português`
shelf: its title, then `Dom Casmurro` and `Helena`.

**5. Search for `helena`.**

`Helena` is first, untagged; `Helena's Path` second, tagged `English`.

**6. Open the `Português` shelf.**

No row is tagged: every book is in the reader's language.

## What this does not cover

- More than one language at once.
- Syncing the choice across a reader's devices.
- Books in more than one language.

## What the next scenario would extend

Finishing a book offers more to read in the interface language first.
