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
fragment is a decoded, case-sensitive passage anchor: a block's id, its name,
or a legacy id, resolved against the loaded edition under
[`anchors.md`](anchors.md).

Two quotation forms open a reading address at the paragraph holding some
words instead of at an anchor ([`scenarios/open-at-a-quote.md`](scenarios/open-at-a-quote.md)):
a `find` query item, and a fragment that begins with the directive `:~:text=`.
A fragment beginning `:~:` is a fragment directive, never a passage anchor.
Neither form changes the address's identity.

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

## Interface-language prefix

A first segment naming one of Tale's translated interface languages other
than English — today `es`, `pt`, `it` and `de` — is the address of that language's
interface for the rest of the path (see
[`scenarios/address-speaks-its-language.md`](scenarios/address-speaks-its-language.md)).
It says what language the controls speak, never what language the book is
in. `route` drops it and decides on the remainder: `/es/<book>` is the same
reading door, identity, tip and anchor as `/<book>`, and `/es/eras/<slug>`
the same shelf as `/eras/<slug>`. The prefix is matched case-insensitively
and never appears in `visiblePath` or `canonicalPath`. `/es`, `/pt`, `/it` or `/de` alone is the
library and stays in the browser, as `/` does; a remainder that is
unsupported, or `browser`, returns `browser` with the original URL
unchanged.

Only one prefix is dropped: a remainder that starts with an interface
prefix again is unsupported, whichever prefixes they are (`/pt/es/…` too). Because of
this rule no book, tale handle or list can be named `es`, `pt`, `it` or `de`.

### German rollout (TAL-456)

German adds `/de` to this same prefix rule; it does not add a second identity
or progress key. A `/de/…` book, authored tale, list-context tale, plan or
shelf has exactly the unprefixed identity, including opaque tip and decoded
anchor. Mixed and repeated prefixes remain unsupported. Unsupported web
addresses retain the original URL unchanged.

Consumers without German prefix support must update before claiming these
links through an operating-system association. Older native releases can
mistake `de` for a book; web association claims must therefore remain aligned
with a native release that understands it. Before enabling production `/de` routes, TAL-456 must record a read-only
collision check for the newly reserved book/handle/list name `de`. A conflict
blocks rollout until Sam approves an alias/migration decision; never silently
rename it. The same ticket must record the supporting native release before
its `/de` association claim is enabled.

The address vectors remain version 2: these are additive cases for inputs not
previously covered by a vector, and no existing expected value changes, per
the README's versioning policy. The newly reserved name still changes the
route interpretation for any conflicting existing identity; the collision and
release gates above are required even though the vector additions are additive.

## Canonical passage URL

`canonical-passage-url` accepts a server-resolved canonical path and an
optional passage anchor. It returns an absolute `https://tale.fyi` URL, never
language-prefixed, for a
bare book or an authored tale, lowercasing identity segments and preserving the
anchor. Every other shape returns `null`. A plan tip never appears in an
outbound passage URL.

## Executable contract

[`../vectors/addresses.json`](../vectors/addresses.json) is version 2. Its
operations are `route` and `canonical-passage-url`; the result shapes are the
decisions described above. `browser` includes the unchanged input URL so an
adapter cannot silently normalize or replace an unsupported address.

