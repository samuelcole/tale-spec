# Anchors

An anchor is the address of one block of a book: the place a reading position,
a mark, a narration paragraph or a shared link points at. Everything a reader
holds about a book is held as anchors, so they have to survive new editions:
a re-import, a converter fix or a corrected typo. When a paragraph is inserted
earlier in its section, a link to a later one must still land on it.

This document defines what an anchor looks like, what a producer promises
about anchors across editions, and how a client resolves an anchor it holds
against the edition it has. Clients still never mint, renumber, normalize or
repair an anchor ([`payload.md`](payload.md)). Resolution is the only place a
client reads inside one.

## The anchor id

```
{key}--{hash}
```

- **`key`** is the block's place: one or more of `0-9a-z`, never ending in
  `0`. Read as a base-36 fraction (`0.k₁k₂k₃…`), so plain code-point string
  order is document order. `a` comes before `a1`, which comes before `b`.
- **`hash`** is exactly six of `0-9a-z`. It identifies the block's text.
- The separator is two hyphens. A slug never contains two hyphens in a row,
  so no heading-derived name and no legacy positional id
  (`chapter-3-p14`) matches this grammar.

The grammar is `^([0-9a-z]*[1-9a-z])--([0-9a-z]{6})$`. An id that matches it
is a **stable anchor**. Any other id a client meets in a book is a **legacy
id** or a **name**.

## What a producer promises

Within one edition:

- Every addressable block carries a stable anchor in its `id`: a section, a
  paragraph, or any other block a reading position, a mark, a narration
  paragraph or a link can point at.
- Ids are unique, and keys strictly increase in document order.

Across editions of the same book:

- **A block whose text is unchanged keeps its id.** Text is compared after
  folding typography, so curling a quote or swapping a dash for an em dash
  is not a change of text.
- **A block whose text changed keeps its key** and gets a new hash.
- **An inserted block gets a key strictly between its neighbours.** Nothing
  that stays is ever re-keyed.
- **A key is never given to a block at a different place.**

How keys and hashes are computed is the producer's business. Clients never
compute either; they only compare keys.

## Names

A block may carry a **name** as well as its id: a readable, slug-shaped
address in a `data-name` attribute, such as a section's `chapter-3`. A link may
use a name wherever it could use an id. Names are unique within an edition and
never match the anchor grammar. A name stays with its block across editions for
as long as the block exists.

## Legacy aliases

Before stable anchors, ids were positional (`{section}-p{n}`). Plans, reading
positions, shared links and kept books hold those ids. Each book carries a
**legacy alias table** mapping every legacy id it ever served to the stable
anchor the same block received when the book moved to stable anchors. The
table is kept forever. Plans and positions are never rewritten. The payload
field that carries it is defined in [`payload.md`](payload.md).

An alias names the anchor of the edition that migrated the block. A later
edition may have edited that block, so an aliased anchor is itself resolved
like any other.

## Resolving an anchor

A client resolves an anchor it holds (from a link, a stored position, a plan
mark, or a kept book) against the edition it has loaded. In order:

1. **Exact.** The edition has a block with this id → that block.
2. **Name.** A block's name equals it → that block.
3. **Alias.** The legacy alias table maps it → resolve that anchor with
   steps 1 and 4, and report the result as an alias.
4. **Placed.** It is a stable anchor → the block with the greatest key less
   than or equal to its key. If every key is greater, the first block.
5. Otherwise **none**: an unknown legacy id or name.

A placed anchor lands where the old block stood: on its edited successor, or
on whatever precedes the place of a deleted block. That is the "general
placement" a stale address deserves. Exactness is only promised for an
unchanged block.

What a client does with **none** is the caller's rule, not this one. A
fragment that lands nowhere seeks nothing, and it still counts as an explicit
request under `may-auto-continue` ([`reader.md`](reader.md)). A plan mark that
cannot be placed is not shown.

A resolution never writes back. A plan's marks are immutable, a stored
position keeps the anchor it stored until the reader moves, and a link keeps
its fragment. Each is resolved again against every edition it meets.

## Operations

### `parse-anchor`

Input `{id}`. Result `{key, hash}` when `id` matches the anchor grammar,
otherwise **null**.

### `compare-anchor-keys`

Input `{a, b}`, both stable anchors. Result `-1`, `0` or `1`: the order of
their keys under code-point string comparison. The hashes play no part.

### `resolve-anchor`

Input `{target, anchors, names?, aliases?}`:

- `anchors`: the edition's stable anchors in document order.
- `names`: an object mapping name → anchor.
- `aliases`: the legacy alias table, an object mapping legacy id → anchor.

Result `{id, match}`, where `match` is `"exact"`, `"name"`, `"alias"`,
`"placed"` or `"none"`, and `id` is the landed anchor, or **null** exactly when
`match` is `"none"`. An edition with no blocks resolves everything to
`"none"`, aliases included.
