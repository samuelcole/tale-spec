# Presentation: the book column

The suite exists so that every platform ships the *same product*. This
document is the visual half of that promise: what a book page looks like is
a contract, not a per-platform interpretation. A reader who moves between
tale.fyi and a native app is holding the same book, set the same way.

No semantic vectors for now. The indent/flush rules below are a pure function
of block sequence and are the first candidates for vectors if this area ever
earns them. User-visible position and motion are exercised at the product
surface by [`position-and-motion`](scenarios/position-and-motion.md).

## The chrome line

**Native chrome is the affordance; the column is the contract.**

May differ per platform, and should feel native there:

- Scroll physics: momentum, deceleration, overscroll, rubber-banding,
  scroll-bar/indicator styling.
- Text interaction: selection handles, magnifiers, context menus, share
  sheets.
- System furniture: status bars, safe areas, navigation containers and
  transitions, haptics, accessibility technology.
- Text-engine internals: exact line-break positions, hyphenation points,
  rasterization and antialiasing. Two engines will break lines differently;
  the *geometry they break within* is what this document fixes.

Must not differ: everything below — faces, sizes, weights, tracking, line
height, indents, insets, spacing rhythm, palette, and which voice speaks
where.

Units are CSS pixels; 1 px = 1 pt (iOS) = 1 dp (Android).

## The three voices

- **The book face** — Literata. The work itself. Serif unless the tale's
  author chose otherwise; the choice is the author's, never the reader's.
- **The machine's voice** — JetBrains Mono. Chrome, labels, chapter marks:
  everything the machine says about the book rather than the book itself.
- **Human voices** — Source Sans 3. People talking near the work (credits,
  human-written notes outside the prose).

All three are SIL OFL; native clients bundle them. A platform where a face
fails to load renders a fallback serif/mono — but a client implementing this
presentation contract treats a missing bundled face as a defect, not a
graceful degradation.

## The library — a list in the machine's voice

The front door is a list, not a shelf of cards. Every row is open on the paper
and speaks in JetBrains Mono: **15 px / line-height 1.8**, with **6 px** above
and below and a **1 px `rule-soft`** boundary after it. There is no enclosing
fill, radius, border, shadow, cover thumbnail, or disclosure chevron.

The title comes first in `primary`. Its byline follows in the same line when
space permits, at **13 px, weight 300**, in `muted`; a person's name never
breaks inside itself. Reading progress sits at the trailing edge at **11 px,
weight 300**, in `muted`. A started book shows its integer percent with a `%`;
a finished book says **read** rather than `100%`. Missing progress leaves no
placeholder or gap.

A narrated book carries a trailing play control after its progress. The
control itself is the audiobook indicator: no badge or duplicate label sits by
the title. It uses the machine's quiet `muted` ink, a **13 px** play glyph in a
**44 × 44 px** touch target, no fill or boundary, and the accessible name
**listen to <title>**. Activating it starts the read-along immediately and
opens the canonical book underneath the continuing transport.

Offline availability changes neither order nor affordance. A book not kept on
the device remains a real, tappable row and the whole row draws at **0.6
opacity**. One **11 px, weight 300, `muted`** line above the list explains what
the dimming means. Metadata inside a dimmed row first flattens to `primary`, so
the single opacity does not compound into illegibility. A kept book remains at
full strength.

Search is one full-width native text input above that same list, in the
machine's voice at **15 px**, with no fill or enclosing border. A **1 px
`rule`** line along its bottom becomes `muted` while focused. Its placeholder
and accessible name are **find a tale**. There is **24 px** between the input
and the first result.

A matching curated list, genre, era, or author is a discovery row in the same
open list, never a card or a book wearing a badge. Its name uses the ordinary
15 px row title. A second line says `<count> books · <kind>` in the machine's
quiet voice at **11 px, weight 300**, where kind is `a list`, `a genre`, `an
era`, or `an author` (and `book` is singular when count is one). These rows
carry no progress or play control. Their destination is Tale's canonical web
route until a native shelf surface is separately specified.

## The page

- Book body: Literata, **17 px / line-height 1.6** below 640 px viewport
  width; **19 px / 1.58** at 640 px and above.
