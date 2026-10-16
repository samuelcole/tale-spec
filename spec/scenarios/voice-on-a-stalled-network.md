# Scenario: the voice on a stalled network

**The claim.** A kept voice is on the device, and a network that never answers
is not allowed to hold it hostage. Press play in a kept, narrated book with the
network stalled and the voice starts from the device at once, without first
waiting for the network to give up. A voice that was never kept does not
pretend: its control stays where the reader looks for it, dimmed, and a press
says in words that the voice isn't on this device yet. And every press on the
play control is answered on that control, from the press until the first word,
or until the product says why there will be no first word.

This is the extension [`kept-on-a-stalled-network.md`](kept-on-a-stalled-network.md)
names first, shaped like it. That scenario proved the text opens from the keep
before the network is consulted;
[`voice-rides-along.md`](voice-rides-along.md) proved the voice is kept by
playing and replays when the network is *gone*. Neither could tell a client
that consults its keep only after the network fails from one that consults it
first, because a gone network fails at once. Real networks fail more slowly.
Before this scenario, a client that fetched the alignment from the network
first, and installed the recording's remote addresses even when a complete kept
voice sat beside them, conformed. Its reader pressed play on a book they had
already heard, on a train between stations, and nothing answered for as long
as the transport's own timeout.

Read [`README.md`](README.md) in this directory first: it says what an adapter
may translate and what it may not weaken.

## Setup

The same as [`voice-rides-along.md`](voice-rides-along.md): one signed-out
device with clean reading, text-keep, and narration-keep state for two narrated
books; both at stable public addresses, with text long enough to read normally
and a recording in at least two short sections whose pinned alignment names
the exact loaded body; the content service reachable when the scenario begins;
ordinary reading conditions. The first book is played online and its voice
kept. The second is opened online and never played, so its text is kept while
its voice is not.

## The session boundary

The one [`open-and-read.md`](open-and-read.md) defines, unchanged.

## Stalling the network

[`kept-on-a-stalled-network.md`](kept-on-a-stalled-network.md) defines the
stall, and it applies here to **every request the product makes for either
book's text, alignment, or recording**: accepted, and never answered, for as
long as the step observes. The two substitutes that file forbids are forbidden
here for the same reasons. An offline flag is not a stall; a delay that
eventually answers is not a stall.

## One control, honest states

The play control is one control. It is never a second control, a dialog, or a
line of chrome elsewhere on the page, and it never disappears from a narrated
book: a reader who finds no control reads that as a book with no narration,
and absence must not mean that. What changes is its state, and every state is
exposed to assistive technology as well as to sight.

1. **Plays.** The ordinary control.
2. **Plays, keeping.** The ordinary control carrying the product's keep
   treatment while the recording is still being kept. The product shows one.
3. **Can't play here.** The control stays, dimmed. A press is answered at once
   with words, on or beside the control, saying the voice isn't on this device
   yet. No sound starts, nothing waits, and the control remains the way to
   try again once the network answers.
4. **Starting.** From the press until the first word.

A partly kept voice stands as *plays*: what happens when playback reaches a
section that isn't kept is [`voice-kept-in-part.md`](voice-kept-in-part.md)'s.
Exact wording and drawing are the client's.

## Starting

Between a press and the first word, a reader hears silence, and silence reads
as a press that did nothing. So the control answers the press itself, at once:

- **Visible.** The control's starting treatment is legible at a glance as a
  change to the control: a word, a different glyph, or a drawn mark. A change
  of opacity alone, or a pulse of it, is not a visible answer; it is what a
  reader took for nothing happening.
- **Accessible.** The control is exposed as busy, and its name or description
  says it is starting.
- **The same control.** It does not disappear, does not say playing before
  sound, and clears without a second press when sound begins.
- **Answered either way.** If sound cannot begin, the control returns to
  pressable and says why, in words, in its own place: that the voice isn't on
  this device yet, or that it didn't arrive. A press is never answered with
  silence that simply ends.

[`play-and-pocket.md`](play-and-pocket.md) fixed that a pending treatment
exists and is accessible; this section fixes what it must be.

## Timing

Adapters report seconds, measured from the moment the adapter's action
completes, meaning the press, the tap, or the navigation. These are product
promises, not harness slack. An adapter whose own machinery cannot observe
within a bound reports a red result, not a pass.

- **The starting state: 1 second** from the press. It is the answer to the
  press, so it appears with the press.
- **The first word of a kept voice, on a stalled network: 3 seconds** from the
  press, to the first moment the transport shows playing with the voice's
  position visible. That is long enough to read a kept alignment and open a
  kept recording from local storage, and far too short for any transport
  timeout to have fired first.
