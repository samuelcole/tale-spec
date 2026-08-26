# Scenario: reading preferences

**The claim.** A reader can make the book face larger and choose light or dark
paper without changing their whole device. Both choices live behind one quiet,
accessible disclosure, persist locally without an account, and change neither
the saved reading mark nor the next unread passage.

This is the surface proof for [Reader choices](../presentation.md#reader-choices).
Read [`README.md`](README.md) first: every observation comes from the rendered
or accessible product surface, never its preference or progress stores.

## Setup

- One signed-out device with no saved preferences and no recorded position for
  the book.
- The platform remains in one stable appearance for the session; call that
  starting appearance **A**.
- A book at a stable address with a body paragraph **P** followed by enough
  text to identify P's successor **U** after a new session.
- Default text size, no narration playing, no plan editor, and no fragment in
  the address.

The adapter records the platform appearance, viewport, and accessibility text
setting it used. A client may render its preferences as a popover, menu, or
panel, but the disclosure and every choice are ordinary accessible controls.

## Steps

**1. Read to P, let the page settle, and open reading preferences.**

The same quiet disclosure that opened the controls remains visibly open. It
offers a sample of the book face, book text size at `default`, and appearance
at `system`. Capture the selected paragraph P, its successor U, the rendered
default body size, and the starting appearance A.

**2. Increase book text size once.**

The choice becomes `large` and the rendered body size grows. Cover and chrome
sizes are unchanged.

**3. Toggle light/dark appearance.**

The choice becomes an explicit `light` or `dark`, the rendered paper changes
away from A, and the large body size stays put.

**4. End the session, open the same book again, then open preferences.**

The explicit size and appearance are present on the first rendered page. The
book resumes at U and the dim boundary is P: neither reflow nor repaint moved
the inclusive reading mark.

**5. Choose to follow the device again.**

Appearance returns to `system` and A while the large size remains selected.
The resumed passage and dim boundary do not move.

**6. End the session, open the same book once more, then open preferences.**

The large size still persists, appearance still follows the device, and the
book opens at U with P as its dim boundary.

## Required starting result

This characterizes existing reference behavior. Before implementation, the
web adapter records green against the shipped reader and the unfinished native
adapter records intentional red because it has no preferences disclosure or
manual appearance choice.

## What this does not cover

- Author-owned `serif` / `sans` / `mono` presentation or the `nonfiction`
  badge. Those travel with the payload and are not reader preferences.
- Account preference sync. These choices must work signed out and persist on
  this device; cross-device merge policy is separate.
- More than one increase, the minimum and maximum disabled states, or changing
  Dynamic Type while the panel is open. Platform tests may cover those edges.
- Theme transition animation, system theme changing while the app is open, or
  high-contrast palettes. The resulting normative palette is covered; the
  transition between palettes is platform chrome.

## What the next scenario would extend

Open a book directly from a universal link and prove that the reader still has
a visible route to the library. Preferences do not become a substitute for
navigation chrome.
