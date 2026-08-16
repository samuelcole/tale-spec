# Presentation: the book column

The suite exists so that every platform ships the *same product*. This
document is the visual half of that promise: what a book page looks like is
a contract, not a per-platform interpretation. A reader who moves between
tale.fyi and a native app is holding the same book, set the same way.

Prose-only area for now — no vectors. The indent/flush rules below are a
pure function of block sequence and are the first candidates for vectors if
this area ever earns them.

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
fails to load renders a fallback serif/mono — but a conforming client
treats a missing bundled face as a defect, not a graceful degradation.

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
