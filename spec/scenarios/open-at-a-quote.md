# Scenario: a quoted passage opens where the quote is

**The claim.** Someone who has just read a line of *The Wonderful Wizard of
Oz* in a conversation, an AI answer or a citation can follow a link to that
line on Tale and keep reading from there. The link needs no knowledge of Tale's
anchors: it names the book and the words. Tale finds the words in the current
edition and opens the book at the paragraph that holds them, exactly as a
passage link would (Sam, 2026-10-24: "if someone is talk about the wizard of
oz, an llm can link them to the passage on tale and they can read more on
tale").

Read [`README.md`](README.md) first, then [`../addresses.md`](../addresses.md)
and [`../anchors.md`](../anchors.md), whose passage links this scenario reaches
by quotation, and [`link-handoff.md`](link-handoff.md), whose verified-link
delivery carries these addresses to a native client. The executable plan
beside this prose owns the ordered actions and observations. Adapters open
the real address in the client and observe only the visible or accessible
surface.

## Two ways to quote

Both are ordinary `https://tale.fyi` reading addresses for a book. Neither
changes the book's identity.

- **A find query:** `/<book>?find=<words>`. This is a form any person or
  assistant can write from memory, and Tale documents it in `/llms.txt`.
- **A text fragment:** `/<book>#:~:text=<words>`, the form browsers and search
  engines already put on cited quotes. Only its simplest form, a single
  `text=` with no prefix, suffix or range, is in scope. A fragment that begins
  `:~:` is a fragment directive, not a passage anchor.

## Portable rules

- **What matches.** The quoted words match a paragraph when, after folding,
  they appear inside that paragraph's text.
  - Folding ignores case, treats every run of whitespace as one space, and
    treats typographic and keyboard quotation marks, apostrophes and dashes as
    equal, so `there's` matches `there’s`.
  - A quote never matches across two paragraphs.
- **Which paragraph.** The first matching paragraph in reading order, in the
  current edition.
- **Where it opens.** The book opens with that paragraph at the reading line,
  marked as the quoted passage the way a passage link marks its target.
- **The address it settles on.** The address is replaced by that paragraph's
  canonical passage URL (`/<book>#<anchor>`), so a reader who shares or
  bookmarks it shares a stable passage link, not the quote.
- **No match.** When the words are not in the book, it opens the book where it
  would open without the quote, says plainly that the passage wasn't found, and
  never guesses a nearby paragraph.
- **Anywhere in the text.** The quote is found wherever it is in the book, not
  only in the part of the text that loads first.
- **Locally.** The quote is matched against the edition the client has. Tale
  never sends a reader's quote anywhere else.
- **For anything that only fetches the page.** Tale, the producer, answers a
  `find` address over HTTP with the match already resolved: the response's
  HTML names the matched paragraph's text and its canonical passage URL, or
  says plainly that nothing matched. So an assistant or tool that can fetch a
  URL but not run a reader still leaves with a working passage link. The
  response is not indexed (`noindex`) and canonicalizes to the book. This is
  checked at the website's HTTP boundary, not as a client surface step; a text
  fragment never reaches a server, so it has no such response.

## Setup

- One signed-out device with no saved position in the fixture book, preferred
  language English.
- The fixture book is `the-wonderful-wizard-of-oz`. Far below its cover, in a
  part of the text that is not in the first portion a client receives, its
  paragraph **H** reads `“There is no place like home,” said Dorothy.`, with
  typographic quotation marks. Paragraph **E**, earlier in the book, holds
  `the Emerald City`. The same phrase appears again later, in paragraph **E2**.
- Neither `no place like the moon` nor any folding of it appears in the book.

These names are test material, not prescribed production content.

## Steps

**1. Open `https://tale.fyi/the-wonderful-wizard-of-oz?find=no%20place%20like%20HOME`.**

Case doesn't matter. The book opens with **H** at the reading line, marked as
the quoted passage, and the address is now the canonical passage URL for
**H**.

**2. Open `https://tale.fyi/the-wonderful-wizard-of-oz#:~:text=%22There%20is%20no%20place%20like%20home`.**

The keyboard quotation mark matches the book's typographic one. **H** is at
the reading line, marked, and the address is **H**'s canonical passage URL.

**3. Open the book with `?find=the%20emerald%20city`.**

**E**, the first occurrence in reading order, is at the reading line, not
**E2**.

**4. Open the book with `?find=no%20place%20like%20the%20moon`.**

The book opens at its cover, as it would with no quote. The reader is told
plainly that the passage wasn't found. No paragraph is marked as quoted.

**5. Open the book with `#:~:text=no%20place%20like%20the%20moon`.**

The same: the book opens at its cover with the plain not-found notice.

## What this does not cover

- Text-fragment prefixes, suffixes, ranges or several directives at once.
- Searching inside a book from its own interface; the MCP `search_passages`
  tool serves assistants that have Tale connected.
- Quotes from a different translation or edition than Tale's.
- What happens to a saved reading position when a quote opens elsewhere; that
  is a passage link's existing behavior.

## What the next scenario would extend

A later scenario may honor text-fragment prefixes and suffixes to pick a
later occurrence, under the same folding rule.
