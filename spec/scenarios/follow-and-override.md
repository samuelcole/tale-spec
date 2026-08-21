# Scenario: follow and override

**The claim.** While narration plays, the book itself shows where the voice is:
the spoken paragraph carries a word-height gutter line grown to the active
word's rendered bottom, and the page follows that paragraph in a comfortable
reading band. Automatic movement is not reading. A genuine reader scroll takes
control immediately; follow returns only after the documented quiet policy.

This scenario extends [`play-and-pocket.md`](play-and-pocket.md) with eyes on
the page. The pure geometry is `follow-scroll-top` in
[`spec/reader.md`](../reader.md), the word cut is in
[`spec/timeline.md`](../timeline.md), the raw-input decision is solely
[`spec/intent.md`](../intent.md), and the resulting hand-off is
[`spec/follow-scroll.md`](../follow-scroll.md). Read this directory's
[`README.md`](README.md) first: every observation here comes from the real
rendered or accessible product surface.

## Setup

- One device, signed out, no account, and no recorded position for this book.
- The narrated fixture from `play-and-pocket`, with a first narrated paragraph
  long enough for follow-scroll to move the page before narration enters the
  next paragraph, and later aligned paragraphs on both sides of an audio-section
  seam.
- Ordinary reading conditions: default type size, no plan marks open, no
  passage fragment, and narration initially paused.

An adapter may choose exact fixture paragraphs and waiting bounds. It records
those choices and observes position from rendered text and the product's
accessibility surface, never from media time, a progress store, or a test-only
state channel.

## The lit position

The **lit position** is the paragraph visibly owned by narration plus the
gutter line's rendered bottom inside it. The line ends on a rendered word box,
not between lines or at a height calculated from raw character count. As the
voice advances, the lit position may hold on one word and then move forward;
it never moves backward during continuous playback.

## Steps

**1. Press play without first reading, and let the voice move the page inside
the opening paragraph.**

The transport shows playing. The opening narrated paragraph becomes lit, its
gutter line ends at a rendered word bottom, and the page moves enough to keep
that lit position in its comfortable band. Stop the voice before it enters the
next paragraph, end the session, and open the book again.

The book opens fresh at its cover with no prose dimmed. The voice moved the
page, but the reader did not read it: a transport press and a programmatic
follow-scroll cannot spend the intent window the press happened to open.

**2. Start again from a genuinely selected paragraph, then scroll within that
same narrated paragraph.**

Use a real reading gesture to select a narrated paragraph **P**, then press
play. The voice starts in **P**, lights it, and follows it. While the voice is
still inside **P**, use another real reading gesture that leaves **P** as the
reader's selected paragraph but moves the lit position outside the comfortable
band.

Playback continues without a seek or hiccup, and the page stays where the
reader put it. Automatic follow remains suppressed for 2,500 ms after the most
recent genuine scroll. Once that full quiet interval has elapsed, the page may
follow the still-current voice again; it must not do so sooner. A second scroll
inside **P** restarts the whole interval.

**3. Scroll to a different paragraph while the voice plays.**

Use a real reading gesture to select a paragraph **Q** different from the
paragraph currently lit. The reader's paragraph and position line move to
**Q**, and the transport pauses immediately. The narration line remains at the
last spoken word; no automatic movement pulls the page back after the pause.
If **Q** advances the reading high-water mark, that genuine position persists
under the ordinary reading rules.

**4. Resume from the reader's paragraph.**

Press play. Narration resolves the first aligned paragraph at or after **Q**,
lights it, and resumes follow from there. A same-paragraph pause and play would
instead preserve the exact lit position. Continuous playback across an audio
section keeps the voice lit and following without a reader-visible seam.

## Required starting result

This is new surface behavior as a portable claim. At authorship, every client
records a red result: the web adapter exposes the transport-opened intent-window
progress defect, and the unfinished native reader has no word lighting or
follow-scroll surface. Product implementation begins only from those runnable
failures.

## What this does not cover

- Highlight color, spring constants, and other animation styling. Product
  design owns them; this scenario fixes the semantic word edge and hand-off.
- Seeking through a scrubber. `spec/follow-scroll.md` fixes its no-credit
  semantics, but no portable surface gesture is chosen here.
- VoiceOver rotor navigation, Reduce Motion appearance, Dynamic Type, rotation,
  and long-book performance. They are platform matrix cells and device gates;
  omitting them from this one run is not evidence that they pass.
- Background playback controls and session persistence beyond the mark. Those
  remain `play-and-pocket` territory.

## What the next scenario would extend

**The voice rides along** — play while online, relaunch with the network gone,
and play the kept recording. `kept-on-open.md` already reserves that extension.
