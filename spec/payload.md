# The reader payload

**Status: current.** This is the public read model shared by every Tale reader.
It is not a database record: the service derives it from the private `tales`,
author, audio, and alignment records, sanitizes the authored body, and exposes
only what a reader needs.

The web reader and `tale.json` route consume the **same produced object**. The
web may call its server-side producer directly while server-rendering; it must
not make a loopback HTTP request. A field used to render the reading surface is
therefore part of this payload, so adding reader content on web cannot silently
leave native clients with a smaller book.

One JSON representation per tale:

```json
{
  "schema": 1,
  "path": "dracula",
  "title": "Dracula",
  "description": "A solicitor travels to Transylvania...",
  "author": { "name": "Bram Stoker", "href": "/author/bram-stoker" },
  "language": "en",
  "font": "serif",
  "nonfiction": false,
  "firstPublished": 1897,
  "wordCount": 163650,
  "contentVersion": "sha256-VHWf...",
  "credit": {
    "text": { "from": "Standard Ebooks",
              "url": "https://standardebooks.org/ebooks/bram-stoker/dracula" },
    "audio": { "readBy": "Alex Foster, Jamie Lee, and Morgan Reed",
               "coverReadBy": "volunteers", "from": "LibriVox",
               "url": "https://archive.org/details/dracula_librivox" }
  },
  "narration": {
    "href": "/dracula/read-along.json",
    "contentVersion": "sha256-VHWf..."
  },
  "sections": [
    {
      "id": "chapter-1",
      "title": "I",
      "html": "<section id=\"chapter-1\"><header><h2>I</h2>...</section>"
    }
  ]
}
```

## Identity and metadata

- `schema` is the integer contract version described under Versioning.
- `path` is the canonical reading path without its leading slash: `dracula`
  for a curated book, `@handle/tale-slug` for a published user tale.
- `title` is the display title.
- `description` is the public synopsis or `null`.
- `author` is either absent or an object. `name` is the complete display
  byline; clients do not parse, repair, or invent it. Optional `href` is the
  canonical Tale author door used by a linked byline.
- `language` is the lowercase BCP-47 primary subtag used for the rendered
  document and its alignment rules.
- `font` is `serif`, `sans`, or `mono`.
- `nonfiction` is always present. A client does not infer it from categories.
- `firstPublished` is the known publication year, or `null`.
- `wordCount` is the complete reader body's word count used by the web
  document's structured metadata and available to every client.
- `credit` carries the cover attribution. `text` and `audio` are independently
  optional, and the object is absent when neither exists. `audio.readBy` is the
  complete narrator display phrase used in the colophon; `coverReadBy` is the
  intentionally compact phrase used beside the cover. Clients render these
  server-produced strings and do not recompute or truncate narrator credits.

## Content

- `sections` is the complete, ordered, sanitized reader body. Its `html` is
  byte-for-byte the section markup consumed by the web reader. It is the
  portable content representation, not a lossy summary of selected tags.
- The HTML allowlist, attributes, generated anchors, and sanitization belong to
  the producing service. Native clients never run authored input through a
  second sanitizer and never generate, normalize, or repair an anchor.
- `id` is the section anchor verbatim from the sanitized markup. `title` is its
  display title or `null`. Paragraph and other descendant anchors remain in
  `html`, likewise verbatim.
- Content consumers preserve text and document order even when they do not yet
  provide platform-specific styling for a recognized HTML element. A client
  that cannot safely consume the declared schema fails explicitly; it never
  skips an unknown content node and presents a shorter tale as complete.

`contentVersion` is `sha256-<digest>`, where `<digest>` is the base64url SHA-256
of the ordered canonical section objects. A change to text, markup, attributes,
or anchors changes it. Metadata and credit do not: their changes are covered by
the response `ETag`, while this identity binds narration to the exact body it
was aligned against.

## Narration and alignment

`narration` is present only when playable audio and a usable alignment exist.
Its `href` is relative to the canonical reading URL and is fetched lazily on
the first play gesture. Silent reading therefore does not download the large
map. Its `contentVersion` must equal the parent payload's `contentVersion`.

The referenced read-along response contains the timeline fields defined in
[`timeline.md`](timeline.md), plus the same `contentVersion`:

```json
{
  "schema": 1,
  "contentVersion": "sha256-VHWf...",
  "sections": [{ "url": "https://...", "secs": 123.4 }],
  "paras": [["chapter-1-p1", 12.3]],
  "phraseBegins": [12.3, 15.7],
  "phraseIndexes": [0, 1],
  "language": "en"
}
```

The client rejects an alignment whose version differs from the loaded tale;
timings for one body must never drive another. Audio URLs, paragraph anchors,
phrase begins, original phrase indexes, and the language-dependent word-cut
rule all travel from the service. Absence of `narration` is the only public
text-only state; clients do not probe or construct an alignment URL.

## HTTP identity and validation

The payload is a subresource of the canonical reading URL:

- `/dracula` -> `/dracula/tale.json`
- `/@handle/tale-slug` -> `/@handle/tale-slug/tale.json`

A successful response is `application/json; charset=utf-8`. Its strong `ETag`
is `"sha256-<digest>"`, where `<digest>` is the base64url SHA-256 of the exact
response bytes. Metadata, credit, narration availability, an anchor, markup, or
text changing therefore produces a different response identity.

Responses say `Cache-Control: public, max-age=0, must-revalidate`. A request
whose `If-None-Match` contains the current validator returns `304` with no body.
Clients use those ordinary HTTP validators; they do not put a second
speculative cache in front of them. A missing or unreadable public tale is
`404`, never an empty successful payload.

The read-along response uses the same cache and strong-validator rules. Its
`ETag` covers the exact alignment bytes independently of the tale response.

## Versioning

`schema` is the payload's contract version, integer, governed by the same
policy as vector areas: additive optional fields keep the version; removing a
field or changing an existing field's meaning bumps it. The tale and read-along
representations version independently, but `contentVersion` joins each fetched
pair.
