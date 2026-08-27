# Scenario: choose a new place

**The claim.** A reader may deliberately move the saved high-water mark
backward or remove it entirely. Both destructive choices ask twice, act on the
one visible place they name, and survive a new session.

This extends [`leave-and-return.md`](leave-and-return.md). That scenario keeps
the saved mark fixed while a reader looks back and returns to it; this one owns
the two explicit ways the reader may change that mark.

## Setup

- One device, signed out, with ordinary motion enabled.
- A book with enough anchored body paragraphs to put a saved mark **S**, its
  next unread paragraph **U**, and an earlier paragraph **E** more than one
  viewport apart.
- A prior reading session has genuinely advanced the persisted mark through
  **S** and ended. Reopening lands at **U** under `open-and-read`.
- Default type size, no plan marks open, no passage fragment, and narration
  paused. No account or synced progress participates.
- The adapter observes only the rendered page and accessibility surface. It
  never reads the progress store or an internal reader model.

`read from here` belongs to the first arrival-dimmed paragraph whose leading
edge is visible. The horizontal accent-red rule overlays that edge without
changing the paragraph's box. Choosing **E** means the new saved boundary is
the paragraph immediately before **E**, so a new session resumes with **E** as
the first unread paragraph.

Both actions use the same two-press confirmation vocabulary: the first
activation changes the accessible label to **are you sure?** and changes
nothing else; the second performs the action. Moving to a different target or
ending the session disarms an unfinished confirmation.

## Steps

**1. Reopen the started book and look back to E by genuine reader input.**

The saved progress fill still ends at **S**. At **E**'s visible leading edge,
one accessible button says **read from here**. Its accent-red horizontal rule
and label overlay the book without changing text geometry.

**2. Activate read from here once.**

The same button now says **are you sure?**. The saved fill, current paragraph,
and text geometry are unchanged.

**3. Activate it a second time.**

**E** becomes the first unread paragraph. The saved fill moves to the paragraph
immediately before **E**, the current tick remains at **E**, and the rewind
control disappears because **E** is no longer arrival-dimmed.

**4. End the session and reopen the book.**

The book lands at **E** with the rewound saved fill still immediately before
it. This proves the backward choice persisted rather than merely repainting
the current page.

**5. Scroll back to the cover by genuine reader input.**

The cover offers one accessible **(start over)** button because this book still
has saved progress.

**6. Activate start over once.**

The same button now says **are you sure?**. The saved fill and cover position
are unchanged.

**7. Activate it a second time.**

The page remains on the cover, the saved fill becomes empty, all arrival
dimming disappears, and the start-over control disappears. Because the control
is activated on the cover, this scenario does not make a separate motion claim;
the presentation scenario owns motion behavior when a recovery action moves the
page.

**8. End the session and reopen the book.**

The clean cover appears again with no saved fill, no arrival-dimmed paragraph,
and no start-over control. The next genuine reading gesture begins a new mark
from the start of the book.

## Required starting result

This characterizes existing reference behavior. Before this scenario lands,
the web adapter records a green result against the shipped reader. An
unfinished native reader records an intentional red result because it exposes
neither destructive recovery control.

## What this does not cover

- Account sync, remote progress arriving while the book is open, or
  cross-device rewind conflicts.
- Narration seeking or the audio position credited across a seek.
- Dragging, tapping, or otherwise seeking through the bottom progress track.
- Dynamic Type, rotation, VoiceOver rotor order, or physical-device
  performance. Consuming clients declare those platform matrix cells.

## What the next scenario would extend

**A voice that rides along** — delayed, failed, and offline narration fetch;
visible preparation and failure; and the kept audio sections that make replay
honest with no network.
