# The read-along timeline

A book with a recording is read and heard at once: the narration plays while
the paragraph being spoken lights up and the page follows the voice. This
document states the arithmetic that connects the two — a media clock to a
paragraph, a paragraph to a phrase, a phrase to the word under the voice, and
back again.

Everything here is pure. Each operation takes its whole world as input; none
of it reads a clock, a network, or a document.

## The data a client has

A book's narration arrives as three things:

- **Sections** — the recording in playing order, each with a runtime in
  seconds. A book plays section by section; the player's media time is
  always relative to the section it is playing.
- **Paragraph begins** — pairs of `[anchorId, beginSecs]`: for each paragraph
  the narrator actually read, the second on the whole-book timeline where it
  starts. A paragraph the narration skipped has no pair. **Absence is the
  only marker of "unaligned"** — there is no null, no flag, no empty row.
- **Phrase begins** — one ascending list of every phrase's begin second across
  the whole book, and optionally a parallel list of **phrase indexes** giving
  each one's original position inside its paragraph, so a phrase the narrator
  skipped does not shift the word geometry of the phrases after it.

Anchor ids are opaque here. Clients receive them with the content and never
generate them.

## The whole-book clock

There is one timeline for a book, not one per section. Every begin second in
the sync map is measured on it.

### `section-starts`

Input `{sections}`, an array of `{secs}` in playing order. Result: an array of
the same length, each section's start second on the whole-book timeline — the
running sum of the runtimes before it.

The first section starts at 0. A book with no sections has no starts.

### `audio-timeline-time`

Input `{sectionStart, currentTime}`. Result: the whole-book second, computed
as `round((sectionStart + currentTime) × 1000) / 1000`.

The rounding is normative, not cosmetic. Media players report an exact seek to
730.3 as 730.299999, and paragraph begins land on exact boundaries. Without
the millisecond normalization, a seek aimed exactly at a paragraph's begin
falls a hair short of it and selects the paragraph *before* — the highlight
sits one paragraph behind the seek. Rounded to the millisecond, an exact
boundary seek lands where it was aimed.

### `floor-index`

Input `{sorted, t}`, where `sorted` is a number array in ascending order.
Result: the largest index whose value is ≤ `t`, or `-1` when `t` precedes the
first value or the array is empty.

An exact hit lands on itself: `t` equal to `sorted[i]` yields `i`, never
`i − 1`. This is how a whole-book time is turned into a section, a paragraph,
or a phrase.

## A paragraph's phrase window

A paragraph is bounded on the timeline by two numbers: `paraBegin`, its own
begin second, and `nextParaBegin`, the begin second of the next narrated
paragraph. Its phrases are the entries of `phraseBegins` in the half-open
window `[paraBegin, nextParaBegin)` — found by lower bound at each end (the
first index whose value is ≥ the bound).

The last narrated paragraph of a book has no next paragraph. Its
`nextParaBegin` is **positive infinity**, encoded in vectors as the string
`"Infinity"`.

A paragraph with no phrase entries in its window was skipped by the narration.
Every operation below treats that case as "nothing to say": null, or zero.

### `active-phrase-at`

Input `{phraseBegins, paraBegin, nextParaBegin, t}`. Result either null or an
object:

- `absoluteIndex` — index into `phraseBegins` of the phrase holding `t`.
- `relativeIndex` — its zero-based position among this paragraph's phrases.
- `total` — how many phrases this paragraph has.
- `within` — linear progress through the active phrase, 0..1.

Let `first` be the lower bound of `paraBegin` and `end` the lower bound of
`nextParaBegin`; `total` is `end − first`. The result is null when `total` is
zero or less, or when `t` is before `paraBegin`.

The active phrase is the last one begun at or before `t`, never past the
paragraph's own last phrase:

```
absoluteIndex = min(end − 1, lowerBound(phraseBegins, t + 1e-6) − 1)
```

