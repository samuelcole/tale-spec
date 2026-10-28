# Scenario: a long directory can be narrowed by typing

**The claim.** A reader who has opened the author directory to find Twain should
not have to scroll through hundreds of names, or go back to the library to
search. The long directories offer a filter that narrows the page in place,
using the library's own matching, and leaves Tale's order alone (Sam,
2026-10-24: "should the hub pages have text filters? so you can find 'twain'
quickly from authors").

Read [`README.md`](README.md) first, then
[`browse-without-typing.md`](browse-without-typing.md), whose directories this
scenario filters, and [`library-search.md`](library-search.md), whose matching
it reuses. The executable plan beside this prose owns the ordered actions and
observations. Adapters type through the directory's real filter input,
activate rendered entries, use the platform's ordinary back navigation, and
observe only the visible or accessible surface.

## Portable rules

- **Where it is offered.** The author directory (`/authors`) and the list
  directory (`/lists`) each offer one filter input above their entries. The
  genre, era and language directories, which are short enough to scan, offer
  none.
- **Matching is the library's.** An entry matches under `library-search`'s
  alphabet and word rule, applied to its displayed title and, on a list that
  names one, its displayed curator. Every word must occur in one of those
  fields, and different words may match different fields. There is no second
  search alphabet.
- **Narrowing, not navigating.** Filtering hides the entries that don't match.
  The reader stays on the same directory, the remaining entries keep the
  producer's order and grouping, and a group left with no entries disappears
  along with its label. Clearing the input restores the whole directory.
- **Nothing matches.** When no entry matches, the directory says so plainly
  and keeps the input, so the reader can correct it.
- **The filter is kept.** Opening an entry and coming back returns the
  directory with the same filter text and the same narrowed entries.
- **Local only.** Filtering uses the directory payload already on screen. It
  fetches nothing and never opens the web.

## Setup

- One signed-out device with no restored navigation state, preferred language
  English.
- A scenario-specific extension of `browse-without-typing`'s fixture library,
  selected only for this scenario (not added to the original scenario's run).
  Its author directory is
  extended to `Mark Twain` (3 books), `Mary Shelley` (2 books), `Ann
  Radcliffe` (1 book) and `Charlotte Brontë` (1 book), in that order. The
  producer orders equal book counts by displayed title; filtering keeps that
  order. Its list
  directory and genre directory are unchanged.
- `/author/mark-twain` serves the `library-browse` shelf payload shape.

These names are test material, not prescribed production content.

## Steps

**1. Open the author directory.**

It offers a filter input, empty. All four entries are shown in order: `Mark
Twain`, `Mary Shelley`, `Ann Radcliffe`, `Charlotte Brontë`.

**2. Type `twain`.**

Disconnect the network after the directory has loaded, then type. Only
`Mark Twain` is shown. Keep the network disconnected through the accent and
no-match checks: filtering depends only on the loaded payload.

Replace the filter with `ar`: `Mark Twain`, `Mary Shelley` and `Charlotte
Brontë` match, still in the producer's count order, not alphabetical or
relevance order. `Ann Radcliffe` is gone, so an unfiltered page cannot satisfy
this check.

**3. Replace the filter with `  BRONTE  `.**

Only `Charlotte Brontë` is shown, still spelled with its diaeresis.

**4. Replace the filter with `zzz`.**

No entry is shown. The directory says plainly that nothing matches, and the
input still holds `zzz`.

**5. Clear the filter.**

Reconnect the network before clearing. All four entries return, in the same
order as step 1. Connectivity is restored for the shelf visit that follows.

**6. Type `twain`, open `Mark Twain`, then go back.**

The author shelf `/author/mark-twain` opens. Back returns to the author
directory with `twain` still in the filter and only `Mark Twain` shown.

**7. Open the list directory and type `journal`.**

Only the unlabelled group remains, holding `A journal's picks`. The `shelves`
group and its label are gone.

**8. Replace the filter with `scenario-journal`.**

`A journal's picks` is still the only entry, matched by its curator.

Replace it with `picks scenario-journal`: that same entry remains, with one
word matched in its title and the other in its curator.

Replace it with `gothic`: only `Gothic monsters` and its `shelves` group label
remain. A surviving labelled group keeps its label.

**9. Open the genre directory.**

It offers no filter input.

## Version 2 fixture correction

Version 1's draft expected Brontë before Radcliffe despite their equal book
counts. Version 2 corrects the fixture order to the reference producer's
count-then-title order; it does not change the ordering rule or any payload.
Clients pinned to the earlier draft must sync the corrected plan. No reader
state or shared address needs migration.

## Version 3 coverage extension

Version 3 adds an offline filtering phase, a multiple-match order check,
cross-field multiword matching and retention of a surviving group label. It
also makes the clean, reachable start explicit. These exercise the existing
rules rather than changing the payload or reader behavior. Clients pinned to
an earlier draft must sync the executable plan and translate its network
changes through their real test environment; no reader-state migration is
needed. Clients additionally verify that typing attempts no network requests,
since an offline response alone cannot prove no request was attempted.

## Version 4 non-vacuous order check

Version 4 narrows the multiple-match query to `ar`, excluding Radcliffe while
keeping three names whose producer order differs from alphabetical order.
This catches both an unfiltered page and a client that sorts only after some
entries have been hidden. The underlying filtering and ordering rules are
unchanged; only the executable evidence is strengthened.

## What this does not cover

- Filtering the library's shelves, or a filter on the genre, era or language
  directories.
- Searching anything not already in the directory payload, such as book titles
  inside an author's shelf.
- Pagination of very long directories, or any sort a reader chooses.
