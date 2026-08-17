# The reader

Where the reader is on the page, and everything decided from that: the
percent, the arrival dimming, the resume position, whether a tale is
finished, and where a scroll should land. One rule underlies all of it —
which paragraph is *current* — and this document is mostly the consequences
of that rule.

The executable form is [`vectors/reader.json`](../vectors/reader.json).

## Conventions

**Paragraph bounds.** Every geometric operation takes `bounds`: an array of
`{top, bottom}` rectangles, one per paragraph, in document order, measured in
document coordinates (pixels from the top of the document, growing downward).
`top` is the paragraph's leading edge, `bottom` its trailing edge. Tops are
non-decreasing — the scan below stops early and relies on it.

**The viewport** is the half-open interval `[viewportTop, viewportBottom)`.
A paragraph whose top lands exactly on `viewportTop` is inside it; one whose
top lands exactly on `viewportBottom` is not.

**Indexes** are 0-based positions in `bounds`. As an operation's *result*,
`-1` means "no paragraph" — nowhere, no boundary, no mark. As an operation's
*input*, `-1` is the same thing: a reader who has never started.

**Percent** is an integer 0–100. It is stored alongside the mark rather than
recomputed, so it can be rendered without the text in hand.

**Marks are inclusive.** The stored `furthestIndex` is the last paragraph
read *through*, not the next one to read. It is a high-water mark, not a
cursor: it only ever moves forward.

## Operations

| op | input | result |
| --- | --- | --- |
| `current-paragraph-index` | `bounds`, `viewportTop`, `viewportBottom`, `ineligible?` | index or `-1` |
| `percent-of` | `index`, `total` | integer percent |
| `dim-boundary` | `furthestIndex`, `total`, `percent` | index or `-1` |
| `reading-position` | `bounds`, `viewportTop`, `viewportBottom`, `atEnd` | `{current, anchor}` |
| `advance-reading-progress` | `furthestIndex`, `savedPercent`, `position`, `total` | `{furthestIndex, percent}` or `null` |
| `next-unread-index` | `index`, `paragraphCount`, `percent` | index or `null` |
| `is-finished-read` | `furthestIndex`, `total`, `percent` | boolean |
| `may-auto-continue` | `hash`, `navType?` | boolean |
| `is-same-document-fragment-link` | `href`, `currentHref` | boolean |
| `paragraph-start-scroll-top` | `bounds`, `targetIndex`, `viewportHeight` | scroll top or `null` |
| `follow-scroll-top` | `bounds`, `targetIndex`, `scrollTop`, `progress`, `viewportHeight` | scroll top or `null` |

## The current-paragraph rule

`current-paragraph-index` is the one algorithm that answers "where is the
reader". Scan `bounds` in document order:

1. Stop at the first paragraph whose `top` is at or past `viewportBottom`.
   Nothing after it can qualify.
2. Skip ineligible paragraphs. Eligibility filters candidates; it never
   stops the scan.
3. The first eligible paragraph with `top >= viewportTop` is the answer —
   the first paragraph whose leading edge the reader can see.
4. Failing that, the answer is the first eligible paragraph whose `bottom`
   is strictly greater than `viewportTop`: the paragraph straddling the top
   edge, which is the one a reader inside a viewport-tall paragraph is
   reading. A paragraph ending exactly at `viewportTop` is behind the
   reader, not under them.
5. If neither exists, the result is `-1`.

Step 3 outranks step 4 even when the intersecting paragraph comes first in
the document: a visible leading edge always wins over a straddle.

`ineligible` is the vector encoding of the eligibility predicate — an array
of indexes for which it is false. An absent `ineligible` means every
paragraph is eligible, which is how the reading layer calls it. Callers that
care about a subset (narration asking for the first paragraph with audio,
say) supply the filter; they do not write a second viewport algorithm.

**There is never a second viewport algorithm.** The progress mark, the
arrival dimming, the visible reading-position rule, the hand-off to and from
narration, and the follow-scroll constraint all resolve through this one
function. Two answers to "where is the reader" is two readers.

## Percent

`percent-of` is 1-based over the paragraph count, rounded to the nearest
integer with halves going up, and capped at 100:

```
total == 0            → 0
otherwise             → min(100, round(((index + 1) / total) * 100))
```

Index 0 of 4 is 25%; index 3 of 4 is 100%; index 0 of 3 is 33% and index 1
of 3 is 67%. No position (`-1`) is 0% by the same arithmetic, and an empty
book is 0% whatever index it is asked about. The cap matters because an
index can outlive the text it pointed into: a mark past the end still reads
as 100%, never more.

## Reading position

`reading-position` turns geometry into the two numbers the rest of the area
consumes. With no paragraphs at all, both are `-1`.

