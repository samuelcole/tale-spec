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
  "discovery": {
    "recommendations": {
      "heading": "More by Bram Stoker",
      "by": "Bram Stoker",
      "showAuthors": false,
      "items": [{
        "path": "the-jewel-of-seven-stars",
        "title": "The Jewel of Seven Stars",
        "author": "Bram Stoker",
        "description": "An Egyptologist's discovery wakes something old.",
        "nonfiction": false,
        "href": "/the-jewel-of-seven-stars"
      }]
    },
    "genres": [{ "label": "Horror", "href": "/genre/horror" }],
    "lists": [{ "label": "Gothic Monsters", "href": "/~gothic-monsters" }],
    "era": { "label": "1897", "href": "/eras/1897" }
  },
  "sections": [
    {
      "id": "1--3fq0ab",
      "title": "I",
      "html": "<section id=\"1--3fq0ab\" data-name=\"chapter-1\"><header><h2>I</h2>...</section>"
    }
  ],
  "anchorAliases": {
    "chapter-1": "1--3fq0ab",
    "chapter-1-p1": "12--8qz2mc"
  }
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
- Optional `discovery` carries the quiet doors after the final passage. The
  producer supplies every displayed label and canonical `href`; clients do not
  derive author slugs, genre identities, list paths, era addresses, or
  recommendations. `recommendations.by` is the author's display name when every
  recommendation is by the book's own author, and absent otherwise; a client
  writes the heading from it in its interface language ("More by Bram Stoker",
  "Más de Bram Stoker"; without `by`, "Read next", "Para leer después").
  `recommendations.heading` is the same heading in English, kept for clients
  that predate `by`. `showAuthors` owns whether each recommended row repeats
  its author. Every recommendation includes the
  synopsis that qualified it, its classification, its canonical reading
  `path`, and its reading `href`. `path` has the same no-leading-slash form as
  the enclosing payload path and lets reading-state stores use the producer's
  identity without parsing the URL.
  The producer prefers the book's own language when it chooses
  recommendations: the same author in the book's language first, then other
  books in that language, and only then books in other languages. A book in a
  language with one book on Tale recommends what the general shelf offers.
  `genres` and `lists` preserve producer order. `era` is the original-year
  door when one exists. A payload without `discovery`, or with no populated
  discovery section, simply continues from the colophon without these doors.

## Library index and browse rows

Every row of the library index (`/tales.json`) and of every browse roster
(`<shelf>/browse.json`) carries `language`, the same lowercase BCP-47 primary
subtag as the book's payload. A row without it makes the index or the shelf
malformed ([`scenarios/library-language.md`](scenarios/library-language.md)).
A client groups, labels and filters by it; it never infers a language from a
title or a byline.

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
- Every addressable block's `id` is a stable anchor, and a block may carry a
  readable name in `data-name` ([`anchors.md`](anchors.md)). A client reads an
  anchor's key only to resolve an anchor it holds against this edition, under
  that document's rule. It never mints, renumbers or repairs one.
- Optional `anchorAliases` is the book's legacy alias table: every positional
  id the book served before it moved to stable anchors, mapped to the stable
  anchor its block received then. It is absent for a book that was born with
  stable anchors. It is kept forever, and a client resolves a legacy id held in
  a link, a position, a plan or a kept book through it
  ([`anchors.md`](anchors.md)). It is not body: it does not enter
  `contentVersion`, and the response `ETag` covers it.
- Content consumers preserve text and document order even when they do not yet
  provide platform-specific styling for a recognized HTML element. A client
  that cannot safely consume the declared schema fails explicitly; it never
  skips an unknown content node and presents a shorter tale as complete.

### Notes

A book's endnotes travel inside `sections` — they are body, not metadata, so
every rule above already covers them: their markup is byte-for-byte what the
web renders, their anchors are verbatim, and `contentVersion` changes when a
note changes. Nothing about them is a schema addition.

- A note reference is a same-document fragment link carried in the prose where
  the author set it: `<a href="#note-1" data-name="noteref-1">1</a>`. Its text — the
  note's number — is book content, not client chrome.
