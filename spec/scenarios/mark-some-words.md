# Scenario: mark some words of a paragraph

**The claim.** A reader who selects a few words inside a paragraph can mark
just those words. The mark lights the words and leaves the rest of the
paragraph as it was, it copies the words with their attribution, and it keeps
them: the reader's own reopened plan and a stranger opening its address both
see the same words lit, and the paragraph's text has not moved to make room.

This scenario is a surface proof for
[`spec/marks.md`](../marks.md#a-mark-may-highlight-words). It extends
[`plan-opens-on-its-tip.md`](plan-opens-on-its-tip.md), which marks whole
paragraphs, and [`mark-offline-and-sync.md`](mark-offline-and-sync.md), whose
fresh-context open it repeats for a word mark. Read [`README.md`](README.md) in
this directory first: it says what an adapter may translate and what it may
not weaken.

**Required starting state:** all-red. No shipped client could mark less than a
whole paragraph when this was written; a selection inside a paragraph marked
nothing on the web and nothing on the native client.

## Setup

- One device, signed out, with no plan for the fixture tale.
- A prose tale with two markable paragraphs, **P** and a later **Q**. P holds a
  run of several consecutive words, **W**, that is shorter than P, does not
  start P, and occurs only once in it.
- The content service is reachable throughout, so marks publish as they are
  made.
- Ordinary reading conditions: default type size, no narration playing, no
  passage fragment in the address.

## Actions

- **`mark-words`** selects exactly the words W inside P with the platform's
  ordinary text selection, then uses the control the product offers for
  marking a selection. The selection gesture and where that control appears
  are the platform's to choose; what is selected is not. An adapter may not
  mark P whole and then narrow it, and may not reach the control any way a
  reader could not.
- **`mark-passage`**, **`read-to-block`**, **`end-session-and-open-current-plan`**
  and **`open-published-plan`** mean what
  [`plan-opens-on-its-tip.md`](plan-opens-on-its-tip.md) and
  [`mark-offline-and-sync.md`](mark-offline-and-sync.md) say they mean.

## Observations

- **`highlighted`** lists each marked passage in reading order with what is
  lit in it: `"P:W"` when exactly the words W of P are lit and no other text
  of P is, `"Q:whole"` when Q is lit as a whole-paragraph mark lights it. Anything else (a
  wider or narrower range, two ranges, the words and the paragraph) is reported
  as observed and fails.
- **`textMoved`** is `true` when any glyph of P is somewhere else on screen
  once the mark has settled than it was before the reader marked: the reader
  must find P's words where they left them. A product may make room for its
  mark's controls and offset the page by exactly that room to hold the
  reader's place, as a whole-paragraph mark already does; the glyphs have not
  moved for the reader, so that is not moved text. Moving the page without
  compensating, or reflowing P's lines, is.
- **`markedPassages`**, **`markCount`**, **`planUrl`**, **`planUrlValue`**,
  **`clipboardPassage`**, **`clipboardAttribution`**, **`cover`**,
  **`position`**, **`settled`** and **`state`** are the observations of the
  scenarios named above. Here `clipboardPassage: "W"` means the copy carries
  the words W as its passage, not all of P.

## Steps

**1. Open the tale fresh** at its cover.

**2. Read down to P.**

**3. Mark the words W of P.** P is marked, and only W is lit. The text of P has
not moved. The copy carries W and its attribution, and the plan has an
address.

**4. Mark Q whole.** Both are marked: P still lights only W, and Q is lit
whole. Record the plan's address.

**5. End the session and open the plan's address.** Both marks are drawn as
step 4 drew them.

**6. Open the recorded address on a fresh device with no local data.** The
reader lands in the book with both marks, P lighting W and Q whole: the words
were published with the mark, not kept beside it on the device that made it.

## What this does not cover

- **A selection across two paragraphs**, which marks nothing as words: the
  string must lie within one paragraph. Where the product sends such a
  selection is not stated here.
- **A refused string.** Strings not in the paragraph, over-long strings and
  strings on a section anchor are refused by the boundary; the shared vectors
  and each client's own tests prove the refusal. No ordinary reader gesture
  produces one.
- **A later edition that loses W.** `spec/marks.md` says the mark falls back
  to the whole paragraph. Proving it needs an edition fixture.
- **Notes, due dates and offline authoring** on a word mark, which follow the
  rules of a whole-paragraph mark.

## What the next scenario would extend

1. **The edition fallback**, through
   [`a-new-edition-keeps-your-place.md`](a-new-edition-keeps-your-place.md)'s
   published-edition action: an edition that edits W out of P shows P whole,
   and one that keeps W shows only W.
2. **Re-marking a word-marked paragraph with different words**, which
   replaces the one mark on that paragraph.