- **`anchor`** is exactly `current-paragraph-index` over the same viewport,
  with every paragraph eligible. It is the honest answer to "which paragraph
  is the reader looking at": where the dimming ends, where a "continue"
  action returns to, where the bookmark goes.
- **`current`** is the same index — except when `atEnd` is true, where it
  becomes the last index in `bounds`. It is the progress-bar position and
  the index the percent is computed from.

`atEnd` means the page is scrolled to its bottom. The last screenful may
never make the final paragraph current (it can sit above the reading edge
with nothing below it to scroll), so reaching the end counts the whole book
regardless of what the viewport rule found — including when the viewport
rule found nothing and `anchor` is `-1`.

Collapsing the two fields breaks one thing or the other. Take `current`
alone and the bookmark teleports past a screenful of text the reader never
scrolled through. Take `anchor` alone and a short page can never reach 100%,
so a tale that was read to the end never counts as read. They are two
questions — "how much of this is behind me" and "where am I" — and at the
bottom of a page they have different answers.

## Advancing the mark

`advance-reading-progress` folds a reading position into the saved record:

```
furthestIndex' = max(furthestIndex, position.anchor)
percent'       = max(savedPercent, percent-of(position.current, total))
```

Both fields are monotonic, and each is compared against its own source:
`furthestIndex` against `anchor`, `percent` against the percent derived from
`current`. Comparing one field and storing the other is the bug this shape
exists to prevent — at the bottom of a page the position reports 100%
through `current` while `anchor` can honestly sit behind an already-saved
mark, and a naive fold would move the bookmark backwards to finish the book.

The result is `null` when neither field would move — that is the signal to
write nothing at all. When either moves, both fields are returned, including
the one that stayed put.

Monotonicity holds through a re-read: opening a finished tale and reading
from the top does not lower the mark, and returns `null` the whole way down.
A reader who wants their progress back to zero needs an explicit
start-over action, which erases the record rather than lowering it.

## The dim boundary

Text already read arrives dimmed, up to and including the paragraph at the
boundary; ink resumes after it. `dim-boundary` returns that inclusive index,
or `-1` for no dimming anywhere:

```
percent >= 100                              → -1
furthestIndex >= 0 and furthestIndex < total - 1 → furthestIndex
otherwise                                   → -1
```

Three things follow. Dimming derives from the mark and nothing else — there
is no record of "paragraphs read", so any text past the boundary is ink
again, which is what makes moving the mark backwards a coherent operation.
A mark on the final paragraph draws no line, because a page that arrives
entirely grey has no boundary on it. And a finished tale re-opens as clean
ink rather than a wall of grey.

Finished is the *percent*, not the index. At the end of a page `current`
counts the whole book while the mark honestly stays at the last paragraph
the reader actually saw, so on a short tale the mark can be at index 4 of 9
with the percent at 100. The percent is the finish line; the boundary rule
trusts it over the mark.

## Continuing

`next-unread-index` answers "where does this tale open", or `null` for
"open at the cover":

```
percent < 100 and index >= 0 and index < paragraphCount - 1 → index + 1
otherwise                                                   → null
```

Because the mark is inclusive, continuation is its successor. `null` covers
the three cases that open at the top: no saved position at all, a position
that no longer resolves to a paragraph (which arrives here as `-1`), and a
finished tale, which has nowhere to continue *to*. A cover must not offer a
continuation that does not exist.

## Finished

`is-finished-read` is not a third rule about endings. It is the two rules
above agreeing there is nothing left to do with this mark:

```
furthestIndex >= 0
  and dim-boundary(furthestIndex, total, percent) < 0
  and next-unread-index(furthestIndex, total, percent) == null
```

No boundary to dim at, nowhere to continue to. It is reached from either
direction: a mark on the final paragraph says it, and so does a percent of
100 with the mark still mid-book on a short tale.

Finishing resets nothing, because there is nothing to reset — the mark is
the single source of truth and it is honestly at the end. The record stays
exactly as the reader left it (the tale still reads as read, the bar is
still full, start-over is still offered); the tale simply *opens* like a
fresh one.

**Never true without a mark.** A percent with nothing under it is unstarted,
not finished. Keeping those distinct is what stops "read" and "unread" from
sharing a state, and it makes re-opening a finished tale twice the same tale
twice rather than a reset of a reset.

## Opening on a mark

`may-auto-continue` decides whether this page-open may seek the saved
position at all:

```
hash is empty and navType != "back_forward"
```

`hash` is the requested fragment as the platform reports it, empty when
there is none; any non-empty value means the reader asked for a specific
passage, and an explicit request beats an inferred one. `navType` is the
platform's navigation type, absent when it reports none. A back/forward
navigation has the platform's own restored scroll position, which is better
than ours; an ordinary navigation or a reload does not.

## Fragment links on this document

`is-same-document-fragment-link` resolves `href` against `currentHref` and
returns true when all of these hold:

