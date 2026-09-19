# Scenario: voice flourish and peek

**The claim.** Starting the voice briefly shows where it has picked up by
washing softly from the gutter rule through the live phrase. The wash then
recedes without removing the steady narration rule. While playback continues,
holding the play control on touch, or resting a pointer on it, brings the same
live wash back for exactly as long as the gesture lasts. Lifting the finger or
moving the pointer away changes no audio state; an ordinary tap or click
remains an ordinary play or pause.

This extends [`position-and-motion.md`](position-and-motion.md) with the
transient emphasis that scenario deliberately leaves out. Phrase selection and
word geometry remain the timeline contract's; this scenario owns only when the
emphasis appears, what it follows, and what the transport gesture means. Read
this directory's [`README.md`](README.md) first: every observation here comes
from the rendered or accessible product surface.

## Setup

- One device, signed out, no account, and no recorded position for the book.
- A narrated fixture with a paragraph long enough for several phrases to pass
  while playback remains in that paragraph.
- The ordinary reader surface, default text size, playback paused, and Reduce
  Motion initially disabled.
- The play control is visible and no loading or failure state is active.

An adapter chooses the exact fixture paragraph and waiting bounds. It records
those choices and observes the wash, gutter rule, prose geometry, transport,
and spoken-word position from the product surface. It never reads the media
player, timeline state, or a test-only highlight flag.

## Gesture portability

The `touch` and `pointer` surface subtypes are defined in
[`intent.md`](../intent.md#surface-gesture-subtypes). Touch uses a press held
for at least 420 ms; pointer uses hover without a button press. Hover is the
required pointer form, not an optional substitute for a mouse-button hold.
Adapters exercise the form available in their declared device matrix cell.
A touch result alone makes no claim about the pointer form.

The executable plan retains its existing action and observation names for
adapter compatibility: “hold” means maintaining the selected peek gesture,
“release” means ending it, and “tap” means ordinary activation (a click for
pointer). Each affected action spells out both forms in `gestures`; they share
all expectations. These gesture subtypes do not extend the progress gate's
closed input enum. Version 2 makes these action forms explicit; it changes no
expected wash or playback outcome. Clients must sync the plan and report its
version when adopting the clarification.

## The wash

The **phrase wash** is faint ink behind the prose, grown horizontally from the
steady narration rule and vertically to the same rendered word bottom that the
rule has reached. It never changes the paragraph's frame, line breaks, or text
position. At most one paragraph is actively held; when narration crosses a
paragraph boundary, the prior wash may finish receding while the new live wash
grows from its rule.

The wash is transient emphasis, not the narration position itself. When it is
gone, the steady two-point narration rule remains at the spoken word.

## Steps

**1. Press Play and watch where the voice begins.**

Playback begins. One phrase wash appears on the paragraph owned by narration,
growing from its gutter rule through the live phrase without changing text
geometry. It follows the voice while the opening flourish is present.

**2. Let the opening flourish finish.**

After a watchable beat, the wash recedes into the gutter. Playback continues
and the steady narration rule remains at the rendered word bottom.

**3. Peek at the playing transport.**

On touch, press and hold the same play control for at least 420 ms. With a
pointer, rest it on the control without pressing a button. The phrase wash
returns on the live narration paragraph and remains visible for the whole
gesture. As narration advances, its bottom continues to follow the rendered word.
The transport stays playing and the live narration position advances: peeking
never pauses, restarts, or seeks the voice.

**4. End the peek, then activate normally.**

Lift the finger or move the pointer away. The wash recedes while playback and
the steady narration rule continue unchanged. Then tap or click the control
normally. The transport pauses
once and no wash appears. A click never requests a peek; ending a hover never
toggles playback. A touch hold is not also a tap, and ordinary activation has
not been stolen by the peek gesture.

**5. Repeat the flourish and peek with Reduce Motion enabled.**

Start a clean reading session with Reduce Motion enabled, press Play, and
repeat the touch hold or pointer hover on the playing control. The same wash appears, follows the live phrase for the
gesture, and disappears when it ends, but every reveal and removal is immediate.
Transport semantics and final wash geometry are identical to the ordinary
motion session.

## Required starting result

The original touch characterization required web-green and native-red before
native flourish and peek existed. The pointer clarification characterizes
behavior now shipped by both web and Catalyst. Their existing adapters should
pass without product changes; an adapter that does not exercise its declared
gesture form is a coverage finding, not permission to weaken the scenario.
Record the exact client revision and input form with each surface result.

## What this does not cover

- Loading or failure feedback before playback begins. `play-and-pocket.md`
  owns the preparing state and the voice-availability scenarios own failure.
- A persistent highlight preference, karaoke mode, or word-level color change.
  The wash is deliberately temporary and phrase-height.
- Seeking, scrubbing, or a separately persisted listening position. The play
  control remains a binary transport.
- VoiceOver rotor order, Dynamic Type, rotation, or physical-device timing.
  They remain platform matrix cells and device gates.

## What the next scenario would extend

No further narration-presentation extension is implied. A future scenario
should begin from a separately approved reader need rather than turning this
brief explanation gesture into a permanent highlighting mode.
