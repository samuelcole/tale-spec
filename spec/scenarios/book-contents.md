# Scenario: a book has a table of contents

**The claim.** A reader can see how a book is laid out and go straight to any
part of it. Someone setting marks for a reading assignment needs to see where
chapter 3 starts without scrolling there. Someone coming back for a scene
remembers its chapter, not its page. Every book with more than one titled
section offers its contents: the sections in order, each opening at its start
(Sam, 2026-10-24: a homeschooling reader "was looking at it to help her set
marks for a homeschool reading assignment").

Read [`README.md`](README.md) first, then [`../payload.md`](../payload.md)
("Content"), whose sections the contents lists, and
[`../addresses.md`](../addresses.md), whose passage URLs its entries open. The
executable plan beside this prose owns the ordered actions and observations.
Adapters open the contents through its rendered control, activate rendered
entries, and observe only the visible or accessible surface.

## Portable rules

- **What it lists.** The contents is the payload's `sections`, in order, each
  by its `title`.
  - A section whose `title` is `null` (a title page, a dedication with no
    heading) is not listed.
  - A client never makes up a title from the text, numbers sections itself, or
    nests them.
  - A book with fewer than two titled sections offers no contents.
- **Where it is.** The contents can be opened from the book's cover and at any
  point while reading, through one control. Its words and shape belong to the
  client.
- **Where the reader is.** While reading, the entry for the section that holds
  the reading line is marked as current. At the cover, no entry is current.
- **Opening an entry.** The book moves to the start of that section, with its
  heading at the reading line. The address becomes that section's canonical
  passage URL (`/<book>#<section id>`). It is ordinary reading movement: the
  saved place follows as it does when the reader scrolls.
- **For anything that only fetches the page.** Tale, the producer, includes the
  contents in a book page's HTML as ordinary links to each listed section's
  canonical passage URL, in order. This is checked at the website's HTTP
  boundary, not as a client surface step.

## Setup

- One signed-out device with no saved position in the fixture book, preferred
  language English.
- The fixture book's sections, in order:
  - an untitled title page;
  - `Letter I`;
  - `Chapter I`;
  - `Chapter II`;
  - `Chapter III`.

  Each titled section holds several paragraphs. `Letter I`'s anchor is
  `letter-1` and `Chapter II`'s is `chapter-2`.

These names are test material, not prescribed production content.

## Steps

**1. Open the book and open its contents from the cover.**

The contents lists `Letter I`, `Chapter I`, `Chapter II` and `Chapter III`,
in that order. The title page is not listed, and no entry is current.

**2. Activate `Chapter II`.**

The book is open with `Chapter II`'s heading at the reading line. The address
is the canonical passage URL for `chapter-2`.

**3. Read forward a few paragraphs, then open the contents again.**

`Chapter II` is the current entry.

**4. Activate `Letter I`.**

`Letter I`'s heading is at the reading line. Reopening the contents shows
`Letter I` as current.

## What this does not cover

- Setting or showing marks from the contents. A later scenario may show each
  mark beside its section and let a reader set one at a section's end, under
  the existing mark rules.
- Sections nested inside sections, or a contents for audio sections. A
  recording's sections are not the book's.
- Searching within the contents.