- Measure: the column is `max-width: 58ch`, centered; side padding 20 px
  (narrow) / 32 px (≥ 640 px). Phones never reach the cap.
- Ragged right, never justified. Hyphenation on, breaking only where the
  language's dictionary allows; a word that cannot fit a line of its own
  may break as a last resort, but the measure never widens to fit it.
- Numerals: oldstyle and proportional — a date sits in the line instead of
  shouting over it. Kerning on; common and contextual ligatures on.
- Ink on paper (palette below): body text is `primary` on `paper`.

## The cover — what a book opens on

A book page opens on a cover, in the same column the prose is set in, and
every line of it is **centered**. A title page has been centered for five
hundred years; flushed left it stops being a title page and starts being a
list row. This is the part of the cover that is portable, so it is the part
this document fixes.

Three lines, in the **book face** — the tale's own face, so a tale set in
mono has a mono cover. The cover is the book introducing itself, so it
speaks in the book's voice rather than the machine's or a person's. The
words themselves come from the payload (`spec/payload.md`); the sentence
they are set into is this document's.

- **Title** — book face, weight **500**, letter-spacing **0.01 em**, color
  `primary`; **24 px** below 640 px viewport width, **32 px** at 640 px and
  above. **8 px** below it.
- **Byline** — book face, **15 px, weight 300**, color `muted`. The stored
  byline whole: "Bram Stoker", or "Fyodor Dostoevsky, translated by
  Constance Garnett". Where a platform has an author's shelf, the author's
  name is a door to it and the ", translated by …" tail is not; where it
  has none, the line is plain text. **4 px** below it.
- **Attribution** — book face, **12 px, weight 300**, color `muted`. Below.

### The attribution

Where the text came from and who read it aloud, in one line built from two
halves joined by ` · ` (U+00B7, spaced) when both are present:

```
text from <edition> · read by <readers> for <host>
```

- **`text from <edition>`** names the edition the text was set from —
  "Standard Ebooks", "Project Gutenberg" — and `<edition>` is a door to
  that edition's own page. Absent when the tale has no such source.
- **`read by <readers> for <host>`** names the narration. One or two
  narrators are named and conjoined ("Karen Savage and Tom Weiss"); three
  or more collapse to the word **volunteers**, and naming everyone is the
  colophon's job at the end of the book. `<host>` — "LibriVox" — is a door
  to the recording. Absent when the tale has no narration.
- Neither half: no line at all, and no gap left where it would have been.

Only the two proper names are doors, not the words around them, and a door
is drawn here the way every door on the page is drawn: no underline of its
own, a **1 px rule in `rule`** along its baseline edge, going to `primary`
when the reader reaches for it.

This line is not decoration and it is not the colophon's alone. Most
readers never reach the end of a book, so the people whose work made this
one readable are credited where every reader actually looks. A client that
has the strings and does not show them is not shipping the same product.
A client that does not have them invents nothing: crediting the wrong
source is worse than crediting none.

### What a cover may differ in

- **How tall it is, and where in that height the three lines sit.** The
  reference cover fills at least 70% of the viewport and centers its lines
  within that block; a native cover may size and place itself differently.
  `spec/scenarios/open-and-read.md` says the same thing from the other
  side — it asserts that a book opens at its cover and asserts nothing
  about what fits below it.
- **What else a platform hangs there.** The reference cover also carries a
  masthead (the way home, for a reader who arrived from a search) and a
  scroll hint; an app with a back gesture and a scroll indicator needs
  neither. Whatever a platform adds sits outside the three lines and does
  not change them.

## Paragraphs — indents, not gaps

What novels do, and what the source markup assumes:

- Zero vertical space between successive body paragraphs.
- A paragraph *following another paragraph* gets a **1.35 em** first-line
  indent. An indent marks continuation, so a paragraph that follows a
  heading/header block, a blockquote, or a scene divider sits **flush** —
  as does the first paragraph of a section or of a blockquote.