**The forward epsilon is normative.** Adding 1e-6 to `t` before the lookup
makes a phrase count as begun exactly at its own begin time. Without it, the
instant a phrase starts belongs to the phrase before it, and every highlight
lags by one phrase at each boundary. Implementations must use this epsilon,
not an inclusive comparison of their own devising — the two agree everywhere
except within a microsecond of a boundary, and the vectors test the boundary.

If the resulting index falls before `first`, the result is null: `t` is inside
the paragraph's window but before its first phrase is spoken.

`within` interpolates from the active phrase's begin to the next boundary —
the following phrase's begin when the paragraph has one, otherwise
`nextParaBegin`. It is clamped to 0..1. When that boundary is not finite (the
open-ended last paragraph) or is not after the begin, `within` is 0: there is
nothing to interpolate toward.

A `t` past `nextParaBegin` still resolves to the paragraph's last phrase, fully
progressed. Callers decide which paragraph is current; this operation answers
about the paragraph it was asked about.

### `phrase-progress`

Input `{phraseBegins, paraBegin, nextParaBegin, t}`. Result: 0..1.

This is the staircase — how far the narrator is through one paragraph, stepped
by phrase. It is (phrases begun at or before `t`) ÷ (phrases in the
paragraph), using the same forward epsilon:

```
begun = lowerBound(phraseBegins, t + 1e-6) − first
```

with `first` and `total` as in `active-phrase-at`. The result is zero when
`total ≤ 0` (a skipped paragraph) or `begun ≤ 0` (nothing spoken yet), one
when `begun ≥ total`, and `begun / total` in between.

So the **first phrase already fills 1/n** and the last fills the paragraph. It
is a staircase on purpose: the sync map knows when phrases start, and claiming
smooth progress inside one would be an animation of an estimate. A renderer
may ease between the steps; the number itself steps.

Nothing here assumes the boundaries are phrases. Given a finer boundary list,
the same operation yields a finer staircase.

### `continuous-phrase-progress`

Input `{phraseBegins, paraBegin, nextParaBegin, t}`. Result: 0..1.

The interpolated companion: take `active-phrase-at`, and return

```
min(1, (relativeIndex + within) / total)
```

Zero when there is no active phrase, and zero exactly at `paraBegin`.

Both exist because they answer different questions. `phrase-progress` is what
a reader *sees* — visible ink must not claim knowledge the map does not have.
`continuous-phrase-progress` is for **navigation only**: treating each phrase
as an equal slice of the rendered paragraph is deliberately approximate, but
it gives follow-scroll a position that keeps moving, instead of leaving a
viewport-tall paragraph frozen until its next phrase begins. Never paint the
continuous value as progress.

## Anchors

### `begin-of-anchor`

Input `{paras, anchor}`, where `paras` is an array of `[anchorId, beginSecs]`
pairs. Result: that paragraph's begin second, or **null** when the anchor has
no pair.

Null means skipped. This is the single place the aligned/unaligned distinction
is decided — every "resume at the mark" and "place the highlight" decision
goes through it, so there is exactly one definition of what it means for a
paragraph to be narrated. A begin of `0` is a real begin, not an absence;
implementations in languages where zero is falsy must be careful here.

### `begin-at-or-after-anchor`

Input `{paras, orderedAnchors, anchor}`, where `orderedAnchors` is every
paragraph's anchor id in document order, narrated or not. Result: a begin
second, or null.

Find the anchor in document order; if it isn't there, the result is null. From
that position, walk forward and return the first anchor that has a begin. If
none of them do, the result is null.

Narration legitimately skips paragraphs — a heading, an epigraph, an
apparatus — while "start reading here" can land on any paragraph. The forward
walk is what makes that promise honest: an aligned anchor starts exactly
there, an unaligned one starts at the next words the recording actually
contains, and a reader is never dropped into silence or above the text they
pointed at.

## The word cut

Between a phrase's timing and a highlight sits one more question: which words
are in this phrase? A client answers it by re-cutting the rendered paragraph
text with the rules below and counting words per phrase.

**This cut is part of the shipped sync-map contract.** Every implementation —
including whatever produces sync maps — must cut identically. A single token
counted on one side and not the other shifts every highlight after it in the
paragraph by one word.