- the resolved fragment is non-empty — a bare `#` is not a seek;
- the origin matches;
- the path matches;
- the query matches.

Any address that cannot be resolved returns false rather than raising.

The distinction exists because a fragment seek must not read as reading.
Activating such a link produces genuine mouse, touch, or keyboard input,
and then the platform scrolls the document — so a footnote hop looks exactly
like a reader scrolling unless the reading layer can name it. Recognizing it
is what keeps an endnote round-trip from moving a high-water mark.

## Placing a paragraph on screen

Both placement operations return a scroll top in document coordinates, or
`null` for "no placement" (`-1` here would be a coordinate, not a sentinel).
The returned value can fall outside the scrollable range — placing a
paragraph at the very top of the document yields a slightly negative top —
and the caller clamps it. Neither
operation ever returns a position that fails the current-paragraph rule for
its target.

### The placement search

Both are built on one search: **the scroll top nearest a preferred position
that makes `targetIndex` current.** Given a viewport of `viewportHeight`
(`null` if that is zero or negative, or if `targetIndex` names no paragraph),
with `E = 1` — a full pixel, enough to cross a paragraph-top boundary while
still producing a real scroll rather than a discarded no-op:

1. If `preferred` already makes the target current, return it unchanged.
2. Otherwise build two candidate ranges, where `previousTop` is the previous
   paragraph's top (negative infinity for index 0) and `nextTop` is the next
   paragraph's top (positive infinity for the last index):
   - **top visible**: from `max(0, previousTop + E, targetTop - viewportHeight + E)`
     to `targetTop`. The target's leading edge is in the viewport and no
     earlier paragraph's edge beats it.
   - **inside**: from `targetTop + E` to
     `min(targetBottom - E, nextTop - viewportHeight)`. The reader is within
     the target, and the next paragraph's edge has not yet appeared.
3. Discard any range whose low bound exceeds its high bound. Clamp
   `preferred` into each surviving range, and keep the clamped candidates
   that genuinely make the target current under the full rule.
4. With no candidates, return `null`. Otherwise return the candidate closest
   to `preferred`; on a tie the top-visible range wins.

Step 3's re-check is not belt-and-braces: geometry can make a target
unreachable — two paragraphs sharing a top means the second can never be
current — and the honest answer there is `null`.

### `paragraph-start-scroll-top`

Places a paragraph at the reading edge: the search with `preferred =
targetTop - E`. One pixel above the leading edge, so subpixel rounding
cannot leave the edge just outside the viewport and hand the position to the
paragraph before it.

### `follow-scroll-top`

Keeps a narrated paragraph on screen while it is being spoken, without
letting the page drag the reader around. `progress` is how far through the
target the narration has reached, clamped to 0–1 and consulted only for a
tall paragraph. Let `height =
targetBottom - targetTop` and `relativeTop = targetTop - scrollTop`; the
paragraph is **tall** when `height > viewportHeight`.

```
spokenPosition = tall ? relativeTop + height * clamp(progress, 0, 1)
                      : relativeTop
band           = tall ? [0.28 * viewportHeight, 0.60 * viewportHeight]
                      : [40, 0.55 * viewportHeight]
```

If `spokenPosition` is inside the band, the preferred position is the
current `scrollTop` — the line being spoken is already comfortable and the
page should hold still. Otherwise re-aim it:

```
preferred = scrollTop + spokenPosition - viewportHeight * (tall ? 0.42 : 0.30)
```

Run the placement search from `preferred`. Return `null` if it finds
nothing, or if the result is within `0.5` of the current `scrollTop` — a
sub-half-pixel move is a no-op, and a no-op that still scrolls is a page
that twitches. These constants are normative: a conforming implementation
reproduces 40, 55%, 28%, 60%, 42%, 30%, the 1-pixel epsilon, and the
half-pixel threshold.

A short paragraph is followed by its own top edge; a tall one is followed by
the point inside it that is currently being spoken, which is why the tall
band is both higher and wider.

## Stateful behavior

Every operation here is a pure function of geometry and stored numbers; this
area does not say *when* to call them. The event-driven user-intent gate is
specified in [`spec/intent.md`](intent.md). It is the only machine that may
feed scroll positions into `advance-reading-progress`; fragment seeks,
restores, reflows, find-in-page, and narration follow-scroll never count as
reading.

Three stateful machines remain outside this area:

- **Narration arbitration** — how narration and an already accepted reader
  position hand selection back and forth. Its later event traces consume the
  intent gate's result rather than defining another gate.
- **Restoring a position** against a platform that applies its own scroll
  offset after the page has already seeked, and retiring that restore the
  moment the reader takes control.
- **Confirming a destructive action** — the two-press arm-then-fire on
  actions that discard a mark.

Those three machines are planned as event-trace vectors. Until those vectors
exist, they are not covered by this suite.
