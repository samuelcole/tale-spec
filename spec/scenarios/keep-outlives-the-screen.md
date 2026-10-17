# Scenario: the keep outlives the screen

**The claim.** A voice that has begun keeping finishes keeping without the
reader having to come back for it. Pause the voice, put the screen away, and
the keep carries on; return, and the whole voice is on the device, ready to
play through with no network at all.

[`voice-rides-along.md`](voice-rides-along.md) keeps a voice by playing and
says the keep runs beside playback. It never looks away. A client whose keep
stopped the moment the platform set the app aside conformed, and its reader
found ten sections of twelve on the phone the next morning, with no voice
offered at all. That reader pressed play, read a little, paused, and locked
the phone, which is what a reader does. The keep must survive exactly that.

Read [`README.md`](README.md) in this directory first: it says what an adapter
may translate and what it may not weaken.

## Setup

- One signed-out device with clean reading, text-keep, and narration-keep
  state for one narrated book, as in
  [`voice-rides-along.md`](voice-rides-along.md).
- The book's recording runs in **at least three short sections** whose pinned
  alignment names the exact loaded body.
- A network that answers every request, but answers the recording's later
  sections **slowly**: slowly enough that the keep is still in flight when the
  reader has paused and put the screen away, and finishes a known number of
  seconds later. This is a delay that eventually answers, which is allowed,
  not a stall. An iOS adapter may delay at its transport boundary; a web
  adapter delays in the content service beneath the service worker.
- The content service is reachable throughout, and ordinary reading
  conditions hold.

## Putting the screen away, and staying away

The act is the one [`play-and-pocket.md`](play-and-pocket.md) defines, with
one more requirement. That scenario puts the screen away while the voice
plays, which keeps a native app alive for its sound. Here the voice is
**paused** first, so nothing keeps the app in the platform's foreground
graces, and the reader stays away **long enough for the platform to set an
idle app aside** as it ordinarily would. On iOS that is going home, or locking
the phone, and remaining there past the platform's background allowance for a
silent app. An adapter that cannot hold the device away that long reports a
red result, not a shorter wait. On the web the act is another tab or window
taking the screen, which is the weakest form the platform offers, and the
adapter says so.

The keep must survive the act. It may finish while the screen is away or
after the reader returns; it may not stop because the screen went away and
wait for the reader to press play again.

## Steps

**1. Open the book online and press play.**

The voice starts, as [`play-and-pocket.md`](play-and-pocket.md) fixes, and the
control carries its keep treatment: the keep is in flight.

**2. Pause, with the keep still in flight.**

The transport shows paused. The keep treatment is still showing: the later
sections are still arriving.

**3. Put the screen away and stay away, longer than the keep needs.**

**4. Return.**

- The control shows *plays*, with no keep treatment: the keep finished.
- The transport shows paused. Nothing started on its own, and no sound plays.

**5. End the session and take the network away. Open the book and press play.**

- The kept text opens, and the control is offered as *plays*.
- Within 3 seconds of the press the transport shows playing.
- The voice runs across every section boundary the recording has and the
  transport stays playing past the last one, with no narration error: every
  section is on the device, including the ones that were still arriving when
  the screen went away.

## What this does not cover

- **A keep interrupted for good.** A network that stops answering while the
  screen is away is [`voice-kept-in-part.md`](voice-kept-in-part.md)'s
  partly kept voice, reached a different way.
- **Storage pressure while away.** What the platform may discard from a
  backgrounded app is eviction policy, which no scenario yet fixes.
- **A keep that begins while the screen is away.** Only a keep already in
  flight is required to survive here.
- **The device matrix**, declared per platform, and the exact background
  allowance each platform grants, which the adapter must exceed rather than
  state.

## What the next scenario would extend

1. **A keep across a relaunch.** End the session mid-keep and relaunch: the
   keep resumes where it stopped, without a press.
2. **A keep the platform ends.** The platform's own limit on background work
   is reached; the product keeps what is whole and says what it has.
