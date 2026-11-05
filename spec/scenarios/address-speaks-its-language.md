# Scenario: an address speaks its language

**The claim.** Every page has an address in each language Tale's interface
speaks, that anyone can share and any search engine can reach: the plain
address is English, `/es/…` is Spanish, `/pt/…` is Portuguese, `/it/…`
is Italian, and `/de/…` is German. A reader who prefers one of those arrives at that language's address on
their own. A language's address holds for a reader who hasn't decided
otherwise, and gives way only to a choice the reader made. Every address is
the same book, with the same place in it, so a search engine is told only
one of them: the address of the language the book is written in.

Read [`README.md`](README.md) first. This extends
[`interface-follows-the-device.md`](interface-follows-the-device.md) and
[`choose-interface-language.md`](choose-interface-language.md): those decide
which language the controls speak; this decides which address carries it.
The address rule itself is in [`../addresses.md`](../addresses.md),
"Interface-language prefix".

## Portable rules

- **One book, an address per language.** `/es/<path>` is the Spanish
  interface's address for `/<path>`, `/pt/<path>` the Portuguese one's, and
  `/it/<path>` the Italian one's, and `/de/<path>` the German one's. The prefix is never part of a book's identity:
  `canonicalBook` is the same at each, and so are the reading place, the
  kept copy, and marks.
- **The prefix is the controls' language, never the book's.** Every book
  has every address whatever language it is in: a French book reads with
  English controls at `/<book>` and Spanish ones at `/es/<book>`, for the
  learner and the bilingual reader alike. A Spanish book's plain address is
  English controls around Spanish text.
- **The plain address follows the reader.** Opened by a reader whose
  interface language is Spanish, Portuguese, Italian or German (their choice, else their
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
- **A book names one address for search.** Every address of a book
  declares the same canonical: the address of the language its text is in
  when Tale's interface speaks that language, otherwise the plain address. A
  Portuguese book's canonical is `/pt/<book>` at each of its addresses; an
  English or a French book's is `/<book>`. A book declares no language
  alternates (`hreflang`): its other addresses are the same text with other
  controls, not translations of it, and are offered to readers, not to
  search. The same holds for an authored tale, by the language its author
  declared.

## Observing it

- `addressPath` is the path in the address the reader is at once the page
  has settled, after any move.
- `canonicalAddress` is the address the page declares as canonical,
  absolute.
- `languageAlternates` is the list of languages the page declares an
  alternate (`hreflang`) for, in document order; empty when it declares none.
- `copiedUrl` is the address a passage copy carries as it is written, before
  any plan tip replaces it ([`../marks.md`](../marks.md)).
- `canonicalBook`, `interfaceLanguage`, `bookLanguage` and `readerBlock` are
  as in the scenarios above.

## Setup

- A signed-out device with no restored state for each `clean` step.
- `Dracula` at `/dracula-scenario`, an English book long enough to read
  several screens.
- `Dom Casmurro` at `/dom-casmurro-scenario`, a Portuguese book.

These names are test material, not prescribed production content.

## Steps

**1. On a fresh device whose preferred language is Mexican Spanish, open
`/dracula-scenario`.**

The reader lands at `/es/dracula-scenario`, with Spanish controls around the
English book. The page names `https://tale.fyi/dracula-scenario`, the English
book's English address, as its canonical, and declares no language
alternates.

**2. Copy a passage.**

The copy carries `https://tale.fyi/dracula-scenario`, without the prefix.

**3. On a fresh device whose preferred language is Brazilian Portuguese,
open `/dracula-scenario`.**

The reader lands at `/pt/dracula-scenario`, with Portuguese controls around
the English book. The canonical is the same plain address, and there are
still no alternates.

**4. On a fresh device whose preferred language is English, open
`/es/dracula-scenario`.**

The address holds and the controls are Spanish. The canonical is the same
plain address, and there are no alternates.

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

**10. On a fresh German device (`de-DE`), open `/dracula-scenario`.**

The reader lands at `/de/dracula-scenario`, with German controls around the
English book. The canonical is the plain address, and there are no
alternates.

**11. On a fresh English device, open `/de/dracula-scenario`.**

The address holds and the controls are German. The book is the same English
book; the canonical is the plain address, with no alternates.

**12. Read several screens at the German address.**

**13. End the session and open `/dracula-scenario`.**

English controls at the plain address, at the place read to in step 12.

**14. Choose Deutsch.**

The address becomes `/de/dracula-scenario`, for the same book.

**15. End the session and open `/dracula-scenario`.**

The chosen German outranks the English device: German controls at
`/de/dracula-scenario`, at the same saved place.

**16. Choose English.**

The address becomes `/dracula-scenario`, for the same book.

**17. End the session and open `/de/dracula-scenario`.**

The chosen English outranks the German address: English controls at the plain
address, at the same saved place.

**18. On a fresh English device, open `/es/dom-casmurro-scenario`.**

The address holds: Spanish controls around the Portuguese book. The page
names `https://tale.fyi/pt/dom-casmurro-scenario`, the Portuguese book's
Portuguese address, as its canonical, and declares no language alternates.

**19. On a fresh English device, open `/dom-casmurro-scenario`.**

English controls around the Portuguese book, at the plain address. The
canonical is still `https://tale.fyi/pt/dom-casmurro-scenario`.

## Version 5 (TAL-424)

Version 5 replaces each book page's full set of language alternates with one
canonical, the address of the book's own language, and adds a Portuguese
book to prove that canonical is neither the address opened nor the plain
one. Routing, the reading place and every address's identity are unchanged.
A client still declaring alternates between a book's addresses is red.

## Version 4 rollout (TAL-456)

Version 4 retains the first nine actions, adds the German alternate to the
existing full-alternate observations, and adds German device routing,
explicit-address precedence, declared alternates, shared progress and a
persistent German choice. Clients without German routes/chrome are
intentionally red. Existing book, plan and passage URLs retain their identity.

## Platform note

A native client has no address bar and takes its interface language from the
operating system, so this scenario is the web's. The part every client
shares — a `/es/…`, `/pt/…`, `/it/…` or `/de/…` link opens the same book as the plain one — is the
address rule in [`../addresses.md`](../addresses.md) and its vectors.

## What this does not cover

- Translated page titles, descriptions and share cards. They follow the
  interface language at each address, but a scenario proves which address
  serves which language, not wording.
- The sitemap, which names each book once, at its canonical.
- Pages whose own words are translated (the library, shelves, directories),
  which keep naming every language's address as alternates.
- A further interface language; its prefix is the language's primary
  subtag, as `es`, `pt`, `it` and `de` are.