- **A kept book: 3 seconds** to open, and **3 seconds** from the open for its
  play control to be offered as *plays*, because a kept voice is offered
  without asking the network.
- **A voice that cannot start: 12 seconds.** A never-kept voice on a stalled
  network resolves to *can't play here* within 12 seconds of the book opening,
  and a press made before that resolves to its worded answer within 12
  seconds of the press. The product gives up after about 10 seconds in which
  nothing arrives; the rest is margin for observing it. The deadline is on
  silence, not on a download in progress.
- **The press on a dimmed control: 1 second** to its worded answer. The
  product already knows.
- **Online**, the first word has no bound here; the adapter reports the
  number so that it exists before and after a change.

## Steps

**1. Open the first narrated book online.**

[`voice-rides-along.md`](voice-rides-along.md) step 1: the book opens at its
cover and offers its ordinary play control, as *plays*. No control offers to
download, save, or keep the voice.

**2. Press play, and let the keep finish.**

Within 1 second of the press the control is *starting*, visibly and
accessibly. Then, without another press, the transport shows playing and the
voice's position advances. The adapter reports the seconds from the press to
the first word. Playback began from the network without waiting for the keep;
the control carries the keep treatment while the recording is kept, and the
reader stays until the keep has finished and the treatment has cleared.

**3. Pause.**

The transport shows paused and no sound plays. The text keep has its ordinary
chance to settle.

**4. End the session and open the second narrated book online. Never press
play.**

It opens and offers its ordinary control, idle. The second book's text has had
the same chance to keep as the first. Its voice has not.

**5. End the session, then stall the network.**

**6. Open the first book at its address again.**

- Within 3 seconds the book is open, from the keep, at the reader's place:
  the outcomes [`kept-on-a-stalled-network.md`](kept-on-a-stalled-network.md)
  step 3 fixes.
- Within 3 seconds of the open the play control is offered as *plays*. It is
  not dimmed, and nothing about it waits on the network.

**7. Press play.**

- Within 1 second the control is *starting*.
- Within 3 seconds the transport shows playing and the voice's position is
  visible: the first word, measured.
- The voice carries on through a section boundary and the transport stays
  playing. The kept voice is the recording, not a fragment, and no stalled
  request still in flight for this book changes anything the reader hears.
- No narration error is shown.

**8. Pause.**

**9. Still stalled, end the session and open the second book at its address.**

- It opens from its kept text within 3 seconds.
- Within 12 seconds of the open the play control stands as *can't play here*:
  present, dimmed, idle. Until the product has heard from the network or given
  up, the control may stand as *plays*, and a press in that window enters
  *starting* and resolves to the same worded answer within the bound. It does
  not disappear.
- No sound.

**10. Press the dimmed control.**

Within 1 second the control answers, in words exposed to the accessibility
surface, that the voice isn't on this device yet. The control stays as
*can't play here*, the transport stays idle, and no sound starts.

**11. Restore the network.**

Without another press, the control returns to *plays*: the outcome
[`voice-rides-along.md`](voice-rides-along.md) step 6 fixes. The transport
stays idle and no sound starts.

**12. Press play.**

The control is *starting* within 1 second, then the transport shows playing.
The adapter reports the seconds to the first word.

## What this does not cover

- **A partly kept voice.** Where a keep that stopped partway plays to, and
  what it says there, is [`voice-kept-in-part.md`](voice-kept-in-part.md).
- **A keep interrupted by the screen going away.** Whether a keep that began
  finishes without the reader is
  [`keep-outlives-the-screen.md`](keep-outlives-the-screen.md).
- **Freshness of a kept voice.** This scenario allows a kept alignment to be
  read while the network is up and requires only that it be read first when
  the network is stalled. Receiving a newer alignment for the next session is
  [`voice-rides-along.md`](voice-rides-along.md)'s named extension.
- **The library's play control.** Which rows offer play offline is fixed by
  [`voice-kept-in-part.md`](voice-kept-in-part.md).
- **The exact deadline, and a slow download.** About 10 seconds of silence is
  the product's choice; the scenario fixes only the bounds a reader can
  observe on a total stall. A recording arriving slowly must not be
  abandoned for being slow, which is required but not exercised here.
- **The words.** That the answer is worded and accessible is fixed; its exact
  wording and drawing are the client's.
- **The device matrix**, declared per platform.

## What the next scenario would extend

1. **The library on a stalled network.** The library opens from what it last
   knew, and a kept, narrated row's play control starts the kept voice as
   step 7 does here.
2. **A seek into an unkept stretch.** Scrubbing the voice past what is on the
   device, with the network stalled, resolves honestly rather than waiting.
