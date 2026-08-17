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
| `trace` | `paragraphs`, `initial`, `events` | `{steps, writes}` |

`paragraphs` is a non-empty ordered list of
`{anchor, section, begin}` records. `anchor` values are unique. `section`
identifies the audio file and equal section values are contiguous. `begin` is
the paragraph's whole-book media time; begins are finite, non-negative, and
strictly increasing. Every anchor supplied anywhere else in the trace occurs
in this list.

At a media time, the **narrated paragraph** is the record with the greatest
`begin` less than or equal to that time. All trace media times are at or after
the first begin. An exact begin belongs to the new paragraph. This definition
is also how an implementation validates a `follow-scroll` target.

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
when its anchor is later in `paragraphs` than the current `furthest` (with
`null` before every anchor); the state and write then take that later anchor.
Thus both reading and hearing are monotone. Percent is not duplicated here:
the reader area's `advance-reading-progress` operation remains its authority.

Inputs outside the preconditions stated here are not variants of the
operation. Adapters should reject them rather than inventing recovery rules.

## Events

### Reader and transport events

- `play` takes `{}` and requires paused state. It starts playback from
  `selected`. If `selected` is already the narrated paragraph at `mediaTime`,
  the exact media time is preserved; otherwise this is a seek to the selected
  paragraph's `begin`. Starting or seeking never earns hearing progress.
  `followSuppressed` becomes false.
- `pause` takes `{}`. It stops playback, preserves `selected` and `mediaTime`,
  and clears `followSuppressed`.
- `manual-scroll` takes `{progressAnchor}`. This event means the intent gate
  has already proved genuine wheel, touch, keyboard, or pointer input;
  programmatic movement must use `follow-scroll` instead. First, fold `progressAnchor`
  monotonically into `furthest` with source `reading`. Then select that anchor
  and hand it to narration. If it is the paragraph currently narrated,
  preserve the exact media time and playing state; while playing, set
  `followSuppressed` true. If it differs, pause and seek to its `begin`, then
  clear suppression. The progress fold happens before this audio arbitration,
  matching the reader's advance-before-announce hand-off.

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
  time at or after the final paragraph's begin. It first applies the same
  continuous newly-entered-paragraph credit, then stops at the exact supplied
  time and clears suppression. It is the only terminal event. Normally the
  final paragraph was already entered and credited by a preceding crossing;
  the rule also covers a coarse final tick that first enters it here.

The credited anchor is intentionally the paragraph entered, not the paragraph
left. That is the reference controller's shipped `floorIndex` rule: after a
non-seek forward tick, a larger narrated index announces that new anchor. It
makes the mark mean "you are here" for ears exactly as it does for eyes.

### Follow arbitration events

- `follow-scroll` takes `{paragraph}`; the paragraph must be the narrated
  paragraph at the current `mediaTime`. While playing with follow enabled, it
  selects that paragraph. While paused or `followSuppressed`, it is a no-op.
  It never writes progress: automatic page movement is not reader intent.
- `resume-follow` takes `{quietMs}`, a finite non-negative number measuring
  wall-clock milliseconds since the **most recent** same-paragraph manual
  scroll. While playing and suppressed, it clears `followSuppressed` when
  `quietMs >= 2500`; before that threshold it is a no-op. A later
  `follow-scroll` may then position the page. Another same-paragraph manual
  scroll resets the measurement to zero, so a superseded deadline cannot
  resume follow.

How a platform schedules the logical check, plus scroll animation, viewport
coordinates, and audio APIs, belongs to its adapter. The 2500 ms threshold and
ordering do not: no automatic follow may take effect before the most recent
manual scroll has been quiet for that long.
