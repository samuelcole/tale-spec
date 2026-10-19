# Scenario: an address speaks its language

**The claim.** Every page has an address in each language Tale's interface
speaks, that anyone can share and any search engine can index: the plain
address is English, `/es/…` is Spanish, and `/pt/…` is Portuguese. A reader
who prefers Spanish or Portuguese arrives at that language's address on
their own. A language's address holds for a reader who hasn't decided
otherwise, and gives way only to a choice the reader made. Every address is
the same book, with the same place in it.

Read [`README.md`](README.md) first. This extends
[`interface-follows-the-device.md`](interface-follows-the-device.md) and
[`choose-interface-language.md`](choose-interface-language.md): those decide
which language the controls speak; this decides which address carries it.
The address rule itself is in [`../addresses.md`](../addresses.md),
"Interface-language prefix".

## Portable rules

- **One book, an address per language.** `/es/<path>` is the Spanish
  interface's address for `/<path>`, and `/pt/<path>` the Portuguese one's. The prefix is never part of a book's identity:
  `canonicalBook` is the same at each, and so are the reading place, the
  kept copy, and marks.
- **The prefix is the controls' language, never the book's.** Every book
  has every address whatever language it is in: a French book reads with
  English controls at `/<book>` and Spanish ones at `/es/<book>`, for the
  learner and the bilingual reader alike. A Spanish book's plain address is
  English controls around Spanish text.
- **The plain address follows the reader.** Opened by a reader whose
  interface language is Spanish or Portuguese (their choice, else their
  device's), it moves to that language's address. Otherwise it stays, in
  English.
- **A language's address holds.** Opened by anyone who has not *chosen*
  another language, it stays and speaks its own, whatever the device
  prefers. A
  device language never moves a reader off an explicit address, so a
  crawler with no preferences reaches each.
- **A choice outranks an address.** A reader who chose English and opens a
  Spanish address moves to the plain one; one who chose Portuguese moves to
  the Portuguese one.
- **Choosing moves the address.** Choosing a language takes the reader to
  that language's address for the same page.
- **A link Tale hands over is the plain address** — a copied passage, a
  share — so whoever opens it gets their own language. An address copied out of the address bar is the reader's to
  share, and holds its language as above.
- **Each page names them all.** A page declares its English, Spanish,
  Portuguese and default addresses as alternates (`hreflang`); the default
  is the plain one.

## Observing it

- `addressPath` is the path in the address the reader is at once the page
  has settled, after any move.
- `englishAddress`, `spanishAddress`, `portugueseAddress` and
  `defaultAddress` are the page's declared language alternates, absolute.
- `copiedUrl` is the address a passage copy carries as it is written, before
  any plan tip replaces it ([`../marks.md`](../marks.md)).
- `canonicalBook`, `interfaceLanguage`, `bookLanguage` and `readerBlock` are
  as in the scenarios above.

## Setup

- A signed-out device with no restored state for each `clean` step.
- `Dracula` at `/dracula-scenario`, an English book long enough to read
  several screens.

These names are test material, not prescribed production content.

## Steps

**1. On a fresh device whose preferred language is Mexican Spanish, open
`/dracula-scenario`.**

The reader lands at `/es/dracula-scenario`, with Spanish controls around the
English book. The page names `/dracula-scenario` as its English and default
address, `/es/dracula-scenario` as its Spanish one and `/pt/dracula-scenario`
as its Portuguese one.

**2. Copy a passage.**

The copy carries `https://tale.fyi/dracula-scenario`, without the prefix.

**3. On a fresh device whose preferred language is Brazilian Portuguese,
open `/dracula-scenario`.**

The reader lands at `/pt/dracula-scenario`, with Portuguese controls around
the English book. The page names the same alternates.

**4. On a fresh device whose preferred language is English, open
`/es/dracula-scenario`.**

The address holds and the controls are Spanish. The page names the same
alternates.

**5. Read several screens.**

**6. End the session and open `/dracula-scenario`.**

English controls, at the plain address, at the place read to in step 5.

**7. Choose Spanish.**

The address becomes `/es/dracula-scenario`.

**8. Choose English.**

The address becomes `/dracula-scenario`.

**9. End the session and open `/es/dracula-scenario`.**

The reader chose English, so they land at `/dracula-scenario` in English,
at the same place.

## Platform note

A native client has no address bar and takes its interface language from the
operating system, so this scenario is the web's. The part every client
shares — a `/es/…` or `/pt/…` link opens the same book as the plain one — is the
address rule in [`../addresses.md`](../addresses.md) and its vectors.

## What this does not cover

- Translated page titles, descriptions and share cards. They follow the
  interface language at each address, but a scenario proves which address
  serves which language, not wording.
- The sitemap's alternates.
- A further interface language; its prefix is the language's primary
  subtag, as `es` and `pt` are.
