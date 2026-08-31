# The progress store

Where a reader is in a tale, kept on the device that did the reading. The
store is a map from a tale's public path to one progress record. It answers
two questions — where do I open this tale, and how far along is it in a list
of tales — and it must answer them without loading any text.

Reading is local first. A device with no account keeps a complete, correct
store; syncing a server copy in is a merge, never an authority. Every rule
below is written so that no merge, rename, or pull can move a reader
backwards.

The executable form of this document is
[`vectors/progress.json`](../vectors/progress.json). Where the prose and a
vector disagree, the vector is the bug report.

## The record

```json
{
  "sections": { "chapter-1": true },
  "furthest": "chapter-3-p14",
  "percent": 33,
  "title": "Dracula",
  "authorName": "Bram Stoker",
  "tip": "plan-tip",
  "updatedAt": "2026-07-01T00:00:00Z"
}
```

- **`sections`** — a map of section id to `true`. A legacy per-chapter read
  map: nothing writes it any more, it only ever grew, and it is unioned
  rather than replaced when two records merge. Required; an empty object is
  the normal value.
- **`furthest`** — the anchor id of the deepest paragraph the reader has
  reached. It is an *inclusive high-water mark, not a cursor*: it names the
  last paragraph read, the tale opens after it, and re-reading earlier text
  never moves it back. Absent means no position has been recorded.
- **`percent`** — 0–100, that position as a fraction of the whole tale.
  Stored because it is the only position measure comparable without the
  paragraph order in hand: an index can render progress, and two records can
  be ranked, with no text loaded. Absent means unknown, and ranks as 0.
- **`title`**, **`authorName`** — recorded as the tale is read so a list can
  name a tale it cannot look up: a private or unpublished tale is in no
  findable index, and offline there is nothing to ask. `authorName` may be
  `null` for a tale with no byline; absent means never recorded, and the two
  are treated alike everywhere a byline is filled in.
