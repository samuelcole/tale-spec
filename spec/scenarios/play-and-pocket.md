# Scenario: play and pocket

**The claim.** A book with a recording is read and heard at once
([`spec/timeline.md`](../timeline.md)). Press play and the voice starts where
your reading stands; put the screen away and the voice carries on, across the
recording's own seams, until you stop it; stop and start again and it holds
its place exactly; and listening moves the one reading mark the same way
reading moves it, so the book opens where the voice reached.

The pieces with prose already: the payload declares narration only when
playable audio and a usable alignment exist, fetched lazily on the first play
gesture ([`spec/payload.md`](../payload.md), "Narration and alignment");
where the voice starts is `begin-at-or-after-anchor` and where it stands is
`floor-index` over the paragraph begins, both in
[`spec/timeline.md`](../timeline.md) with their vectors; and the mark's own
rules are [`spec/progress.md`](../progress.md)'s. What no area yet fixes —
a play/pause machine, the app running with the screen away — this scenario
fixes at the surface and nowhere deeper.

Read [`README.md`](README.md) in this directory first: it says what an
adapter may translate and what it may not weaken.

## Setup

- One device, signed out, no account, and no recorded position for this book —
  exactly the baseline of [`open-and-read.md`](open-and-read.md).
- A narrated book: its payload declares `narration`, its recording runs in at
  least two sections with the first short enough to cross in one sitting, and
  its pinned fixture alignment covers the opening paragraphs so every span the
  outcomes name is known. The alignment response can be held briefly after the
  first play gesture, so the surface can be observed while sound is genuinely
  pending rather than racing a local response. The reference fixture is the
  curated `frankenstein-scenario` with its pinned fixture recording and
  alignment.
- Ordinary reading conditions: default type size, no plan marks open, no
  passage fragment in the address. Narration is not playing — until step 1
  starts it.

## Putting the screen away

Step 2 takes the screen away from the book while the voice plays. The act is
the platform's ordinary gesture for being done looking — locking the phone or
going home on iOS, another tab or window taking the screen on the web — and
it is defined by what it does and does not do. It must:

1. **take the reading surface out of the reader's sight** — the book is no
   longer what the device shows;
2. **leave the process and the platform's media pathway alive** — this is not
   the session boundary, nothing is terminated, and the platform is given its
   ordinary chance to keep sound running without a visible page; and
3. **be the genuine act** — a real press or a real tab, through the
   platform's input path. Posting lifecycle notifications, spoofing a
   visibility state, or covering the app with the harness's own chrome
   simulates the state without performing the act, and proves nothing about
   what the product does when a reader actually pockets the phone.

An adapter that cannot perform its platform's strictest form of the act may
perform the nearest one the same platform pathway serves — on iOS, going home
exercises the same background-audio pathway the lock button does — and says
so. The platform surfaces this scenario deliberately does not reach are
listed under what it does not cover.

## The transport

The product's playing surface: whatever the product itself offers that says
the voice is playing or paused and where it stands. On the web that is the
player control and the paragraph the voice visibly occupies; in an app it is
the play control and the position it speaks through the accessibility
surface. Every outcome below about "the voice" is read from that surface —
never from the player's internals, a media API's private state, or the
harness's own clock arithmetic beyond comparing positions the surface
reported.

The session boundary in step 4 is the one
[`open-and-read.md`](open-and-read.md) defines; this scenario adds nothing to
it.

## Steps

**1. Open the book, read down into the prose, and press play.**

The reader scrolls a real gesture or two down the prose and settles; call the
paragraph at the top of the settled screen **P**. A play control stands with
the book — it exists because this book is narrated, and only because of that:
a book without narration offers none, which is
[`kept-on-open.md`](kept-on-open.md)'s no-control outcome, still true.
Activating it is a genuine press. While the alignment and recording are still
on their way, the transport immediately says it is preparing and gives the
reader a visible pending treatment on the same control. The play control does
not disappear, claim to be playing, or sit visually unchanged through the
silence. This state is available to assistive technology as well as sight.

When sound is ready, the preparing treatment clears without another press.

