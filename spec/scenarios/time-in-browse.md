# Scenario: a book's time is visible before opening it

Read [README.md](README.md) and [browse-time](../browse-time.md). The executable
plan owns the ordered acts and visible observations. This is new behavior:
web and native must record an intentional red before implementing the labels.

## Setup

One signed-out clean device, English interface, reachable fixture service.
The fixture's home roster is, in order:

- `The long recording`: playable narration, producer time audio/24 seconds;
- `A short reading`: no playable narration, producer time read/1500 seconds;
- `A tiny reading`: no playable narration, producer time read/1 second;
- `A long reading`: no playable narration, producer time read/57540 seconds.

All three authors are `Clockwork Writer`. A shelf `Time samples` at
`/~time-samples` contains those four in the same order followed by an
unavailable placeholder `A future reading`. The placeholder has no time and
cannot be read or played. The author directory contains `Clockwork Writer`,
whose shelf `/author/clockwork-writer` has the four available books in title order: `A long reading`, `A short reading`,
`A tiny reading`, `The long recording`.
The fixture may include irrelevant other library entries, but this home list
and the named search results/shelves are exact. Narration credits may exist in
the producer data; the time label does not add a narrator to the row.

## Steps

1. Open the blank library. The four home books show `1 min audiobook`,
   `~25 min read`, `~1 min read`, `~16 h read`, respectively. Each row shows exactly one time.
2. Type `short reading`. Its single book result retains `~25 min read`.
3. Open the canonical `https://tale.fyi/~time-samples` shelf. Its five rows
   show those same four times; the future placeholder shows none.
4. Open the authors directory through the library's ordinary browse link,
   activate `Clockwork Writer`, and observe its four book rows. The times
   match the home rows and appear in producer title order.
5. Activate `A short reading`, then go back. The same author shelf and its
   four duration labels return. No reader progress is invented by arrival.

Adapters act through actual navigation, input, row links and ordinary Back.
They observe visible or accessible row text, not payload fields or an internal
formatting helper. Exact payload seconds are separately proved at the producer
boundary; a client test cannot qualify the producer by echoing fixture data.

## Exclusions

This does not add narrator selection, remaining-time estimates, book sorting,
new reading speeds or changes to the book page. Unavailable placeholders and
older payloads may omit time; compatibility and invalid optional field handling
are covered at their public decode/render boundaries as well as rendered
client-owned checks. Other scenarios own play, progress and offline reading.
