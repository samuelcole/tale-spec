# Follow-scroll arbitration

The reader and narration share one paragraph selection. The reader's current
paragraph is the authority; narration may ask the reader to position that
paragraph, but it never gets a second selection algorithm. These vectors are
event traces so every client can prove the hand-off without importing DOM,
UIKit, AVFoundation, timers, or animation behavior.

The executable form is [`vectors/follow-scroll.json`](../vectors/follow-scroll.json).

## Trace operation

This area has one operation:

| op | input | result |
| --- | --- | --- |
| `trace` | `orderedAnchors`, `alignedParagraphs`, `initial`, `events` | `{steps, writes}` |

`orderedAnchors` is the non-empty list of every paragraph anchor in document
order, narrated or not. Its values are unique. It is the sole order used to
compare `furthest` and decide whether a progress write moves forward.

`alignedParagraphs` is the non-empty ordered subset the narrator actually
read, encoded as `{anchor, section, begin}` records. Its anchors are unique,
occur in the same order as `orderedAnchors`, and each occurs there. `section`
identifies the audio file and equal section values are contiguous. `begin` is
the paragraph's whole-book media time; begins are finite, non-negative, and
strictly increasing. An anchor absent from `alignedParagraphs` is unaligned;
absence is the only marker, exactly as in the timeline area.

Every `selected`, non-null `furthest`,
`approved-reader-position.selected`, and non-null
`approved-reader-position.progressWrite.furthest` occurs in `orderedAnchors`;
these anchors need not be aligned. A
`follow-scroll.paragraph` is a narration target and therefore must occur in
`alignedParagraphs`.

At a media time, the **narrated paragraph** is the record with the greatest
`begin` less than or equal to that time. All trace media times are at or after
the first begin. An exact begin belongs to the new paragraph. This definition
is also how an implementation validates a `follow-scroll` target.

The **begin at or after an anchor** is the timeline area's
`begin-at-or-after-anchor` operation with `orderedAnchors` and with `paras`
formed by projecting every aligned record to `[anchor, begin]`: start at that
document anchor and return the first aligned paragraph's `begin`, or `null` if
the anchor is absent or no narration follows. Trace inputs guarantee the anchor
is present, so `null` here means only that no narration remains.

`initial` contains all five state fields:

- `selected` — the reader's current paragraph anchor;
- `mediaTime` — the exact whole-book playback second;
- `playing` — whether transport is running;
- `furthest` — the inclusive progress high-water anchor, or `null`; and
- `followSuppressed` — whether genuine same-paragraph scrolling currently
  prevents narration from moving the page.

`events` is an ordered list of `[name, input]` pairs. Each event produces one
state snapshot in `steps`, including ignored events. Every snapshot contains
the same five fields as `initial`. `writes` is the ordered list of progress
writes across the whole trace. A write is
`{"source":"reading"|"hearing","furthest":"<anchor>"}`. It is emitted only
when hearing crosses into an anchor later than the current `furthest`, or when
an approved reader position carries the intent gate's already-decided
`progressWrite`. Hearing performs the monotone fold here. Reading does not:
the event applies and reports the gate's result exactly. A non-null
`progressWrite.furthest` must therefore be later than the current `furthest`;
adapters reject an input that claims otherwise. Percent is not duplicated
here: the intent and reader areas remain its authority.

Inputs outside the preconditions stated here are not variants of the
operation. Adapters should reject them rather than inventing recovery rules.

## Events

### Reader and transport events

- `play` takes `{}` and requires paused state. It starts playback from
  `selected`. If `selected` is already the narrated paragraph at `mediaTime`,
  the exact media time is preserved. Otherwise resolve begin at or after
  `selected`: a number seeks there and starts playback; `null` leaves playback
  paused and preserves `mediaTime`. Selection never moves merely because
  narration skipped its paragraph. Starting or seeking never earns hearing
  progress. `followSuppressed` becomes false in every outcome.
- `pause` takes `{}`. It stops playback, preserves `selected` and `mediaTime`,
  and clears `followSuppressed`.
- `approved-reader-position` takes `{selected, progressWrite}`. It is not a
  second manual-scroll gate: it is emitted only for an index in the intent
  area's `approved` result. `selected` is that scroll event's current reader
  paragraph. `progressWrite` is either `null` or an object containing the
  resulting `furthest`, mirroring whether the same index appears in the intent
  area's `progressWrites`; when present, apply it before arbitration and append
  the corresponding source `reading` write. Programmatic movement never enters
  this event — it uses `follow-scroll` instead. Select `selected` and hand it
  to narration. If it is the paragraph
  currently narrated, preserve the exact media time and playing state; while
  playing, set `followSuppressed` true. If it differs, pause and resolve begin
  at or after it: seek when the result is a number, or preserve `mediaTime`
  when it is `null`; then clear suppression. The progress fold happens before
  this audio arbitration in the intent/reader area; this event consumes that
  result instead of defining another eligibility or progress rule.

### Narration position events

- `playback-crossing` takes `{mediaTime}` and requires playing state, forward
  time, and the same section before and after the event. It represents
  continuous playback, updates `mediaTime`, and, when the narrated paragraph
  changes, folds the **newly entered paragraph** into `furthest` with source
  `hearing`. It does not itself move `selected`; narration requests that
  separately with `follow-scroll`.
- `playback-seek` takes `{mediaTime}` and requires playing state. It updates
  `mediaTime` exactly and establishes the new hearing baseline, but credits
  nothing across the jump. It does not change `selected` or suppression.
- `section-rollover` takes `{mediaTime}` and requires playing state, forward
  time, and a later section at the supplied time. It is continuous playback,
  so it applies the same newly-entered-paragraph hearing credit as
  `playback-crossing`, stays playing, and does not itself move `selected`.
- `end-of-book` takes `{mediaTime}` and requires playing state and forward
  time at or after the final aligned paragraph's begin. It first applies the
  same continuous newly-entered-paragraph credit, then stops at the exact
  supplied time and clears suppression. It is the only terminal event.
  Normally the final paragraph was already entered and credited by a preceding
  crossing; the rule also covers a coarse final tick that first enters it here.

The credited anchor is intentionally the paragraph entered, not the paragraph
left. That is the reference controller's shipped `floorIndex` rule: after a
non-seek forward tick, a larger narrated index announces that new anchor. It
makes the mark mean "you are here" for ears exactly as it does for eyes.

`section-rollover`'s entered-anchor credit is normative. The current Tale web
controller primes its hearing index in the rollover `play` callback, which can
suppress the first aligned paragraph's notification in the new section. That
is a reference-adapter conformance bug to fix when this area is consumed, not
an alternate rule and not a reason to encode the skipped credit here.

### Follow arbitration events

- `follow-scroll` takes `{paragraph}`; the paragraph must be the narrated
  paragraph at the current `mediaTime`. While playing with follow enabled, it
  selects that paragraph. While paused or `followSuppressed`, it is a no-op.
  It never writes progress: automatic page movement is not reader intent.
- `resume-follow` takes `{quietMs}`, a finite non-negative number measuring
  wall-clock milliseconds since the **most recent** same-paragraph approved
  scroll. While playing and suppressed, it clears `followSuppressed` when
  `quietMs >= 2500`; before that threshold it is a no-op. A later
  `follow-scroll` may then position the page. Another same-paragraph approved
  scroll resets the measurement to zero, so a superseded deadline cannot
  resume follow.

How a platform schedules the logical check, plus scroll animation, viewport
coordinates, and audio APIs, belongs to its adapter. The 2500 ms threshold and
ordering do not: no automatic follow may take effect before the most recent
approved reader position has been quiet for that long.
