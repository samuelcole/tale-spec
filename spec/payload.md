# The content payload

**Status: current.** This is the content API response contract: the shape of a
tale as a native client receives it. The *content* — text and anchor ids — is
generated server-side and only ever received (see "What's deliberately
absent" in the README).

One JSON document per tale:

```json
{
  "schema": 1,
  "slug": "dracula",
  "title": "Dracula",
  "author": "Bram Stoker",
  "credit": {
    "text": { "from": "Standard Ebooks",
              "url": "https://standardebooks.org/ebooks/bram-stoker/dracula" },
    "audio": { "readBy": "volunteers", "from": "LibriVox",
               "url": "https://archive.org/details/dracula_librivox" }
  },
  "blocks": [
    { "id": "chapter-1", "kind": "heading", "level": 2,
      "runs": [{ "text": "I" }] },
    { "id": "chapter-1-p1", "kind": "paragraph", "header": true,
      "runs": [{ "text": "Jonathan Harker’s Journal." }] },
    { "id": "chapter-1-p3", "kind": "paragraph", "quote": 1, "quoteStart": true,
      "runs": [{ "text": "3 May. Bistritz.", "italic": true },
               { "text": "﻿—Left Munich at 8:35 p.m., …" }] }
  ]
}
```

## Rules

- `schema` is the integer contract version described under Versioning.
- `slug` is the canonical reading path without its leading slash: `dracula`
  for a curated book, `@handle/tale-slug` for a published user tale.
- `title` is the tale's display title. `author` is its display byline, or
  `null` when the source names none; a client does not guess one.
- `blocks` is **flat, in document order**. No nesting; structure that
  matters to rendering becomes attributes.
- `credit` carries the cover's attribution — where the text was set from
  and who read it aloud (`spec/presentation.md`, "The cover"). `text` and
  `audio` are each optional, and `credit` itself is absent when neither
  applies. `text.from` names the edition and `text.url` is its page;
  `audio.readBy` is the narrators **as the line says them** — one or two
  names conjoined, three or more already collapsed to "volunteers", so the
  rule lives on one side of the wire and every client credits identically
  — `audio.from` names the host and `audio.url` is the recording. A client
  renders what it is given and invents no attribution of its own.
- `id` is the anchor identifier, **verbatim from the server**: a heading
  carries its section's id, a paragraph its own. Clients never generate,
  normalize, or repair an id — an id is a shareable URL fragment, and a
  reading system with two anchor generators has two contracts. A block the
  server did not anchor has no id.
- `kind` is `"heading"` (with `level`: 2 or 3), `"paragraph"`, or
  `"divider"` — a scene break. A divider has no id and no `runs`; it
  renders as the scene-divider rule in `spec/presentation.md`, and the
  paragraph after it sits flush. A quoted divider carries `quote` like a
  paragraph would: the rule centers within its quote box, not the full
  measure.
- `quote` is the blockquote nesting depth: an integer ≥ 1, absent when
  the block is not quoted. Depth is real structure — a letter quoted
  inside a journal entry sits at depth 2 — and each level insets further
  (see `spec/presentation.md`).
- `quoteStart: true` marks the first block of its innermost blockquote,
  absent otherwise. It is the boundary that keeps adjacent quotes from
  fusing: a new quote opens with a gap and a flush first line even when
  its neighbour is quoted at the same depth — depth alone cannot see
  that seam.
- `header: true` marks a bridgehead — a paragraph inside *any* header, a
  chapter's or a letter's, rendered in the header's quiet voice (see
  `spec/presentation.md`); a letter header inside a quote carries both
  `quote` and `header` and keeps the quote's inset. Absent when false.
- `runs` carry text with minimal inline style: optional `italic` and
  `bold`, absent when false. Adjacent runs with identical styling are
  merged; no empty runs.
- Line breaks within a paragraph are `"\n"` inside a run. Entities are
  decoded. Exotic whitespace is preserved exactly: it is typography, not
  noise. (In Standard Ebooks text the invisible joiner before an em dash
  is U+FEFF, the zero-width no-break space — not the U+2060 word joiner.)
- Unknown fields: a client ignores fields it doesn't recognize; a client
  encountering an unknown `kind` fails loudly rather than skipping content
  silently — an unknown kind means the payload is newer than the client,
  not that the block is optional.

## HTTP identity and validation

The payload is a subresource of the canonical reading URL:

- `/dracula` → `/dracula/tale.json`
- `/@handle/tale-slug` → `/@handle/tale-slug/tale.json`

A successful response is `application/json; charset=utf-8`. Its strong `ETag`
is `"sha256-<digest>"`, where `<digest>` is the base64url SHA-256 of the exact
response bytes. That validator is the payload's content address: metadata,
credit, an anchor, styling, or text changing produces a different identity.

Responses say `Cache-Control: public, max-age=0, must-revalidate`. A request
whose `If-None-Match` contains the current validator returns `304` with no
body. Clients use those ordinary HTTP validators; they do not put a second
speculative cache in front of them. A missing or unreadable public tale is
`404`, never an empty successful payload.

## Known schema 1 gaps

Known losses in schema 1, recorded rather than papered over; each is a
deliberate call awaiting a real need:

- A section with no heading element (a dedication, a preface) contributes
  no block for its own section id — its paragraphs are present, the
  section anchor itself is not addressable in the payload.
- `sub`/`sup` flatten to plain text (a chemical formula loses its
  subscripts).
- Verse-indentation classes flatten to line breaks alone.

## Versioning

`schema` is the payload's contract version, integer, governed by the same
policy as vector areas: additive optional fields keep the version; any
change to the meaning of an existing field bumps it.
