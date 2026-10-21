# Scenario: the voice brings the new edition

**The claim.** Pressing play on a book always plays. Tale re-imports books to
fix them, and every re-import is a new edition. A device that kept a book
before the re-import opens the old edition from the keep, as
[`kept-on-open.md`](kept-on-open.md) requires. The service, though, sends only
the current edition's voice. That voice is timed to the new text and names it
exactly ([`spec/payload.md`](../payload.md)), so it can never play over the
old text. The press therefore brings the new edition onto the screen at the
reader's place, and the voice plays there.

The reader asked for the voice, and the new edition is the only text the voice
can follow. A press that answered "the service didn't send the voice" would be
false: the service sent it. Leaving and reopening the book would fix it, but
that is a chore the product asked the reader to do for it.

This is the one moment text may change under a reader mid-session. The press
asks for it, and it keeps the reader's place by the rules of
[`a-new-edition-keeps-your-place.md`](a-new-edition-keeps-your-place.md). At
any other moment, a newer edition still waits for the next open.

Read [`README.md`](README.md) in this directory first. It says what an adapter
may translate and what it may not weaken.

**Required starting state:** red on iOS. When this was written, the iOS reader
rejected the new edition's voice, said "tale.fyi didn't send the voice.", and
kept saying it until the book was reopened. The web adapter records the web's
own starting state.

## Setup

- One device, signed out, no account, no synced progress, and no kept book or
  voice for the fixture tale.
- A narrated tale served in two editions, both on stable anchors. The adapter
  decides how to publish each edition. It publishes each one only where this
  scenario says, and the client learns of it the way it learns of any new
  edition. Each edition is served with its own voice, and the service only
  ever serves the current edition's voice, as production does.
  1. **Edition 1** holds two consecutive narrated paragraphs in the middle of
     a recording, **P** and then **S**. They are far enough into the book
     that reading to P puts the cover well above the screen.
  2. **Edition 2** inserts a new paragraph before P and changes one word of
     S's text. It is otherwise unchanged. Its alignment times S, so a press
     with S at the reading line lights S at once.
- The content service is reachable throughout.
- Ordinary reading conditions: default type size, no plan marks open, no
  passage fragment in the address. The voice has never played on this device.

## How the editions are told apart

`sWording` is the edition whose wording of S is on screen: `edition-1` or
`edition-2`. The adapter reads it from S's rendered or accessible text, never
from a store or a payload. The one changed word is what makes the old edition
on screen observable rather than inferred.

The transport and its lit paragraph are
[`play-and-pocket.md`](play-and-pocket.md)'s.
[`the-voice-begins-with-the-recording.md`](the-voice-begins-with-the-recording.md)
defines `litAtStart`, `firstLit` and `pageHeld`. `playerNoteFailure` watches
the line the play control shows beside itself
([`voice-on-a-stalled-network.md`](voice-on-a-stalled-network.md)) from the
press until the transport shows playing. It is `never-shown` if that line
never carried a failure sentence, and `shown` otherwise.

## Steps

**1. Open edition 1 fresh.** The cover is on screen and the play control is
available.

**2. Read to P and settle.** P is at the top of the screen. The book is now
kept.

**3. End the session, publish edition 2, and open the book.** The book opens
from the keep and resumes as [`open-and-read.md`](open-and-read.md) fixes, so
S, the paragraph after P, is at the top of the screen. S still has edition 1's
wording. Edition 2 has arrived or is arriving in the background, and it waits.

**4. Press play.** The transport shows playing, and S lights at once. S is
still at the top of the screen, now in edition 2's wording. Before the voice
began, the page did not move to the cover, to the inserted paragraph, or to
any other paragraph. From the press on, the control never says the voice
wasn't sent, or any other failure.

**5. Pause.**

## What this does not cover

- **The next open.** The new edition is the one kept, and
  [`kept-on-open.md`](kept-on-open.md)'s keep rules already open it.
- **A press with no network.** No voice can come, so this is
  [`voice-on-a-stalled-network.md`](voice-on-a-stalled-network.md)'s
  territory. Its honest states apply unchanged, and the old edition stays on
  screen.
- **A voice already kept for the old edition.** It plays the old edition from
  the device, because a kept voice names the text it was timed to. When it is
  replaced belongs to the keep's freshness rules, which no scenario fixes yet.
- **A voice that names an older edition than the one on screen.** A stale
  response is rejected, as [`spec/payload.md`](../payload.md) already
  requires. Nothing here swaps backwards.
- **Marks and plans across the swap.** They land by the rules of
  [`a-new-edition-keeps-your-place.md`](a-new-edition-keeps-your-place.md).
  This scenario holds no marks.
- **The device matrix.** Declared per platform, not here.
