# Follow-scroll arbitration

The reader and narration share one paragraph selection. The reader's current
paragraph is the authority; narration may ask the reader to position that
paragraph, but it never gets a second selection algorithm. These vectors are
event traces so every client can prove the hand-off without importing DOM,
UIKit, AVFoundation, or animation behavior.

The executable form is [`vectors/follow-scroll.json`](../vectors/follow-scroll.json).

## Trace shape

Each case supplies `paragraphs`, an ordered list of `{anchor, section, begin}`
records where `begin` is the paragraph's whole-book media time, an initial
state, and an ordered `events` list. Events are `[name, input]` pairs. The
portable event names are:

- `play` — start continuous playback from the reader-selected paragraph;
- `pause` — stop playback without changing the selected paragraph or media
  time;
- `manual-scroll` — genuine reader intent selects a paragraph and takes the
  wheel from narration;
- `follow-scroll` — while playing, narration asks the reader to keep its
  spoken paragraph current;
- `section-rollover` — continuous playback crosses into the next audio
  section; and
- `end-of-book` — continuous playback reaches the final paragraph.

The initial state contains `selected`, `mediaTime`, `playing`, and `furthest`.
`selected` and `furthest` are anchor ids; `mediaTime` is a whole-book second.
An event may provide `paragraph` and/or `mediaTime` as its input. A missing
field means that the event must use the state already established by the
trace, not that the value is unknown.

## Results and media-time policy

The expected result records the state after every event in `steps`. Each step
has the selected paragraph, whole-book media time, playing state, and
`furthest` mark. `writes` is the ordered list of progress writes; a state
transition that does not advance the high-water mark writes nothing.

The normative arbitration is:

1. `play` selects the reader's current paragraph. If that paragraph is the
   same one that was paused, playback resumes at the exact media time; a new
   paragraph starts at its `begin` time.
2. `pause` preserves media time exactly and makes no progress write.
3. `manual-scroll` wins over follow-scroll: it selects the paragraph named by
   reader intent, pauses narration, and seeks to that paragraph's `begin`.
4. `follow-scroll` may change the selected paragraph only while playing. It
   follows narration and preserves the current media time; it never writes
   progress by itself.
5. `section-rollover` is continuous playback: it stays playing, advances to
   the next section's spoken paragraph, and credits the paragraph just heard.
6. `end-of-book` credits the final paragraph, selects it, and stops at the
   exact supplied end time. It is the only terminal event.

Progress is monotone. A write contains the new `furthest` anchor and is
emitted only when the event explicitly represents continuous hearing
(`section-rollover` or `end-of-book`).

These are behavior semantics, not rendering instructions: scroll animation,
viewport coordinates, audio APIs, and timing tolerances belong to each
platform adapter.
