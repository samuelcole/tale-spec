# Addresses

Tale has one public address space. A native client is another lens on those
addresses, never a second set of links.

## Route

`route` accepts one absolute URL and returns one of three decisions:

- `reading` — a book, authored tale, list-context tale, or immutable plan tip;
- `browse` — a list, genre, era, author, reader, or language shelf; or
- `browser` — the unchanged input URL when Tale has no native surface for it.

Only `https://tale.fyi` without credentials or an explicit port enters the
native address space. Query items do not change a Tale identity. A nonempty
fragment is a decoded, case-sensitive passage anchor.

Path segments are percent-decoded independently. An empty segment, dot
segment, encoded slash, or encoded backslash makes the address unsupported;
decoding must never change the route's shape.

### Reading doors

- `/<book>` is a canonical book. The book segment is lowercase identity.
- `/<book>/<tip>` is that book at an immutable plan tip. The tip is opaque and
  case-sensitive.
- `/@<handle>/<tale>` is a canonical authored tale. Handle and tale are
  lowercase identity.
- `/@<handle>/<tale>/<tip>` is that tale at an opaque plan tip.
- `/~<list>/<tale>` and `/~<list>/<collection>/<tale>` are list-context doors.
  Their visible segments are lowercase, but they have no canonical progress
  key until the server response names the underlying tale.

An empty handle/list, `list` in an authored tale slot, or `submit` in a
list-context tale slot is unsupported.

### Browse doors

- `/~<list>` is a list shelf.
- `/genre/<slug>`, `/eras/<slug>`, `/author/<slug>`, `/readers/<slug>`, and
  `/language/<tag>` are producer-owned shelves. Their slugs are lowercase
  identity. A `/readers/<slug>` shelf is a LibriVox reader's, `browseKind`
  `reader`. A `/language/<tag>` shelf is every book in one language,
  `browseKind` `language`, its slug the language's primary subtag (see
  [`scenarios/library-language.md`](scenarios/library-language.md)).

### Web-only namespaces

The following first segments are web-owned and must return `browser` unchanged:

`_next`, `api`, `audiobooks`, `author`, `body`, `curate`, `eras`, `following`,
`genre`, `language`, `monitoring`, `privacy`, `readers`, `request`, `signin`,
`support`, `synopses`, and `tell`.

The browse shapes above are the deliberate exceptions within `author`,
`eras`, `genre`, `language`, and `readers`. Filesystem precedence on one client is not part of this
contract.

## Canonical passage URL

`canonical-passage-url` accepts a server-resolved canonical path and an
optional passage anchor. It returns an absolute `https://tale.fyi` URL for a
bare book or an authored tale, lowercasing identity segments and preserving the
anchor. Every other shape returns `null`. A plan tip never appears in an
outbound passage URL.

## Executable contract

[`../vectors/addresses.json`](../vectors/addresses.json) is version 1. Its
operations are `route` and `canonical-passage-url`; the result shapes are the
decisions described above. `browser` includes the unchanged input URL so an
adapter cannot silently normalize or replace an unsupported address.