- The notes themselves are an ordinary trailing section — in curated books,
  `<section id="endnotes">` titled "Endnotes" — holding an ordered list whose
  items are `<li data-name="note-1">` wrapping the note's paragraphs, each
  item and paragraph with its own stable anchor, and ending with the way back:
  `<a href="#noteref-1">↩︎</a>`.
- The relationship is nothing beyond those two fragment links: names
  verbatim, resolvable in both directions within one document. Clients
  recognize them with `is-same-document-fragment-link` ([`reader.md`](reader.md))
  and land them by name under [`anchors.md`](anchors.md); they never renumber
  or regenerate them.
- The `note-`/`noteref-` naming is Standard Ebooks' vocabulary, preserved
  verbatim by the curated import as names, and the reference web implementation
  styles references by that name prefix. A published tale may carry any valid
  names; the fragment-link mechanism, not the naming, is the contract.
- What activating a reference does to reading progress is fixed by
  [`intent.md`](intent.md): the activation is a `link-click`, and the movement
  it causes is a programmatic scroll that never advances the mark.

`contentVersion` is `sha256-<digest>`, where `<digest>` is the base64url SHA-256
of the ordered canonical section objects. A change to text, markup, attributes,
or anchors changes it. Metadata and credit do not: their changes are covered by
the response `ETag`. This identity lets a client reject an independently
cached or fetched read-along response when it names a different loaded body.

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
  "guessedPhrases": [],
  "language": "en"
}
```

`guessedPhrases` is optional; absent and empty mean the same thing. It lists
the absolute indexes of phrases whose aligned begin the producer scored below
its confidence floor ([`timeline.md`](timeline.md), "Guessed phrases"). The
reference producer's floor is a per-phrase alignment confidence of **0.5**.
Measured on *Os Lusíadas* (7,049 phrases), phrases below 0.2 had an
implausible duration — under a quarter or over three times the book's median —
33% of the time, those between 0.2 and 0.5 18%, and those above 0.8 about 1%;
phrases below 0.5 were also out of narration order 3% of the time against
0.05% above it. Clients never apply a floor of their own: the producer decides
what is guessed, so every client agrees.

The client rejects an alignment whose version differs from the loaded tale;
timings for one body must never drive another. Audio URLs, paragraph anchors,
phrase begins, original phrase indexes, and the language-dependent word-cut
rule all travel from the service. Absence of `narration` is the only public
text-only state; clients do not probe or construct an alignment URL.

In schema 1, the service derives both advertised versions from the currently
served body. Alignment persistence does not record the body revision that was
current when the timings were produced. Producers must therefore continue to
remove sync rows before publishing a changed body and restore them only after
realignment; `contentVersion` protects the fetched pair from cache skew, not
from a producer that violates that lifecycle.

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
speculative cache in front of them. The one exception is a book the reader has
started and the client has kept
([`scenarios/kept-on-open.md`](scenarios/kept-on-open.md)). That book opens from
the keep at once and revalidates through the validators in the background. A
newer representation is kept for the next open and never replaces text under a
reader mid-session
([`scenarios/kept-on-a-stalled-network.md`](scenarios/kept-on-a-stalled-network.md)).
The one exception is a press of play whose alignment names the newer body: the
voice can only follow the text it was timed to, so the press brings that body
onto the screen at the reader's place, and the voice plays there
([`scenarios/the-voice-brings-the-new-edition.md`](scenarios/the-voice-brings-the-new-edition.md)). A missing or unreadable public tale is
`404`, never an empty successful payload.

The read-along response uses the same cache and strong-validator rules. Its
`ETag` covers the exact alignment bytes independently of the tale response.
The same exception applies to it: a voice the reader has played and the client
has kept, in whole or in part, is read from the keep first and revalidated in
the background, so a network that never answers cannot hold a kept voice
([`scenarios/voice-on-a-stalled-network.md`](scenarios/voice-on-a-stalled-network.md)).
A newer alignment is kept for the next session, never swapped under a playing
voice.

## Versioning

`schema` is the payload's contract version, integer, governed by the same
policy as vector areas: additive optional fields keep the version; removing a
field or changing an existing field's meaning bumps it. The tale and read-along
representations version independently, but `contentVersion` joins each fetched
pair.
