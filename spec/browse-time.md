# A book's time in browse rows (TAL-438)

Every available book row on the home list, in search results and on a shelf
shows one compact time. The server supplies it; clients never estimate a
reading duration from text, word counts, or another field. Directory entries
that name shelves rather than books do not have a book time.

## Producer contract

The library index (`/tales.json`) and each shelf's `tale-browse` version-1
`items` may carry `time: { kind: "audio" | "read", seconds: number }`.
`seconds` is a finite positive number. It is the unformatted duration, not a
rounded display label. For `audio`, it is the real total recording length and
is supplied only when the recording is playable (the same alignment signal as
the row's play control). Otherwise `read` is the server's reading estimate,
using the same 250 words/minute pace as the book page, rounded upward to a
whole second (minimum one second for a nonempty body). No narrator name is
added to a row by this feature.

An unavailable/pending book or a body with no countable words has no time.
A missing usable recording length does not invent an audio duration: use the
reading estimate when available. The server does not send `null`, zero,
negative, non-finite seconds, or an unknown kind as a usable time.

## Display

Round seconds to the nearest whole minute, ties upward, with a minimum of one
minute. Below 60 rounded minutes, display that minute count. From 60 rounded
minutes, display the nearest whole hour, ties upward. English examples:

| supplied | displayed |
| --- | --- |
| audio, 57540 seconds | `16 h audiobook` |
| read, 1500 seconds | `~25 min read` |
| read, 1 second | `~1 min read` |
| read, 3569 seconds | `~59 min read` |
| read, 3570 seconds | `~1 h read` |
| audio, 5400 seconds | `2 h audiobook` |

The unit and audio/read words follow the interface language. A reading estimate
retains its approximation indicator. The whole duration label stays together
when the row wraps; it must not obscure its title, byline, progress or play
control. The time is readable text and available through accessibility.

## Compatibility

This is an additive optional field: `tale-browse` stays version 1 and the
library index stays its existing array. Old clients ignore the new field.
New clients accept older saved/fetched rows without it and show no duration,
never a locally reconstructed estimate. An invalid time is treated as absent,
without losing an otherwise usable row. Existing book order, links, playback,
progress and offline availability semantics do not change.

The scenario is [time-in-browse](scenarios/time-in-browse.md). Producer and
consumer boundary tests additionally cover malformed/absent data and rounding
boundaries; those tests are supporting evidence, not surface conformance.