- **`tip`** — the reader's most recent plan address for this tale, so a list
  row can send them back to their marks instead of to the bare tale. A tip
  is an opaque, immutable address: a non-empty string, or `null`. See
  [the three-state tip](#the-three-state-tip).
- **`updatedAt`** — when this record was last written, ISO-8601. Compared by
  parsing to an instant; a value that does not parse (including the empty
  string) counts as time zero, so two unparseable stamps tie with each other
  and lose to every real one.

A key with no entry reads as the empty record — `{"sections": {},
"updatedAt": ""}` — which is not the same as an entry that exists and holds
no position. Removing a key ("start over") deletes that tale's record and
touches nothing else.

**The key is a URL path.** It is the tale's canonical public path, lowercase,
and it is matched exactly — there is no second index and no fuzzy lookup. One
tale read through two doors (a list's URL, the author's URL) keeps one key:
the canonical one. That the key is a URL is also why it can go stale, which
is what [key folding](#key-folding) is for.

## The persisted form

Schema v1 is the whole record map inside a version envelope:

```json
{ "version": 1, "books": { "<path>": { … } } }
```

Loading yields an empty store — no error, no partial recovery — unless the
persisted text parses to an object whose `version` is exactly `1` and which
carries a `books` **map**: an object, never an array, a string, or null,
which are malformed stores rather than variants of one. Corrupt text, a
version this implementation does not know, a `books` that is not a map, and
nothing ever persisted all load the same way: empty. A future version is
discarded rather than guessed at.

The envelope spells the map `books`, and only the envelope: the word
predates the decision that a book *is* a tale, and the spelling is frozen
in the storage of every reader who ever opened one. Everywhere else in this
area — op inputs, results, prose — the map is `tales`.

A write that cannot persist (storage full, storage unavailable) must not
throw into the reading path. Reading still works; the progress just won't
keep.

Loading and migration are separate steps: `load` parses and validates,
[key folding](#key-folding) runs over what it produced, and the result is
persisted again if folding changed anything. The vectors keep the two ops
apart so the moves table stays deployment data rather than something baked
into the contract.

## The three-state tip

The tip field has three states and they mean different things. Preserving
the distinction is required; an implementation that cannot tell an absent
field from a stored null must document the encoding it chose and apply it
everywhere.

- **absent** — this device never knew a tip for this tale.
- **a string** — a live tip: marks the reader has open.
- **`null`** — a tombstone: the reader deliberately cleared their marks here.

**The pull rule.** Given the local record (possibly absent entirely) and a
server record, the tip afterwards is:

1. If the local tip is a string, it wins outright — those marks are live in
   front of the reader, and a tip carries no ordering to compare it against.
2. If the server has no tip (absent or `null`), the local tip stands
   unchanged, whatever state it is in.
3. Otherwise the server holds a string and the local record does not:
   - **absent** — take the server's. This is the case the rule exists for: a
     plan opened on a phone should be on the laptop's list row when the
     reader sits down.
   - **`null`** — take the server's only if the server record's `updatedAt`
     is **strictly newer** than the local record's. Otherwise the tombstone
     holds.

A tombstone that held forever would make a plan built later on another
device permanently unreachable, with nothing on screen to explain why. So it
yields — but only to evidence that the plan came *after* the clear. A tie is
not that evidence: `updatedAt` is a record timestamp that a position write
moves too, so equal stamps say nothing about which act came first, and the
tombstone keeps the tale.

The cost of rule 1 is accepted deliberately: a tab left open on an old plan,
restored at startup, writes that tip and so can outrank a deliberate clear.
From the store's side that is indistinguishable from the reader walking back
to those marks.

## The fold merge

Two records that turn out to name the same tale are folded into one. This is
one procedure, used by both key-folding passes, and it never moves a reader
backwards.

**Position score.** A record scores its `percent` (absent counts as 0),
except that a record with a `furthest` and no positive percent scores just
above zero — ahead of an empty or tip-only record, behind any measurable
percent. That keeps a legacy mark written before percent existed from being
thrown away, without letting it outrank a real measurement.

**Winner.** Between a canonical record and a variant being folded into it,
the variant wins if its score is higher, or if the scores are equal and its
`updatedAt` is strictly newer. Otherwise the canonical wins. Position, not
recency, decides: someone 80% through the old spelling of a path who follows
a redirect and reads one paragraph has a real position under both keys, and
recency alone would hand them the paragraph.

**The merged record** is the winner's, with:

- `sections` — the union of both maps.
- `title`, `authorName` — the winner's when it has one, otherwise the
  other's. A `null` byline counts as not having one.
- `updatedAt` — the newer of the two stamps.
- `tip` — decided independently of position, because a plan changes
  independently of reading. Take the tip of the **newer** record (by
  `updatedAt`; a tie goes to the canonical) if that record has an explicit
  value, string or `null`. Only if the newer record's tip is absent — that
  spelling never knew a tip — does the older's carry over.

Everything else — `furthest`, `percent` — comes from the winner untouched.

## Key folding

The keys in a store can go stale, because a key is a URL path and paths
move. Two passes fix that, **in this order**, both using the fold merge:

1. **The moves table.** Deployment data: a map from an old key to
   `{to, title}`. For each entry whose old key is present, take that record,
   fill its `title` from the entry if it has none, then merge it into the
   destination key — fold merge with the destination as the canonical record
   and the moved one as the variant, or a plain move if the destination is
   empty — and delete the old key. Keys match exactly.

   The title comes along because a list cannot look a renamed tale up; without
   it the row would name itself with its own URL. **Entries are forever** — a
   laptop may not open the site for a year, and a dropped entry strands
   whatever position it was carrying.

2. **The lowercase fold.** Public paths are lowercase, so a key written under
   a mixed-case URL names a page no reading session will ever write again.
   For every key that is not already equal to its own lowercase, merge it
   into its lowercase twin — that twin is the canonical record, the
   mixed-case one the variant — and delete it. This one is a rule rather than
   a table because the casings nobody recorded cannot be enumerated.

The second pass does not re-enter the first: a mixed-case spelling of a key
that the moves table would have moved lands on its lowercase twin and stays
there.

**Order is defined, and it is not the map's.** Both passes fold their
source keys in code-point order, and a moves entry's destination resolves
through the table *transitively*: a destination that is itself a moved key
follows its own entry — entries are forever, so a tale that moved twice has
two, and a reader from either era lands at the end of the chain. Resolution
stops rather than looping when entries cycle, and an entry that resolves to
its own source is skipped. The title that fills in is the one on the
record's own source entry. A map's iteration order is never part of the
contract — two implementations with differently-ordered dictionaries must
fold identically, which the paired chain vectors enforce.

Case folding applies to keys only. **Plan tips are exempt** — a tip is an
opaque immutable address and its case is part of it.

If either pass changed anything, persist the result.

## Merging the server's copy

`merge-remote` folds a server's records into the store, so a tale started on
another device is listed here — and can be kept offline — without opening it.
Each server record carries `{path, title, authorName, furthest, percent,
tip?, updatedAt}`, where `furthest` may be `null`.

For each server record, compare the local record's percent (absent counts as
0) against the server's:

- **Local is level or ahead** (`local >= remote`): keep the position exactly
  as it is. Fill in `title` and `authorName` wherever the local record has
  none — absent or `null` — from the server's. Apply the tip pull rule.
  Nothing else changes; in particular the local `updatedAt` does not move,
  because nothing about the reader's position did.
- **Local is behind** (or there is no local record): replace it with the
  server's — `percent`, `title`, `authorName` and `updatedAt` from the server,
  `furthest` from the server unless the server's is `null`, in which case the
  local one stays. `sections` carries over from the local record. `tip` is the
  tip pull rule's answer.

The comparison is percent-only and forward-only. It is a heuristic, and it is
allowed to be: an index has no paragraph order to compare anchors with, and
opening the tale re-merges against the real order. A tie keeps the local
record, so a pull can never lower a percent or walk a mark back.

## Save ownership

Position and tip have different writers, and a writer holds its own view of
the record for the life of a page. Neither save may clobber the other's
field.

**A position save** stores the supplied record with `updatedAt` stamped to
now, except: if the store already holds an entry for that key whose `tip`
field is present — a string *or* an explicit `null` — that stored tip is kept
in place of the record's. The record being saved may be a snapshot taken
before a tip was written or cleared; without this rule the save would
resurrect a cleared tip or erase a fresh one. When the store has never known
a tip for that key, the supplied record's own tip is stored as given.

**A tip save** reads the stored record (or an empty one), sets `tip` to the
supplied value — a string, or `null` to clear — and stamps `updatedAt`. It
fills `title` from the supplied metadata only if the record has none, and
`authorName` likewise and only if the metadata's byline is a non-null string:
an unknown byline is not recorded as a byline. It never touches `sections`,
`furthest`, or `percent`.

## Has progress

A record counts as having progress when its `sections` map is non-empty or a
`furthest` is present. Nothing else counts: a percent-only record is a
ranking and display hint, not evidence of a reachable saved place; a tip alone
is a plan the reader opened, not a place they got to.

## Operations

| op | input | result |
| --- | --- | --- |
| `load` | `raw` — the persisted text; absent means nothing was ever persisted | the record map |
| `migrate-tales` | `tales`, `moves` — old key → `{to, title}` | the record map after both folding passes |
| `merge-remote` | `tales`, `remote` — array of server records | the record map after the merge |
| `save-progress` | `tales`, `slug`, `record` | the record map after the save |
| `save-mark-tip` | `tales`, `slug`, `tip` — string or `null`, `meta?` — `{title?, authorName?}` | the record map after the save |
| `clear-progress` | `tales`, `slug` | the record map with that key removed |
| `has-progress` | `record` | boolean |

The saves stamp `updatedAt` from the clock, so vectors carry the stamp
marker `{"$instant": true}` in that one field of the record they wrote —
the result must be a string that parses as an ISO-8601 instant, so an
implementation that stops stamping fails; every other field is compared
exactly. Absent and `null` are distinct throughout — see
[`harness.md`](harness.md) for the encoding.

Vector fixtures use generic paths and titles. The merge never inspects the
content of a key or a title, so a case verified against one set of names
holds for any other; cases whose fixtures were renamed after verification say
so in their `note`.
