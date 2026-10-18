# Scenario: choose the interface language

**The claim.** A reader can choose the language Tale's controls speak, in the
reading preferences, without leaving the book. The choice outlives the
session. Choosing changes only the controls: the book, its language, and the
reader's place in it stay exactly where they were.

Read [`README.md`](README.md) and
[`interface-follows-the-device.md`](interface-follows-the-device.md) first;
this scenario uses its rules and observations. Its reading-preferences
surface and place observations are those of
[`reading-preferences.md`](reading-preferences.md) and
[`leave-and-return.md`](leave-and-return.md).

## Portable rules

- **The control.** The reading preferences offer one control listing every
  interface language by its own name (`English`, `Español`), with the current
  one shown as selected. Choosing one applies it at once.
- **What persists.** The choice is local, like the theme and text size: it
  needs no account and persists across relaunch. It takes precedence over the
  device's languages until the reader chooses again.
- **What does not move.** Choosing never changes the open book, its
  language, or the reader's saved place. On the web it moves the address to
  the chosen language's
  ([`address-speaks-its-language.md`](address-speaks-its-language.md)); the
  book's identity is the same at either. `savedFillPosition` is that saved
  place as the progress track draws it (`leave-and-return`).
- **Where the reader stays.** Choosing a language leaves the reader where they
  chose it, like changing the text size or the theme: the reading preferences
  stay open and the screen does not move — at the top of the book, with the
  cover on screen, when that is where the preferences are. A platform may
  rebuild its screen to apply the language; if it does, it restores both, and
  never treats the choice as a reopening that carries the reader to their
  saved place. Reopening later still does.

## Platform note

Where the operating system already gives every app a per-app language setting
(iOS and iPadOS: Settings › Tale › Language), that system setting *is* the
choice; a client may defer to it instead of offering its own control, and
declares this scenario not applicable with that explanation.
[`interface-follows-the-device.md`](interface-follows-the-device.md) still
applies to it in full.

## Setup

- One signed-out device with no restored state, whose preferred language is
  Spanish.
- An English fixture book at `/dracula-scenario`, long enough to read
  past its first block, as in `reading-preferences`.

## Steps

**1. Open the book, read to a block, and open the reading preferences.**

The controls are Spanish; the book is English. The reader's saved place, and
the block reopening would land on, are captured.

**2. Choose English.**

The controls are English. The same book is open, still English, and the
saved place has not moved. The preferences are still open and the cover is
still on screen: the reader is where they made the choice.

**3. End the session, reopen the book, and open the reading preferences.**

The controls are still English, on a Spanish device: the choice persisted.
The reader is back at their place.

**4. Choose Español.**

The controls are Spanish; the same book, its language, and the saved place
are unchanged, and the reader is still at the open preferences.

**5. End the session, reopen the book, and open the reading preferences.**

The controls are still Spanish, and the reader is back at their place.

## What this does not cover

- Syncing the choice across a signed-in reader's devices.
- Going back to "follow the device" after choosing: with two languages, the
  device's language is always one of the two choices.
- The reading language of
  [`read-in-your-language.md`](read-in-your-language.md), which this never
  changes.

## What the next scenario would extend

A signed-in reader's interface language following them to a new device.
