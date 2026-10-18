# Scenario: an address speaks its language

**The claim.** Every page that has a Spanish interface also has a Spanish
address, `/es/…`, that anyone can share and any search engine can index.
The plain address is English. A reader who prefers Spanish arrives at the
Spanish address on their own. A Spanish address holds its language for a
reader who hasn't decided otherwise, and gives way only to a choice the
reader made. Either address is the same book, with the same place in it.

Read [`README.md`](README.md) first. This extends
[`interface-follows-the-device.md`](interface-follows-the-device.md) and
[`choose-interface-language.md`](choose-interface-language.md): those decide
which language the controls speak; this decides which address carries it.
The address rule itself is in [`../addresses.md`](../addresses.md),
"Interface-language prefix".

## Portable rules

- **Two addresses, one book.** `/es/<path>` is the Spanish interface's
  address for `/<path>`. The prefix is never part of a book's identity:
  `canonicalBook` is the same at both, and so are the reading place, the
  kept copy, and marks.
- **The prefix is the controls' language, never the book's.** Every book
  has both addresses whatever language it is in: a French book reads with
  English controls at `/<book>` and Spanish ones at `/es/<book>`, for the
  learner and the bilingual reader alike. A Spanish book's plain address is
  English controls around Spanish text.
- **The plain address follows the reader.** Opened by a reader whose
  interface language is Spanish (their choice, else their device's), it
  moves to `/es/…`. Otherwise it stays, in English.
- **A Spanish address holds.** Opened by anyone who has not *chosen*
  English, it stays and speaks Spanish, whatever the device prefers. A
  device language never moves a reader off an explicit address, so a
  crawler with no preferences reaches both.
- **A choice outranks an address.** A reader who chose English and opens a
  Spanish address moves to the plain one.
- **Choosing moves the address.** Choosing a language takes the reader to
  that language's address for the same page.
- **Sharing gives the plain address**, so whoever opens the link gets their
  own language. An address copied out of the address bar is the reader's to
  share, and holds its language as above.
- **Each page names both.** A page declares its English, Spanish and default
  addresses as alternates (`hreflang`); the default is the plain one.

## Observing it

- `addressPath` is the path in the address the reader is at once the page
  has settled, after any move.
- `englishAddress`, `spanishAddress` and `defaultAddress` are the page's
  declared language alternates, absolute.
- `sharedUrl` is what the book's share control hands over.
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
address and `/es/dracula-scenario` as its Spanish one.

**2. Share the book.**

The link is `https://tale.fyi/dracula-scenario`, without the prefix.

**3. On a fresh device whose preferred language is English, open
`/es/dracula-scenario`.**

The address holds and the controls are Spanish. The page names the same
alternates.

**4. Read several screens.**

**5. End the session and open `/dracula-scenario`.**

English controls, at the plain address, at the place read to in step 4.

**6. Choose Spanish.**

The address becomes `/es/dracula-scenario`.

**7. Choose English.**

The address becomes `/dracula-scenario`.

**8. End the session and open `/es/dracula-scenario`.**

The reader chose English, so they land at `/dracula-scenario` in English,
at the same place.

## Platform note

A native client has no address bar and takes its interface language from the
operating system, so this scenario is the web's. The part every client
shares — a `/es/…` link opens the same book as the plain one — is the
address rule in [`../addresses.md`](../addresses.md) and its vectors.

## What this does not cover

- Translated page titles, descriptions and share cards. They follow the
  interface language at each address, but a scenario proves which address
  serves which language, not wording.
- The sitemap's alternates.
- A third interface language; the prefix is the language's primary subtag.