### `is-aligned-word`

Input `{token, language?}`. Result: boolean.

Reduce the token to the alphabet and ask whether anything survives:

1. If the language folds (see below), **fold** the token; otherwise leave it.
2. Lowercase it.
3. Delete every character outside `a`–`z` and the apostrophe `'`.

The token is an aligned word when the result is non-empty. Punctuation,
guillemets, dashes and digits are not words in any language.

### `phrase-word-ends`

Input `{text, language?}`. Result: an array of **cumulative** aligned-word
counts, one per phrase — the index one past each phrase's last word, so phrase
*i* covers words `[ends[i−1], ends[i])` with `ends[−1]` read as 0.

**Tokenize.** Trim the text and split it on runs of whitespace (including the
non-breaking space). Whitespace-only text yields no tokens.

**Cut on punctuation.** Walk the tokens in order, appending each to a buffer.
After appending, cut the buffer into a fragment when the token's last
character is one of

```
. ? ! ; : , —
```

(the last one is the em dash, U+2014), **except**:

- The final token never cuts. There is nothing after it to start a phrase.
- The **abbreviation guard**: when the last character is one of `. ? ! ;`,
  compute the token's *core* — fold it if the language folds, lowercase it,
  delete everything outside `a`–`z` (the apostrophe goes too, unlike in
  `is-aligned-word`) — and do not cut if that core is in the language's
  abbreviation set or is at most one character long. "Dr. Seward" and
  "H. Rider Haggard" are not two phrases. A comma, colon or em dash cuts
  regardless; the guard covers only the four sentence-enders.

When the walk ends, any remaining buffer becomes a fragment. If no fragment
was produced at all, the whole token list becomes one fragment — which is why
whitespace-only text yields a single phrase containing zero words, `[0]`.

**Merge short fragments.** A phrase shorter than **4 tokens** is not worth its
own highlight. Walk the fragments in order: a fragment of fewer than 4 tokens
is appended to the phrase before it; otherwise it starts a new phrase. The
first fragment always starts a phrase, however short — so afterwards, if more
than one phrase remains and the first has fewer than 4 tokens, prepend it to
the second. A short opening fragment merges backward because it has nothing
before it; every other short fragment merges into what precedes it.

The minimum is counted in **whitespace tokens**, punctuation-only tokens
included — `«` and `!` count toward the four even though neither is a word.
The emitted counts are aligned words.

**Count.** For each phrase in order, add the number of its tokens that are
aligned words, and emit the running total.

### The two language rules

Both acoustic models behind these sync maps read one romanized alphabet:
lowercase `a`–`z` plus the apostrophe. A token reaches it one of two ways, and
which one is a property of the language the book was **aligned** under — not
the reader's language and not the page's.

Resolve the language tag by lowercasing it and taking everything before the
first `-`: its **primary subtag**. `fr-FR` and `FR` are both `fr`. An absent
language, and an empty tag, are `en`.

- **English deletes.** Step 3 of `is-aligned-word` throws away everything
  outside the alphabet with no substitution. `très` becomes `trs`, `âgé`
  becomes `g`, `l’enfant` becomes `lenfant` (one word, not two), and a
  standalone `à` becomes nothing at all — it is not a word.
- **Every other language folds first.** Deleting would mangle the word the
  narrator is actually saying (`être` → `tre`) and erase outright any word
  made only of accented letters — in French, `à`.

**Folding** has two steps. First, spell out the Latin letters that Unicode's
own decomposition cannot take apart — a ligature or a struck-through stem is
one indivisible codepoint:

| letter | becomes |
| --- | --- |
| `æ` / `Æ` | `ae` / `AE` |
| `œ` / `Œ` | `oe` / `OE` |
| `ß` | `ss` |
| `ø` / `Ø` | `o` / `O` |
| `ð` / `Ð` | `d` / `D` |
| `þ` / `Þ` | `th` / `TH` |
| `đ` / `Đ` | `d` / `D` |
| `ł` / `Ł` | `l` / `L` |
| `’` (U+2019) | `'` |
| `ʼ` (U+02BC) | `'` |

