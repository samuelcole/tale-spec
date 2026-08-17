# The user-intent gate

Progress is a record of reading, not a record of every scroll offset. The
intent area owns the event machine that decides whether a position update may
be folded into the reader area's progress mark. Its executable contract is
[`vectors/intent.json`](../vectors/intent.json).

## Operations

| op | input | result |
| --- | --- | --- |
| `apply-intent-trace` | `total`, `progress`, `events` | `{progress, approved, progressWrites, gate}` or `{error}` |

`total` is the positive paragraph count. `progress` is
`{furthestIndex, percent}`: `furthestIndex` is the reader area's inclusive,
zero-based high-water index or `-1`, and `percent` is an integer from 0 through
100. `furthestIndex` may be past `total - 1` when a stored mark outlives the
text it named. The names and meanings are exactly those of the reader area's
`advance-reading-progress` operation; the anchor-id field named `furthest` in
the progress area is a different representation and is not used here.

`events` is an array of timestamped callbacks. Every event has an `atMs`
timestamp relative to the start of the trace. It is a finite, non-negative
JSON number; fractional milliseconds are valid and must not be rounded or
truncated by an adapter. Events are applied in ascending `atMs` order, stable
by their array order when timestamps tie. This keeps callback delivery order
from changing causality while the result lists still report original array
indexes. Event fields are:

| kind | required fields | meaning |
| --- | --- | --- |
| `input` | `subtype` | genuine reader input; `subtype` is `drag`, `deceleration`, `wheel`, `touch`, or `keyboard` |
| `scroll` | `source`, `current`, `anchor` | a position update; `source` is one of the closed values below, and the indexes are integers greater than or equal to `-1` |
| `link-click` | none | same-document fragment activation; expires an open window without returning the gate to untouched |

`current` and `anchor` have the meanings they have in the reader area's
`reading-position` result. They may be `-1`, and a non-negative value may be
past `total - 1` when a stored position outlives the text it named. The
reader area's percent cap and monotonic fold remain in force.

A successful result contains:

- `progress` — the final `{furthestIndex, percent}` record;
- `approved` — indexes into the original `events` array for `user` scrolls
  that arrived inside an open intent window, including backward and
  same-position monotonic progress no-ops;
- `progressWrites` — the subset of `approved` whose progress fold advanced
  either field and therefore requires a stored progress write; and
- `gate` — `{state: "untouched"}` before any genuine interaction, or
  `{state: "touched", lastInputAtMs}` afterwards. `lastInputAtMs` is the
  exact timestamp used for expiry and may be negative after a link click.

The result is `{"error":"invalid-input"}` when any input violates this
schema. Validation happens before applying any event, so an invalid trace has
no partial result. In particular, adapters must reject an unknown event kind,
input subtype, or scroll source. Enum handling is a whitelist: a future
programmatic source must never become reading merely because an older adapter
does not recognize it.

## The intent window

An `input` event opens or refreshes the window at its exact `atMs`. An input
is valid for a user scroll strictly before 1000ms after that timestamp. At
exactly 1000ms it is expired. A `user` scroll without an unexpired input is
ignored.

The genuine input subtypes are platform-neutral. A platform's mouse or
trackpad callback is translated to `drag` or `wheel`, while a touch callback
is translated to `touch`. `pointer` is intentionally not a subtype. On a
platform with momentum scrolling, `deceleration` refreshes the window so the
tail of a genuine flick remains eligible after the initiating touch expires.

A `link-click` is genuine interaction, but it never opens or refreshes the
window. It immediately expires any open window by setting
`lastInputAtMs = atMs - 1000`. The gate remains `touched`, rather than becoming
`untouched`: restore and remote-progress logic may move an untouched page, but
must not yank a reader away after they activate an endnote link. The browser's
following fragment movement and a later user scroll both remain ineligible
until a new `input` event opens the gate.

## Scroll sources

Only `scroll` with source `user` can advance progress. The complete set of
programmatic sources in version 1 is:

- `resume`;
- `anchor-seek`;
- `endnote-hop`;
- `follow-scroll`;
- `find-in-page`;
- `restoration`;
- `browser-fragment`; and
- `reflow`, for resize, rotation, dynamic-type, font, or other layout changes.

A programmatic scroll never advances progress and never opens, refreshes,
expires, or closes the current intent window. This distinction is
load-bearing: a reflow or narration reposition may occur during a genuine
drag without preventing the next real user position from counting.

## Advancing progress

For an eligible `user` scroll, apply the reader area's fold independently to
the two fields:

```
furthestIndex' = max(furthestIndex, anchor)
percent'       = max(percent, percent-of(current, total))
```

`percent-of` is the reader area's 1-based, nearest-integer calculation with
halves up and a cap at 100. Every eligible event is appended to `approved`
before the fold. It is also appended to `progressWrites` when either field
moves; the other field is preserved. If neither moves, the event remains an
approved reader position but produces no progress write.

This split matters at the end of a page: `current` can finish the percentage
while `anchor` is `-1` or remains behind an earlier high-water mark. It also
matters after content changes, when `current` can temporarily name an index
past the new paragraph count and the percent must still cap at 100.

## Ownership boundary

This area is the only gate from native scroll callbacks to reading progress.
A downstream narration-arbitration machine consumes each event named by
`approved`, whether or not the same index appears in `progressWrites`. That
distinction is load-bearing: a backward or same-paragraph genuine scroll can
suppress follow-scroll, preserve media time, or seek narration without moving
the monotonic mark. The downstream machine does not enumerate genuine input
subtypes, decide whether a raw scroll is manual, or repeat the numeric progress
fold. Conversely, a narration-driven page movement enters this operation as
source `follow-scroll` and cannot earn reading progress.

The follow-scroll area being developed after this one therefore needs a
post-gate event name such as `approved-reader-position`, not a second
`manual-scroll` gate. It consumes the selected position for every `approved`
index and the optional stored-progress effect identified by `progressWrites`;
it never decides again whether the position was genuine or whether the numeric
fold earned a write.

No DOM, UIKit, gesture recognizer, scroll physics, or animation detail belongs
in this contract. A platform adapter translates its native callbacks into
these closed event kinds and runs the same traces.
