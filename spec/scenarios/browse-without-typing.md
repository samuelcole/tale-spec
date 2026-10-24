# Scenario: the library can be browsed without typing

**The claim.** A reader who doesn't know what to search for can still find a
book. The blank library offers a short browse line: a few featured genres,
each opening its shelf directly, and a way into every genre, era, author,
language and list. Each of those five is a directory, a native page of shelves in the
order Tale gives it. Typing is still one way in, but no longer the only one
(Sam, 2026-10-23: "people aren't typing 'romance' into the search bar").

Read [`README.md`](README.md) first, and
[`library-browse.md`](library-browse.md), whose shelves this scenario reaches
by another route. The executable plan beside this prose owns the ordered
actions and observations. Adapters activate rendered browse links, directory
entries and book rows, use the platform's ordinary back navigation, and
observe only the visible or accessible surface.

## Portable directory payload

Tale is the sole producer of one versioned directory payload per kind, served
at the directory's canonical address and used by the web directory pages and
native clients alike. A directory payload names:

- its kind: `genre`, `era`, `author`, `language` or `list`;
- its canonical identity: `/genres`, `/eras`, `/authors`, `/languages` or
  `/lists`;
- its displayed title; and
- an ordered list of groups. Each group has an optional displayed label and an
  ordered list of entries. Each entry names its shelf's canonical identity path,
  its displayed title, its book count, and, for a list someone curates, the
  curator's displayed handle.

The order is Tale's. Genres come by book count, most first; eras
chronologically; authors by book count, most first; languages by book
count, most first, each titled by its own name as its `/language/<tag>`
shelf is ([`library-language.md`](library-language.md)); lists in Tale's curated
groups, followed by lists people curate themselves, newest first, in a group
with no label. Clients render the order they are given. They do not sort,
group, count, filter or derive entries, and they do not infer a directory
from the smaller discovery indexes.

The genre directory payload also names an ordered `featured` subset of its
entries. The library's browse line shows exactly that subset, in that order.
Which genres are featured is Tale's editorial choice, not a client's.

A payload whose kind, identity, groups or entries are absent or malformed is
unavailable.

## The browse line

The blank library shows, above or beside its search input:

- the featured genres, each an ordinary link to its genre shelf; and
- five directory links, in this order: genres, eras, authors, languages,
  lists.

The line then ends with a link to new writing, which
[`new-writing.md`](new-writing.md) owns; it is not a directory, and this
scenario does not observe it.

The labels are in the interface language. The line is present on a fresh
device with no started books, and it stays present after a book has been
started. It disappears while a query is typed and returns when the query is
cleared.

## Setup

- One signed-out device with no restored navigation state, preferred language
  English.
- The fixture library of `library-browse`, with these additions served by the
  directory payloads:
  - genres: `Gothic` (2 books) and `Science fiction` (1 book, `The Last
    Man`); `featured` is `Science fiction` alone, so the browse line is not
    the directory's first entry by count;
  - eras: `18th century` (1 book) and `19th century` (2 books);
  - authors: `Mary Shelley` (2 books) and `Ann Radcliffe` (1 book);
  - languages: `English` (3 books) then `Português` (1 book), at
    `/language/en` and `/language/pt`;
  - lists: a curated group labelled `shelves` holding `Gothic monsters`
    (2 books), then an unlabelled group holding `A journal's picks` (1 book)
    curated by `@scenario-journal`.
- Each directory entry's shelf address serves the `library-browse` shelf
  payload shape.
- The fixture can also serve the era directory as unavailable
  (`directory-unavailable`) without affecting the ordinary catalog.

These names are test material, not prescribed production content.

## Steps

**1. Open the library on a fresh device.**

The browse line shows the featured genre `Science fiction`, not `Gothic`, and
the five directory links in order: genres, eras, authors, languages, lists.

**2. Activate the featured genre, then go back.**

The native genre shelf opens with canonical identity
`/genre/science-fiction`, title `Science fiction` and the one-book roster
`The Last Man`. Back returns to the blank library with the browse line
unchanged.

**3. Activate the genres directory link.**

The native genre directory opens with canonical identity `/genres`. Its one
group has no label and lists `Gothic` (2 books) then `Science fiction`
(1 book).

**4. Activate `Gothic` in the directory, go back, then go back again.**

The genre shelf `/genre/gothic` opens. Back returns to the genre directory in
the same order. Back again returns to the blank library.

**5. Open the eras, authors and languages directories in turn.**

The era directory `/eras` lists `18th century` then `19th century`,
chronologically, not by count. The author directory `/authors` lists
`Mary Shelley` (2 books) then `Ann Radcliffe` (1 book).

The language directory `/languages` lists `English` (3 books) then
`Português` (1 book), each by its own name, by count.

**6. Open the lists directory.**

The list directory `/lists` shows the group `shelves` with `Gothic monsters`
(2 books), then an unlabelled group with `A journal's picks` (1 book), whose
row names its curator `@scenario-journal`. No label such as "by readers" is
invented for the unlabelled group.

**7. Type a query, then clear it.**

The browse line is hidden while the query is present and returns, unchanged,
when the input is empty.

**8. Open each of the five canonical directory addresses.**

`https://tale.fyi/genres`, `/eras`, `/authors`, `/languages` and `/lists` each
open the same
native directory identity, groups and order as the browse line reached. None
opens a browser or web view.

**9. Open the era directory while its payload is unavailable.**

It remains in the native library surface and states plainly that the
directory is unavailable. A working retry is present. It does not open the
web.

## What this does not cover

- Which genres are featured, how many there are, or what the curated list
  groups are called in production. Those are Tale's content.
- Pagination of very long directories, searching within a directory, or any
  sort a reader chooses.
- Creating, editing or grouping a list. A curated list's group is authored by
  Tale; a list someone curates themselves is never given a group label.
- The shelves themselves; `library-browse` owns them.

## What the next scenario would extend

A directory scenario for a language-led library may show each interface
language's own featured genres and lists. It must keep the same payload shape
and the same rule that the producer, not the client, orders and groups.
