# Scenario: payload presentation

**The claim.** A tale keeps the author's chosen book face and classification
everywhere it is read. `serif`, `sans`, and `mono` change both the cover and
the prose; `nonfiction` adds one quiet, readable `non-fiction` label and never
becomes an interactive control.

This is the surface proof for [The three voices](../presentation.md#the-three-voices)
and [The cover](../presentation.md#the-cover). Read [`README.md`](README.md)
first: the adapters observe rendered type and accessible text through the real
reader surface, never the payload object or a client typography helper.

## Setup

- One signed-out device with no recorded position for these books.
- Three stable book addresses with the same title, byline, and body paragraph:
  - **S** has `font: serif` and `nonfiction: false`;
  - **N** has `font: sans` and `nonfiction: true`;
  - **M** has `font: mono` and `nonfiction: false`.
- Default reader size, no narration, no plan editor, and no fragment.

The controlled words make the rendered faces visually distinguishable without
adding a font name to the reader's accessibility copy. The adapter records the
face from the painted cover and body, and the classification from visible,
accessible reader text.

## Steps

**1. Open S from a clean state.**

The cover and prose both use the serif book face. No non-fiction label is
visible or announced.

**2. Open N.**

The cover and prose both use the sans book face. One `non-fiction` label is
visible and readable as static text; it has no button or link behavior.

**3. Open M.**

The cover and prose both use the mono book face. No non-fiction label is
visible or announced.

## Required starting result

This characterizes existing reference behavior. Before implementation, the
web adapter records green against the shipped reader and the unfinished native
adapter records intentional red because it renders every payload in Literata
and publishes no non-fiction classification on the cover.

## What this does not cover

- Reader-selected font families. The author owns this choice; the reader's
  local preferences continue to own only size and appearance.
- Library-row classification, author navigation, end-of-book discovery, or
  editor controls.
- Missing bundled-font recovery. A missing required face is a client defect,
  not an alternate conforming presentation.
- Exact raster equality between rendering engines. Each adapter identifies the
  painted face on its own platform while preserving the shared semantic result.

