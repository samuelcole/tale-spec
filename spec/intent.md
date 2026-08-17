# The user-intent gate

Progress is a record of reading, not a record of every scroll offset.  The
intent area describes the small event machine that decides whether a position
update is eligible to be folded into the progress mark.  Its executable
contract is [`vectors/intent.json`](../vectors/intent.json).

## Trace format

The operation `apply-intent-trace` takes this input shape:

```json
{
  "total": 10,
  "progress": { "furthest": 3, "percent": 40 },
  "events": [
    { "atMs": 0, "kind": "input", "subtype": "touch" },
    { "atMs": 100, "kind": "scroll", "source": "user", "current": 4, "anchor": 4 }
  ]
}
```

`total` is the positive paragraph count.  The initial and result `progress`
object is `{furthest, percent}`, where `furthest` is a zero-based paragraph
index or `-1`, and `percent` is an integer from 0 through 100.  Every event has
an `atMs` timestamp, relative to the start of the trace.  A `scroll` event's
`current` and `anchor` are zero-based paragraph indexes; its percent is derived
from `current` using the reader area's rules.  The result shape is
`{progress, accepted}`, where `accepted` contains indexes into the original
`events` array, not ordinals among the position events.

The event kinds are deliberately platform-neutral:

- `input` with `subtype` `drag`, `deceleration`, `wheel`, `touch`, or
  `keyboard` is genuine reader input and opens (or refreshes) the intent
  window.  `pointer` is intentionally not a separate subtype: a platform's
  mouse or trackpad callback is translated to `drag` or `wheel`, while a
  touch callback is translated to `touch`.
- `scroll` with `source` `user` is a position produced by that genuine input.
- `scroll` with any other source (`resume`, `anchor-seek`, `endnote-hop`,
  `follow-scroll`, `find-in-page`, `restoration`, or `browser-fragment`) is
  programmatic movement and cannot advance progress.
- `link-click` is a same-document fragment activation.  It is genuine input,
  but it closes the intent window before the browser performs its fragment
  movement; its following programmatic scroll therefore cannot count.

An input is valid for a user scroll strictly before 1000ms after the most
recent genuine input.  At exactly 1000ms it is expired.  A user scroll without
an unexpired input is ignored.  Accepted positions use the reader area's
monotonic advance rule: `furthest` and `percent` never decrease, and an
accepted event that moves neither field is still reported as not accepted.

No DOM, UIKit, gesture recognizer, scroll physics, or animation detail belongs
in this contract.  A platform adapter translates its native callbacks into
these event kinds and subtypes and runs the same traces.