- Blockquote: 1 em above and below, inset **1.5 em** from the leading
  edge, ink shifts to `secondary`. Nested quotes inset a further 1 em per
  level. Paragraphs follow the indent-if-after-paragraph rule among
  siblings of the same quote. Every quote boundary — opening, closing, or
  one quote directly following another — costs a single 1 em gap (margins
  collapse, they never stack), and the first block of a quote sits flush.
- Scene divider (`hr`): a 1 px rule in `rule`, 4 rem wide, centered
  *within its container*, with 2.5 em above and below — inside a
  blockquote the container is the quote's inset box, so a quoted scene
  break sits centered in the quote, not the page.

## Position and motion — orientation, not emphasis

The reader's current body paragraph carries one **2 px leading-gutter line**.
It is an overlay outside the paragraph's text box, never padding or a border,
so showing or moving it cannot reflow the book. During silent reading it spans
the paragraph's full rendered height. Its color is `rule` in both appearances:
this is a quiet answer to “where am I?”, not an alert or selection. In
particular, `accent-red` is not a reading-position color.

Narration temporarily owns that same line. There is still one position line,
in the same gutter and the same `rule` color, but its rendered bottom is the
bottom of the active word box rather than the bottom of the paragraph. As the
voice advances, changes in line height use a **450 ms ease** and the narration
line fades in over **140 ms**. The line eases from its currently rendered
height toward each new word instead of snapping or moving backward during
continuous playback.

Movement the product initiates while the book is already on screen also keeps
the reader oriented. Continue, start over, read from here, and narration
follow interpolate from the currently rendered position to their exact target.
The duration and curve may use the platform's native smooth-scroll treatment,
but the movement must expose a start, intermediate positions, and an end; a
teleport is not conforming. If the target changes mid-movement, the new move
begins at the currently rendered position. Animation never changes the target
paragraph, the comfortable follow band, or whether the movement is allowed to
write reading progress.

Initial restoration or passage placement completed before the book is
presented may be immediate. Genuine reader scrolling keeps the platform's own
physics under the chrome line above; this section does not replace momentum,
deceleration, or overscroll.

When the platform's **Reduce Motion** preference is enabled, narration-line
height changes, ownership changes, and product-initiated page movement are
immediate. Their final word edge, paragraph, follow band, and progress outcome
remain identical to ordinary-motion mode. The preference is read for each new
movement; it does not require a different build of the reader.

## Chapter marks — navigation, not prose

Headings speak in the machine's voice: JetBrains Mono, **13 px, weight
300**, letter-spacing **0.04 em**, color `muted`, prefixed with an em dash
and space — `— II` — added at render time (the prefix is presentation and
is never part of the content).

Rhythm: **80 px** of space above a section's heading; **28 px** between the
end of the whole header block and the first body paragraph.

Bridgehead lines under a chapter mark (a header's paragraphs — subtitle,
"Kept in shorthand") stay in the book face but drop to its quiet register:
Literata **13 px, weight 300**, letter-spacing 0.04 em, color `muted`, no
indent, no extra space between successive bridgehead lines. A letter or
telegram header inside a blockquote ("Letter, Lucy Westenra to Mina
Murray.") speaks in the same bridgehead voice while keeping the quote's
inset.

## Palette — paper and ink

| token | light | dark |
| --- | --- | --- |
| `primary` | `#131210` | `#f5edcb` |
| `secondary` | `#3a3833` | `#c9c1a3` |
| `muted` | `#615d52` | `#a19979` |
| `paper` | `#f8f8de` | `#14130d` |
| `paper-raised` | `#f8f8e0` | `#1d1c16` |
| `rule` | `#13121029` | `#f5edcb2e` |
| `rule-soft` | `#13121014` | `#f5edcb1a` |
| `accent-red` | `#cf1e2e` | `#e84752` |

8-digit values are RGBA. Light and dark are both normative; a client
follows the platform's appearance setting.

## Provenance

Values measured from the reference implementation's stylesheet and design
tokens, not eyeballed from screenshots. When an implementation's rendering
disagrees with this document, this document wins until it is deliberately
re-measured — a presentation change here carries the same one-deliberate-
pass rollout as any contract change (see the README's versioning policy).
