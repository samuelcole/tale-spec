# Scenario: a voice kept in part

**The claim.** A keep that stopped partway is not nothing. Offline, a partly
kept voice plays the sections it has, from the reader's place, and when
playback reaches the first section that isn't on the device it stops honestly
at that section's start, says so, and leaves the text readable and the control
pressable. When the network returns, a press carries on from there. And a
library offers no play control it cannot honor offline.

[`voice-rides-along.md`](voice-rides-along.md) kept a whole voice and played
it back; it said nothing about a keep that was interrupted, and a client that
treated ten kept sections of twelve as no voice at all conformed. A reader at
the start of a twelve-section book, with ten sections on their phone, pressed
play on a train and was told nothing. This scenario, with
[`voice-on-a-stalled-network.md`](voice-on-a-stalled-network.md)'s honest
states, fixes that a partly kept voice is a voice. The decision is the
product owner's (2026-10-16): the sections that are here play; the first
section that isn't stops the voice at its start, and the stop is worded.

Read [`README.md`](README.md) in this directory first: it says what an adapter
may translate and what it may not weaken.

## Setup

- One signed-out device with clean reading, text-keep, and narration-keep
  state for two narrated books, as in
  [`voice-rides-along.md`](voice-rides-along.md).
- The first book's recording runs in **at least three short sections**, and
  its pinned alignment names a paragraph that the third section begins on, so
  the stop in step 4 is a known paragraph. The second book is narrated too; it
  is opened online and never played.
- The content service is reachable when the scenario begins, and ordinary
  reading conditions hold throughout.

## Stalling part of the keep

From the moment the first book's voice begins in step 1, **every request for
the recording's third section, and for any section after it, is accepted and
never answered**, while every other request, for text, alignment, and the
first two sections, is answered as before. The stall is the one
[`kept-on-a-stalled-network.md`](kept-on-a-stalled-network.md) defines,
applied to those requests alone. An iOS adapter may hold them open at its
transport boundary; a web adapter stalls them in the content service beneath
the service worker. This is how a keep stops partway in the world: the reader
does nothing, and the network simply stops answering while the first sections
are already on the device.

Sections kept must be whole: a section the stall caught halfway is absent,
never a kept fragment. That rule is
[`voice-rides-along.md`](voice-rides-along.md)'s, unchanged.

## The honest stop

When playback reaches a section that isn't on the device, with the network
stalled or gone:

- The transport shows paused, and the voice's position stands at that
  section's start: the first paragraph the section narrates, with nothing of
  it spoken. Nothing before it is repeated and nothing after it is skipped to.
- The control says so, in words exposed to the accessibility surface: the rest
  of the voice isn't on this device yet. Wording is the client's.
- The text stays readable. The reader's ordinary reading gesture still moves
  the page, and nothing on screen blocks the prose.
- The control stays pressable. A press tries again; with the network still
  stalled it resolves to the same worded answer within the bound below.

A product that already knows the section isn't kept and that the device is
offline may stop at once. A product that tries the network first gives up
after about 10 seconds of silence, as
[`voice-on-a-stalled-network.md`](voice-on-a-stalled-network.md) fixes.

## Timing

As [`voice-on-a-stalled-network.md`](voice-on-a-stalled-network.md): seconds
from the moment the adapter's action completes, reported by the adapter,
product promises rather than harness slack.

- **The first word of a partly kept voice, stalled: 3 seconds** from the
  press, as for a whole kept voice.
- **The honest stop: 12 seconds** from the moment the second section ends.

## Steps

**1. Open the first narrated book online and press play. Pause inside the
first section.**

The voice starts as [`play-and-pocket.md`](play-and-pocket.md) fixes and the
keep begins, with the control carrying its keep treatment. The first two
sections have time to land; the third never does, so the keep treatment is
still showing when the reader pauses, well inside the first section. The
transport shows paused.

**2. End the session, then stall the whole network. Open the first book at
its address again.**

- It opens from the keep within 3 seconds, at the reader's place.
- Within 3 seconds of the open the play control is offered as *plays*. A
  partly kept voice is not *can't play here*: the sections at the reader's
  place are on the device.

**3. Press play.**

- Within 1 second the control is *starting*; within 3 seconds the transport
  shows playing and the voice's position is visible, inside the paragraph
  where reading stood.
- The voice crosses the boundary between the first and second sections and
  the transport stays playing. Both are kept, and the seam is the player's
  business.

**4. Let the voice reach the third section.**

Within 12 seconds of the second section's end, the honest stop above:
paused, standing at the third section's first paragraph, worded, the text
still readable, the control still pressable.

**5. Restore the network and press play.**

The control is *starting* within 1 second; then the transport shows playing
and the voice continues from the third section's start: the position at the
moment of resume is the position at the stop, and it advances from there.
Nothing before the stop is spoken again. The keep finishes, and the keep
treatment clears without another press.

**6. Pause, end the session, and take the network away. Open the library.**

The network is *gone* here, not stalled, because a library's offline
knowledge is the platform's, and a stall tells it nothing. The library opens
from what it last knew, as [`library-open.md`](library-open.md) step 6 fixes.

- The first book's row offers its play control: its voice is on the device.
- The second book's row is not dimmed, because its text is kept, and offers
  **no play control**, because its voice is not. The library offers no play
  it cannot honor offline. The row remains an ordinary way into the book,
  where the control stands as *can't play here*.

## What this does not cover

- **Which sections a keep writes first.** This scenario's stall makes the
  kept sections the recording's first ones. A product that keeps in another
  order is not wrong; the rule is per section, at the moment playback reaches
  it.
- **A mark that stands inside an unkept section.** Pressing play with the
  reader's place already past what is on the device resolves as the honest
  stop would, at once, but no step here presses there.
- **The library's control for a partly kept voice.** Step 6 offers play for a
  voice that is wholly kept by then. Whether a row says *in part* is not fixed.
- **Eviction, storage pressure, and a damaged section**, as
  [`voice-rides-along.md`](voice-rides-along.md) leaves them.
- **The words.** That the stop is worded and accessible is fixed; the wording
  and drawing are the client's.
- **The device matrix**, declared per platform.

## What the next scenario would extend

1. **The keep resumes where it stopped.** With the network back, the product
   keeps only the sections it lacks rather than beginning again.
2. **A row that says in part.** The library marks a partly kept voice as such,
   if a surface for it is ever worth its chrome.
