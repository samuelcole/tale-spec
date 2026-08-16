# The content payload

**Status: draft.** This is the shape of a tale as a native client receives
it. Today it is produced by an exporter and consumed by the iOS spike; it
becomes the content API's response contract when that API ships. The shape
is specified here so every platform decodes the same thing; the *content* —
text and anchor ids — is generated server-side and only ever received (see
"What's deliberately absent" in the README).

One JSON document per tale:

```json
{
  "schema": 1,
  "slug": "dracula",
  "title": "Dracula",
  "author": "Bram Stoker",
  "blocks": [
    { "id": "chapter-1", "kind": "heading", "level": 2,
      "runs": [{ "text": "I" }] },
    { "id": "chapter-1-p1", "kind": "paragraph", "header": true,
      "runs": [{ "text": "Jonathan Harker’s Journal." }] },
    { "id": "chapter-1-p3", "kind": "paragraph", "quote": true,
      "runs": [{ "text": "3 May. Bistritz.", "italic": true },
               { "text": "⁠—Left Munich at 8:35 p.m., …" }] }
  ]
}
```

## Rules

- `blocks` is **flat, in document order**. No nesting; structure that
  matters to rendering becomes attributes.
- `id` is the anchor identifier, **verbatim from the server**: a heading
  carries its section's id, a paragraph its own. Clients never generate,
  normalize, or repair an id — an id is a shareable URL fragment, and a
  reading system with two anchor generators has two contracts. A block the
  server did not anchor has no id.
- `kind` is `"heading"` (with `level`: 2 or 3) or `"paragraph"`.
- `quote: true` marks a paragraph inside a blockquote. `header: true`
  marks a bridgehead — a paragraph inside a section's header, rendered in
  the header's quiet voice (see `spec/presentation.md`). Both are absent
  when false.
- `runs` carry text with minimal inline style: optional `italic` and
  `bold`, absent when false. Adjacent runs with identical styling are
  merged; no empty runs.
- Line breaks within a paragraph are `"\n"` inside a run. Entities are
  decoded. Exotic whitespace — no-break space, word joiner — is preserved
  exactly: it is typography, not noise.
- Unknown fields: a client ignores fields it doesn't recognize; a client
  encountering an unknown `kind` fails loudly rather than skipping content
  silently — an unknown kind means the payload is newer than the client,
  not that the block is optional.

## Versioning

`schema` is the payload's contract version, integer, governed by the same
policy as vector areas: additive optional fields keep the version; any
change to the meaning of an existing field bumps it.