(The uppercase forms are immaterial — lowercasing follows — but a table that
maps only one case is a table with a hole in it.)

The typographic apostrophe **is** the apostrophe: French elision writes
*l’esprit*, and the acoustic dictionary holds `l'esprit`.

Second, NFKD-decompose the result and drop every combining mark (Unicode
general category M). That handles é, ç, ü, ñ and the rest wholesale.

### The abbreviation sets

An abbreviation ends in a period without ending a phrase. A phrase break
inside a name cuts the highlight in half.

**English** (used for `en`, and by any language with no set of its own):

```
mr  mrs  ms  dr  st  prof  sr  jr  vs  no  mt
```

**French** (`fr`):

```
m    mm   mme  mmes  mlle  mlles  me   mgr  dr   drs
st   ste  sts  stes  av    apr    cf   chap vol  no
art  fig  ed   env   ibid
```

A language with no set of its own **folds but borrows English's**. The two
failures are not symmetrical: a missing abbreviation costs one extra phrase
boundary, a missing fold costs the word itself.

### Why English cannot change

Every sync map already published for an English book was computed under the
delete rule, and a client re-derives this word geometry from the rendered text
at read time — the map does not carry the words. If English started folding,
every paragraph containing a standalone accented token (an English book saying
"à la carte") would gain a word and slide its highlights, with no re-alignment
available to put them back.

So the English rule is frozen by what shipped, not chosen as an ideal.
Changing it is a change to an expected value under this suite's versioning
policy: a version bump and a migration note, carrying the same weight as
changing a published URL.

## Word selection

### `word-index-at-phrase`

Input `{phraseIndex, within, phraseEnds}`. Result: an integer word index
within the paragraph, or null.

Null when `phraseEnds` is empty, or when the selected phrase holds no words.
Otherwise clamp `phraseIndex` into range, take the phrase's word span
`[start, end)` from the cumulative ends, clamp `within` to 0..1, and select

```
start + min(end − start − 1, floor(within × (end − start)))
```

The inner clamp keeps `within = 1` on the phrase's last word rather than
spilling into the next phrase.

### `time-at-word-index`

Input `{phraseBegins, phraseIndexes, paraBegin, nextParaBegin, phraseEnds,
wordIndex}`. Result: a whole-book second, or null.

The inverse: given a word the reader can see, when is it spoken? Used when
playback starts from the viewport rather than from a paragraph's top, so a
paragraph taller than the screen does not restart above the visible text.

Take the paragraph's phrase window as before. Null when it holds no phrases,
or when `phraseEnds` is empty. Clamp `wordIndex` to `[0, last cumulative end]`,
then walk the paragraph's narrated phrases in order. For each, its position in
the *rendered* paragraph is `phraseIndexes[absoluteIndex]` when that entry
exists, and otherwise its position within the paragraph — the two differ
exactly when the narrator skipped a phrase. Clamp that position into
`phraseEnds` range and read the phrase's word span `[wordStart, wordEnd)`.

- If the word falls **before** this phrase's span, its own phrase was never
  narrated: return this phrase's begin. Moving forward to the next recorded
  words is the honest answer, and it matches `begin-at-or-after-anchor`.
- If the word falls **inside** the span — or this is the paragraph's last
  narrated phrase — interpolate. Clamp the word to
  `[wordStart, wordEnd − 1]` and take

  ```
  within = (word − wordStart) / (wordEnd − wordStart)
  ```

  then apply it linearly from this phrase's begin to the next boundary (the
  following narrated phrase's begin, else `nextParaBegin`), rounding the
  result to the millisecond as on the way in. When that boundary is not
  finite or is not after the begin, return the begin unchanged.

The last narrated phrase always answers, so a word past the end of the
paragraph resolves to the last word's time.

## Vectors

[`vectors/timeline.json`](../vectors/timeline.json) is the executable form of
this document: every rule above has cases, and the language pairs — the same
French paragraph cut as French and as English, differing by exactly one word
from its second phrase on — are the ones worth running first.
