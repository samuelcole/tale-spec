# Scenario: leave and return

**The claim.** A reader can look back without losing their saved place. The
bottom track keeps the persisted high-water mark distinct from the current
viewport, and a quiet, accessible continue action returns exactly to the next
unread paragraph without counting the jump as reading.

This is the surface proof for [saved progress and the way
back](../presentation.md#saved-progress-and-the-way-back). It extends
[`open-and-read.md`](open-and-read.md)'s persisted resume boundary and
[`position-and-motion.md`](position-and-motion.md)'s product-movement rules.

## Setup

- One device, signed out, with ordinary motion enabled.
- A book with enough anchored body paragraphs to put a saved mark **S**, its
  next unread paragraph **U**, and an earlier paragraph **E** more than one
  viewport apart.
- A prior reading session has genuinely advanced the persisted furthest-read
  mark through **S** and ended. The scenario starts by reopening that same
  book, which lands at **U** under `open-and-read`.
- Default type size, no plan marks open, no passage fragment, and narration
  paused. No account or synced progress participates.
- The adapter observes rendered geometry, color, visibility, and the platform
  accessibility surface. It never reads the progress store or an internal
  reader model.

The adapter records the viewport and safe-area geometry. Percent positions are
compared at the rendered track: the exact numeric percent remains the existing
paragraph-count rule, while this scenario proves that the two visual signals
are independently wired to it.

## Steps

**1. Reopen the started book at U.**

One 3 px track is fixed to the bottom safe-area edge. Its background is
`rule-soft`; its saved fill runs from the leading edge to **S** in `muted`; and
one 2 px, half-opacity `primary` tick marks the current viewport at **U**. The
track is visual only, with no button, slider, adjustable, or progress-value
accessibility role.

**2. Scroll backward by genuine reader input until E is current and U is below
the viewport.**

The current tick moves left to **E** while the saved fill endpoint stays at
**S**. A fixed strip directly above the track becomes visible with one button
named **continue ↓**. The ordinary silent position line remains on **E**; the
track and strip do not change text geometry.

**3. Activate continue and let the movement settle.**

The page moves through intermediate positions and lands with **U** current.
The continue strip disappears. The saved fill endpoint is unchanged at **S**,
and the programmatic jump has not advanced the persisted reading position.

**4. End the session and reopen the book.**

The book again lands at **U**, proving the continue jump neither spent the
reading-intent window nor moved the saved mark. The track again shows the same
saved fill for **S** and current tick for **U**.

## Required starting result

This characterizes existing reference behavior. Before this scenario lands,
the web adapter records a green result against the shipped reader. The
unfinished native reader records an intentional red result because it has no
bottom progress track and no continue strip.

## What this does not cover

- Dragging, tapping, or otherwise seeking through the bottom track. The track
  is not a scrubber control.
- Start over or read from here. Those change the saved high-water mark and need
  their own confirmation and persistence proof.
- Account sync, remote progress arriving while the book is open, or conflicts
  between devices.
- Narration seeking, the player timeline, or any audio behavior.
- Dynamic Type, rotation, VoiceOver rotor order, or physical-device
  performance. Consuming clients declare those platform matrix cells.

## What the next scenario would extend

**Choose a new place** — use read from here to deliberately walk the saved
high-water mark backward, then start over to remove it entirely, proving both
confirmation paths and their persisted results.
