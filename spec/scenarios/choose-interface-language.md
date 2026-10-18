# Scenario: choose the interface language

**The claim.** A reader can choose the language Tale's controls speak, in the
reading preferences, without leaving the book. The choice outlives the
session. Choosing changes only the controls: the book, its language, and the
reader's place in it stay exactly where they were.

Read [`README.md`](README.md) and
[`interface-follows-the-device.md`](interface-follows-the-device.md) first;
this scenario uses its rules and observations. Its reading-preferences
surface and place observations are those of
[`reading-preferences.md`](reading-preferences.md).

## Portable rules

- **The control.** The reading preferences offer one control listing every
  interface language by its own name (`English`, `Español`), with the current
  one shown as selected. Choosing one applies it at once.
- **What persists.** The choice is local, like the theme and text size: it
  needs no account and persists across relaunch. It takes precedence over the
  device's languages until the reader chooses again.
- **What does not move.** Choosing never changes the open book, its address,
  its language, or the reader's place. A platform may rebuild its screen to
  apply the language; the reader still sees the same paragraph afterwards.

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
- An English fixture book at `/frankenstein-scenario`, long enough to read
  past its first block, as in `reading-preferences`.

## Steps

**1. Open the book, read to a block, and open the reading preferences.**

The controls are Spanish; the book is English. The reader's place is
captured.

**2. Choose English.**

The controls are English. The same book is open, still English, at the same
place.

**3. End the session, reopen the book, and open the reading preferences.**

The controls are still English, on a Spanish device: the choice persisted.
The reader is at the same place.

**4. Choose Español.**

The controls are Spanish; the same book, its language, and the place are
unchanged.

**5. End the session, reopen the book, and open the reading preferences.**

The controls are still Spanish.

## What this does not cover

- Syncing the choice across a signed-in reader's devices.
- Going back to "follow the device" after choosing: with two languages, the
  device's language is always one of the two choices.
- The reading language of
  [`read-in-your-language.md`](read-in-your-language.md), which this never
  changes.

## What the next scenario would extend

A signed-in reader's interface language following them to a new device.
