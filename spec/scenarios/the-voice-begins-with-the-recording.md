# Scenario: the voice begins with the recording

**The claim.** Press play at the top of a book and you hear the recording from
its first word. A volunteer's announcement of the work, its reader and its
project comes first, and then the whole opening. Press play at the head of a
later recording and you hear that recording's own announcement. Press play
partway into a recording and the voice begins where you are reading, as it
always has. This is [`spec/timeline.md`](../timeline.md)'s `voice-start` at
the surface.

A recording opens with words the text does not carry. Skipping past them to
the first aligned sentence takes away the volunteers' and the project's
credit. It also takes away the opening itself whenever the alignment left that
opening untimed. Neither is the reader's to lose.

Read [`README.md`](README.md) in this directory first. It says what an adapter
may translate and what it may not weaken.

## Setup

- One device, signed out, no account, and no recorded position for this book.
  This is exactly the baseline of [`open-and-read.md`](open-and-read.md).
- A narrated book whose recording runs in at least two sections. In each of
  the first two sections, spoken words come before that section's first
  narrated paragraph: the fixture's alignment gives that paragraph a begin
  well after the section's start, at least 5 seconds. Otherwise "began at the
  recording" and "began at the first aligned paragraph" would be the same
  observation.
- The fixture names two paragraphs. **H** is the first narrated paragraph of
  the second section. **L** is a narrated paragraph later in the same section,
  far enough down to be read to.
- Ordinary reading conditions: default type size, no plan marks open, no
  passage fragment in the address. Narration is not playing.

## The transport

This is the product's playing surface, as
[`play-and-pocket.md`](play-and-pocket.md) defines it: the play control, and
the paragraph the voice visibly occupies. A recording's opening carries no
paragraph. `narrated-paragraph-at` names none there, so nothing is lit until
the voice reaches timed text. That makes the opening visible without a clock:
a press that began in the opening lights nothing at first. A press that began
at a paragraph lights it at once.

The scenario adds three observations, all read from that surface after the
transport shows playing:

- `litAtStart` is what the page lights at the first observation after the
  transport shows playing: `nothing` or `a-paragraph`.
- `firstLit` is the fixture role of the first paragraph lit after that:
  `first-narrated-of-first-recording`, `first-narrated-of-second-recording`
  (**H**), `later-in-second-recording` (**L**), or `other`.
- `pageHeld` is `true` when the paragraph at the top of the settled screen is
  unchanged from the press until `firstLit` lights. The page does not follow
  a voice that is reading nothing, and in particular it does not go back to
  the previous recording's last paragraph.

The fixture's gap of at least 5 seconds before each recording's first
narrated paragraph is what makes `nothing` observable rather than a race.
The exact second a press begins at is `voice-start`'s, and its vectors pin
it. The surface proves the reader-visible consequence: the opening is heard,
and the right paragraph lights after it.

## Steps

**1. Open the book.** It opens at its cover, with its play control.

**2. Press play.** The voice plays the first recording's opening. Nothing is
lit while it does. Then the first recording's first narrated paragraph
lights.

**3. Pause.**

**4. Read to H**, the first narrated paragraph of the second recording, and
settle.

**5. Press play.** The voice plays the second recording's announcement.
Nothing is lit, and the page stays on **H**; it does not go back to the
previous recording's last paragraph. Then **H** lights.

**6. Pause.**

**7. Read on to L** and settle.

**8. Press play.** **L** lights at once. Mid-recording, nothing before the
reading place is replayed.

## What this scenario does not cover

- **Resuming after a pause.** A pause holds its place exactly, which is
  [`play-and-pocket.md`](play-and-pocket.md)'s business. It is untouched here.
- **A recording whose first narrated paragraph begins at 0.** The rule gives
  the same second either way, so there is nothing to observe.
- **Words inside an untimed opening.** Nothing is lit while the voice reads
  paragraphs the alignment left untimed. Lighting them is the alignment's job,
  not this scenario's.
- **The device matrix.** Declared per platform, not here.
