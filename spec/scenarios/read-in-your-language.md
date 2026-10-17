# Scenario: read in your language

**The claim.** A reader reads in a language, and Tale leads with it. Before
they choose, that language is their device's. They can choose another — a
learner chooses the language they are learning, not the one their phone is set
to — and the choice outlives the session. Whatever the language, the home page
leads with its shelf, search ranks its books first among equally good matches,
and every book in any other language says which language it is.

Read [`README.md`](README.md) first. This extends
[`library-language.md`](library-language.md), whose shelf, discovery index,
and per-book language this scenario relies on. The executable plan beside this
prose owns the ordered actions and observations.

## Portable rules

- **The reading language** is the reader's choice when they have made one;
  otherwise the first of the device's preferred languages that the library
  holds books in; otherwise English. It is a primary subtag, compared with the
  books' own tags.
- **Choosing.** A language shelf offers one control to read in that language.
  On the shelf of the current reading language, the control shows that it is
  chosen and offers to go back to the device's language. The choice is local
  reading state: it needs no account, and it persists across relaunch.
- **Home.** When the reading language is not English, the home page opens with
  that language's shelf — its title, then its books in shelf order — ahead of
  the rest of the home page, which is otherwise unchanged. An English reading
  language leaves home exactly as it was.
- **Search.** Among results of equal strength — the same kind of match in the
  same kind of field — books in the reading language come first. A stronger
  match in another language still ranks above a weaker one in the reading
  language. Discovery results keep their place ahead of books.
- **Labels.** A book row names its language, by that language's own name,
  whenever it differs from the reading language. With an English reading
  language this is exactly `library-language`'s rule.

## Setup

- One signed-out device with no restored state.
- The fixture library of `library-language`, plus one English book whose title
  shares a prefix with a Portuguese one: `Helen of Troy` (`en`), beside
  `Helena` (`pt`). Under English ordering `Helen of Troy` comes first.
- The device's preferred languages are English unless a step says otherwise.

These names are test material, not prescribed production content.

## Steps

**1. Open the library.**

The home page opens on its ordinary first row; no language shelf leads it.

**2. Search for `hel`.**

`Helen of Troy` is first and `Helena` second; `Helena` is labelled
`Português` and `Helen of Troy` is not.

**3. Open the `Português` shelf and choose to read in Português.**

The shelf's control shows that Português is chosen.

**4. Return to the library.**

The home page opens with the `Português` shelf: its title, then `Dom
Casmurro` and `Helena`.

**5. Search for `hel`.**

`Helena` is now first, unlabelled; `Helen of Troy` second, labelled
`English`.

**6. End the session and reopen the library.**

The home page still opens with the `Português` shelf. The choice persisted.

**7. Open the `Português` shelf and go back to the device's language.**

The control no longer shows Português chosen. The library's home page opens on
its ordinary first row again.

**8. With no choice made, start a fresh device whose preferred language is
Portuguese, and open the library.**

The home page opens with the `Português` shelf without the reader choosing
anything.

## What this does not cover

- Translating the interface: every control here is the existing chrome
  (TAL-216, after this ships).
- More than one reading language at once.
- Syncing the choice across a reader's devices.
- Books in more than one language.

## What the next scenario would extend

Finishing a book offers more to read in that book's language first.
