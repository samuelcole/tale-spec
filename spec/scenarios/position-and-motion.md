# Scenario: position and motion

**The claim.** The book always gives a quiet, shared answer to “where am I?”:
one grey gutter line marks the paragraph during silent reading and grows to the
spoken word during narration. Product-initiated movement is visible enough to
follow, can change course without a jump, and becomes immediate when the reader
asks the system to reduce motion. Animation changes neither the destination nor
the reading mark.

This is the surface proof for [the position and motion presentation
contract](../presentation.md#position-and-motion--orientation-not-emphasis).
It narrows the visual choices deliberately left open by
[`follow-and-override.md`](follow-and-override.md): that scenario owns
narration arbitration and its 2,500 ms quiet interval; this one owns the
position line's presentation and the movement used after arbitration permits a
follow.

## Setup

- One device, signed out, with ordinary motion enabled and no recorded position
  for the narrated book.
- A narrated fixture with a body paragraph **P** tall enough to contain several
  rendered lines and aligned words, followed by enough text for narration
  follow to move the page visibly while remaining in **P**.
- Default type size, no plan marks open, no passage fragment, and narration
  initially paused.
- The adapter can observe rendered frames and colors from the launched product.
  Browser layout and computed-style APIs may read properties of the rendered
  surface. View-model values, private accessibility values, test-only overlays,
  and application source are not observations. Pixel sampling or screenshots
  of the rendered surface are permitted.

The adapter records its fixture, viewport, appearance, platform motion setting,
and sampling bounds. Ordinary and reduced motion may run as separate clean
sessions on the same platform matrix cell. Step 3 may also repeat from the same
clean, genuinely selected P after step 2's line observation, so the voice can
stay inside P long enough to distinguish automatic page movement from
legitimate narration progress into P's successor. The adapter restores the
reader's prior platform motion setting after the scenario.

## The movement observation

“Eased” means that the rendered surface shows intermediate positions and that
their rate changes over the move rather than remaining linear. “Immediate”
means no intermediate rendered position appears. An adapter samples enough
frames to distinguish those outcomes for the platform treatment it selected;
waiting only until the destination and inferring the path is not evidence. The
450 ms line-height and 140 ms line-appearance durations allow ordinary frame
scheduling tolerance in the executable result, but not a materially different
tempo.

Retargeting is observed by issuing the next permitted follow while the prior
page movement is still in flight. The rendered page continues from its
on-screen position; it neither teleports back to the previous target nor moves
backward before pursuing the new one.

## Steps

**1. Scroll from the cover to narrated paragraph P and let the page settle.**

The paragraph selected by the genuine reading gesture carries one 2 px/pt/dp
line in its leading gutter. The line uses the `rule` palette value for the
active appearance, spans P's full rendered height, and does not change P's
text geometry. There is no second narration line while narration is paused.

**2. Press play and let the voice advance through at least two word bottoms in
P.**

The full-height silent line gives way to one narration-owned line in the same
gutter, width, and `rule` color. Its bottom settles on the active rendered word
box. Under ordinary motion, each change exposes an intermediate height, and a
second word advances it without a snap or backward step. The height change is
eased over 450 ms and the narration line appears over 140 ms.

**3. Let narration move the page, then retarget that follow before it
settles.**

The page eases through intermediate positions from its rendered start toward
the comfortable band. A permitted follow update received mid-movement continues
from the page's current rendered position without a teleport or reversal. It
settles with the lit position in the same comfortable band required by
`follow-and-override`. The automatic movement does not advance the saved
reading position.

**4. From the same clean setup with the platform's Reduce Motion preference
enabled, repeat the word and follow changes.**

The narration line and page move immediately, with no intermediate rendered
positions. The line still ends at the active rendered word bottom; the page
still ends in the comfortable band; neither moves backward during continuous
playback; and the automatic movement still does not advance the saved reading
position.

## Required starting result

This characterizes existing reference behavior. Before this scenario lands,
the web adapter must record a green result against the shipped reader. The
unfinished native reader records an intentional red result: it has no silent
position line, uses `accent-red` for narration position, snaps narration-line
height, and performs follow movement without animation. Implementations change
only after those black-box results are recorded.

## What this does not cover

- The bottom saved-progress fill/current-position tick, continue strip, start
  over, or read-from-here controls. A later orientation scenario owns those
  surfaces; they are not smuggled into a marker-and-motion change.
- The narration phrase wash, play flourish, hover/long-press peek, or their
  curves. This scenario fixes the persistent position line, not transient
  emphasis.
- User-scroll momentum, deceleration, overscroll, scroll indicators, or
  selection behavior. Those remain native chrome.
- The 2,500 ms override interval, pause-on-different-paragraph behavior, audio
  section seams, or exact timeline word cut. `follow-and-override` and the
  timeline contract continue to own them.
- VoiceOver announcements, Dynamic Type, rotation, or long-book performance.
  They remain platform matrix cells and device gates.

## What the next scenario would extend

**Leave and return** — move behind the saved mark and prove that the bottom
track distinguishes saved progress from current viewport position, then use a
visible, accessible continue action to return exactly to the next unread
paragraph without spending the reading-intent window.
