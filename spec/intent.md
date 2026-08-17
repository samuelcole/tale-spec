# The user-intent gate

Progress is a record of reading, not a record of every scroll offset.  The
intent area describes the small event machine that decides whether a position
update is eligible to be folded into the progress mark.  Its executable
contract is [`vectors/intent.json`](../vectors/intent.json).

## Trace format

The operation `apply-intent-trace` takes an initial `progress` and an ordered
array of `events`.  Every event has an `atMs` timestamp, relative to the start
of the trace.  A position event also has `current` and `anchor`, zero-based
paragraph indexes, and `percent` is derived from `current` using the reader
area's rules.  The runner returns the final progress and the zero-based indexes
of the position events it accepted.

The event kinds are deliberately platform-neutral:

- `input` with `kind` `drag`, `deceleration`, `wheel`, `touch`, or `key` is
  genuine reader input and opens (or refreshes) the intent window.
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
these event kinds and runs the same traces.