The transport shows playing, and the voice stands inside **P**'s narrated
span: playback began where reading stands — not at the top of the book, not
at zero, not at wherever a player last stopped. This is
`begin-at-or-after-anchor` at the surface.

**2. Put the screen away, and stay away past the recording's first seam.**

The screen goes away while the voice is inside the first audio section. The
reader stays away long enough that the recording's first section ends and its
second begins — the fixture makes that a known handful of seconds.

On return, nothing has stopped: the transport still shows playing, and its
position lies beyond the first section's end. The seam between one audio file
and the next was the player's business and nobody else's — no press, no
pause, no gap a reader had to notice, no book that "just stopped" the moment
its screen went dark.

**3. Stop the voice, start it again, and then stop it for good.**

Back with the book, the reader presses the transport once. It shows paused,
and its position stands where the voice stopped — inside the paragraph the
voice had reached. The position does not move while paused.

Press again. The voice continues from exactly where it stopped: the position
at the moment of resume is the position at pause, and it advances from
there. Nothing before the pause is spoken again — a pause is a held breath,
not a walk back to the top of the paragraph.

The reader presses once more and leaves the voice stopped. Call the
paragraph it last occupied **K**: further into the prose than **P**, and the
furthest the voice ever reached.

**4. End the session, then open the book again at its address.**

The book opens exactly where [`open-and-read.md`](open-and-read.md) step 3
says a resumed book opens — at the paragraph after the furthest one reached,
dimmed above it, ink from it down. And the furthest one reached is **K**: the
voice carried the mark forward the same way reading carries it, into every
paragraph it entered, and no further. One mark, moved by reading and by
hearing alike; not two positions quietly disagreeing about where the reader
is.

## What this does not cover

- **The locked screen's own controls.** The platform's media surface — the
  lock-screen tile, an earbud's buttons, a watch, a car — is fed by the
  product and drives the same transport, but no honest harness on either
  platform can press those surfaces: they belong to the platform, not the
  page under test. Their evidence is each platform's lane-1 proof that the
  platform's remote commands drive the one transport, and a recorded device
  run. A step here would be a permanently red step for every adapter, which
  serves nobody.
- **The page while the voice plays.** Whether the spoken word lights up,
  whether the page follows the voice, and who wins when the reader scrolls
  mid-playback is the next scenario — the voice lighting the page — and the
  narration-arbitration territory tale-spec deliberately reserves. Between
  pressing play and pressing pause, this scenario never looks at the page.
- **Seeking.** Nothing here scrubs, skips, or jumps the voice. What a seek
  does to the transport, and the rule that crossing a seek credits nothing to
  the mark, is future vector territory alongside the next scenario.
- **Failure copy.** A failed alignment or recording must return to an honest,
  pressable transport rather than remain preparing, but what words explain the
  failure is not decided here.
- **Keeping the voice.** Audio kept on the device by playing — and a relaunch
  offline that still plays — is
  [`kept-on-open.md`](kept-on-open.md)'s reserved "voice rides along"
  extension, unchanged by this file.
- **Interruptions and routes.** A phone call arriving, headphones unplugged,
  another app taking the audio session: device territory, evidenced by device
  runs, not steps here.
- **A listening position of its own.** The transport's media time lives and
  dies with the session; no field of
  [`spec/progress.md`](../progress.md)'s record carries it, and this scenario
  requires only that the *mark* survives the boundary. Whether a book should
  reopen its *voice* mid-paragraph across sessions is undecided territory.
- **A book whose narration ends before its text**, and a play pressed where
  `begin-at-or-after-anchor` finds nothing: unspecified at the surface, and
  deliberately not decided here.
- **The device matrix.** Declared per platform, not here.

## What the next scenario would extend

1. **The voice lights the page** — the same session, eyes on the screen:
   the spoken word carries its highlight, the page follows under the
   documented policy, and a genuine reader scroll wins immediately. That
   scenario finishes the narration-arbitration area this one deliberately
   leaves untouched.
2. **The voice rides along** — play while online, relaunch with the network
   gone, press play: opening kept the text, playing kept the voice.
   [`kept-on-open.md`](kept-on-open.md) already names it.
3. **A seek and its credit** — scrub the voice somewhere else and prove the
   mark never follows a jump, only a listen.
