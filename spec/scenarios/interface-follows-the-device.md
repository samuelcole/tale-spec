# Scenario: the interface follows the device

**The claim.** Tale's controls speak the reader's language when Tale has been
translated into it. Before the reader chooses, that language is their
device's. The interface language belongs to the reader and the book's
language belongs to the book: a Spanish phone opening an English book gets
Spanish controls around English text, never a translated book and never
English controls because the book is English.

Read [`README.md`](README.md) first. This uses the fixture library of
[`library-language.md`](library-language.md). It is independent of
[`read-in-your-language.md`](read-in-your-language.md): the *reading*
language decides which books lead, the *interface* language decides what the
controls say. A learner who reads in Spanish may keep English controls, and a
Spanish speaker may read English books.

## Portable rules

- **The interface language** is the reader's choice when they have made one
  ([`choose-interface-language.md`](choose-interface-language.md)); otherwise
  the first of the device's preferred languages Tale's interface is
  translated into, compared by primary subtag; otherwise English. Today the
  translations are English, Spanish, Portuguese, and Italian. Tale's
  Portuguese is written for Brazil, and any Portuguese device reaches it.
- **What it covers.** The reading chrome: the library, shelves, the book
  page's controls, the player, marks, sharing, keeping a book offline, and
  the messages that explain a failure. It never covers a book's text, title,
  author, or description, which are always the book's own.
- **The book's language** is the language the book declares, whatever the
  interface language. Changing one never changes the other.
- **Observing it.** `interfaceLanguage` is the primary subtag of the language
  the chrome is written in, as a reader would recognise it from the controls'
  own labels. `bookLanguage` is the primary subtag of the language the book's
  text is presented in, as the platform's accessibility surface announces it.
  Neither is read from storage or settings.

## Setup

- A signed-out device with no restored state for each `clean` step.
- The fixture library of `library-language`: `Frankenstein` at
  `/frankenstein-scenario` is English and `Dom Casmurro` at
  `/dom-casmurro-scenario` is Portuguese.

These names are test material, not prescribed production content.

## Steps

**1. On a fresh device whose preferred language is Mexican Spanish
(`es-MX`), open the library.**

The controls are in Spanish. A regional variant reaches the language Tale
has.

**2. Open `/frankenstein-scenario`.**

The controls are still Spanish; the book is English.

**3. Open `/dom-casmurro-scenario`.**

The controls are still Spanish; the book is Portuguese.

**4. On a fresh device whose preferred language is Brazilian Portuguese
(`pt-BR`), open `/dom-casmurro-scenario`.**

The controls are in Portuguese, and so is the book.

**5. On a fresh device whose preferred language is Italian (`it-IT`), open
`/dom-casmurro-scenario`.**

The controls are in Italian; the book is still Portuguese.

**6. On a fresh device whose preferred language is French, open the
library.**

The controls are in English: Tale has no French interface, and falls back to
English rather than to some other language.

**7. On a fresh device whose preferred language is English, open the
library.**

The controls are in English.

## What this does not cover

- Choosing a language other than the device's — that is
  [`choose-interface-language.md`](choose-interface-language.md).
- The wording of any translation. A native speaker reviews copy; a scenario
  only proves which language the controls speak.
- Authoring, curating, account, and internal screens, which stay English.
- A device whose list of preferred languages reaches Spanish only after an
  untranslated one (`fr`, then `es`). The rule above covers it; the next
  scenario would prove it.

## What the next scenario would extend

A third interface language, proving the rule is a list rather than a pair.
