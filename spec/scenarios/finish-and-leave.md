# Scenario: finish and leave

**The claim.** The last line is not followed by anonymous blank paper. A
finished reader reaches one quiet colophon that thanks them, carries every
available text and narration credit, names the work's original year, and gives
them a real way back to Tale's library.

This is the end-of-book surface for the payload provenance fields in
[`payload.md`](../payload.md). Read [`README.md`](README.md) first: the
adapters reach the end through ordinary reader input and observe only rendered
or accessible text and navigation.

## Setup

- One signed-out reader with no recorded position for the book.
- A stable, short curated book with a title and author, a Standard Ebooks text
  source, one credited LibriVox narrator, and an original publication year of
  1897.
- Compact width, default reader size and appearance, no plan editor or
  fragment.

The fixture is short so reaching the end remains an ordinary reading gesture,
not a test-only jump. Source names, links, and dates arrive through the same
payload the prose does; a client never invents them.

## Steps

**1. Read through the final passage.**

The reader reaches a visible colophon after the book's last line. It says
`thank you for reading`, names the book and author in the text credit, credits
the narrator and LibriVox, says `First published in 1897.`, and exposes
`tale.fyi` as a link.

**2. Activate `tale.fyi`.**

The book closes and Tale's library is visible at `/`. The way home is product
navigation, not a decorative label and not a browser history assumption.

## Required starting result

This characterizes existing reference behavior. Before native implementation,
the web adapter records green against the rendered reader and the unfinished
Apple adapter records intentional red because the native page ends in blank
paper with no colophon or way home.

## What this does not cover

- Recommendation rows, author shelves, genres, lists, or follow capture after
  the book. Those are separate discovery behavior, not provenance.
- Opening the external Standard Ebooks or LibriVox links. Their visible credit
  is required here; leaving the app is a platform navigation cell.
- Missing metadata. A client shows only source, narration, and year fields it
  received and never substitutes guessed copy.
- Offline narration storage, download progress, or replay. The next narration
  scenario extends those behaviors without changing this colophon.
