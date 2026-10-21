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
[`play-and-pocket.md`](play-and-pocket.md) defines it. Two observations are
new here, and both are read from the position the surface reports:

- `voiceSection` is the recording section that position falls in, counted
  from 0.
- `voiceBegan` is where the first position the playing surface reported
  stands:
  - `at-recording-start` if it is within 1 second of its section's start, and
    before that section's first narrated paragraph;
  - `inside-reading-block` if it is inside the narrated span of the paragraph
    at the top of the settled screen;
  - `elsewhere` otherwise.

The adapter compares positions only against the fixture's own published
section runtimes and paragraph begins. It never reads the player's internals.

## Steps

**1. Open the book.** It opens at its cover, with its play control.

**2. Press play.** The voice plays from the very start of the first recording,
before the first narrated paragraph. The highlight may wait for timed text.
The sound does not.

**3. Pause.**

**4. Read to H**, the first narrated paragraph of the second recording, and
settle.

**5. Press play.** The voice plays from the start of the second recording,
before **H**'s own begin. The reader hears that recording's announcement.

**6. Pause.**

**7. Read on to L** and settle.

**8. Press play.** The voice begins inside **L**'s narrated span, in the second
recording. Mid-recording, nothing before the reading place is replayed.

## What this scenario does not cover

- **Resuming after a pause.** A pause holds its place exactly, which is
  [`play-and-pocket.md`](play-and-pocket.md)'s business. It is untouched here.
- **A recording whose first narrated paragraph begins at 0.** The rule gives
  the same second either way, so there is nothing to observe.
- **Highlight timing during an untimed opening.** The voice plays it. Whether
  and how the page follows a voice that is ahead of the timed text is not
  decided here.
- **The device matrix.** Declared per platform, not here.
