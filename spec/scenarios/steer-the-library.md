# Scenario: the library has a steering surface

**The claim.** Finding a book is the library's steering control, and it
stays in reach. Search, the featured genres and the directories sit together
on one surface of their own, apart from the header above and the books below.
When the reader scrolls into the books, that surface docks at the top, thinner,
with Tale's name beside the search as the way home. The reader can always type
or change direction without scrolling back up (Sam, 2026-10-24: "lift the
navigation bar into it's own surface… think of it as our steering control
surface", "sticky and tale.fyi shrinks into it as a 'go home' control").

Read [`README.md`](README.md) first, then
[`browse-without-typing.md`](browse-without-typing.md), whose browse line this
surface holds, and [`library-search.md`](library-search.md), whose search it
holds. The executable plan beside this prose owns the ordered actions and
observations. Adapters scroll, type and activate the rendered controls, and
observe only the visible or accessible surface.

## Portable rules

- **One surface.** The blank library's search input, featured genres and
  directory links are one steering surface, distinct from the header (the name
  and the introduction) and from the list of books. On the blank library the
  search input comes first, then the featured genres, then the directories.
- **Docking.** Once the reader has scrolled so that the header is out of view,
  the steering surface stays at the top of the library, docked. Docked, it
  shows:
  - a home control named `tale.fyi`;
  - the search input, beside the home control;
  - the directory links.

  The featured genres step out of the docked surface and come back when it
  undocks. Scrolling back until the header is in view undocks it.
- **Home.** Activating the docked home control returns the reader to the blank
  library at its top. The query is cleared, the surface is undocked, and the
  header is in view.
- **Search while docked.** The docked search input is the same input. Typing
  in it filters the library exactly as `library-search` says.
- **Nothing jumps.** Docking and undocking never move the book the reader is
  looking at. The row at the reading position before the surface docks is at
  the same place afterwards.

How the surface looks (its tone, spacing and type) is the platform's to match
against the reference web design. This scenario proves only the behavior.

## Setup

- One signed-out device with no restored navigation state, preferred language
  English.
- The fixture library of `browse-without-typing`, with enough book rows that
  the list runs at least three screens below the steering surface.

## Steps

**1. Open the library on a fresh device.**

The steering surface is undocked. It shows the search input, the featured
genre `Science fiction` and the five directory links, in that order. The
header is in view, and no home control is shown in the surface.

**2. Scroll down two screens.**

The header is out of view. The steering surface is docked at the top and
shows the home control `tale.fyi`, the search input and the five directory
links, without the featured genres. The book that was at the reading line
just before docking has not moved.

**3. Type `frankenstein` into the docked search input.**

The library filters to its `Frankenstein` result, as `library-search` says.

**4. Activate the docked home control.**

The blank library is at its top. The query is empty, the surface is undocked
and shows the featured genres again, and the header is in view.

**5. Scroll down two screens, then scroll back to the top.**

The surface docks on the way down and undocks once the header is back in
view, showing the featured genres again.

## What this does not cover

- A steering surface on any page other than the blank library.
- The surface's visual design, which the web reference owns.
- Hiding the surface while the reader scrolls down.
