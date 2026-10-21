# Scenario: choose a language from its shelf

**The claim.** A language's shelf offers to switch Tale to that language,
when Tale speaks it. It is the same choice the reading preferences make, offered
where a reader is most likely to want it: among the books. Choosing it
translates the controls, and from then on the library leads with that
language.

Read [`README.md`](README.md),
[`choose-interface-language.md`](choose-interface-language.md) and
[`read-in-your-language.md`](read-in-your-language.md) first; this scenario
uses their rules, fixture and observations.

## Portable rules

- **The control.** A language shelf whose language Tale's interface is
  translated into offers one control to use Tale in that language. When it
  already is Tale's language, the control shows that it is chosen. A shelf
  whose language Tale's interface does not speak offers no control.
- **One choice.** Choosing it is exactly the interface-language choice of
  `choose-interface-language`: it applies at once, persists like it, moves
  the web address like it, and leaves the reader where they are. Going back
  is the reading preferences' control.
- **Observing it.** `shelfLanguageControl` is `offered`, `chosen`, or
  `absent`.

## Platform note

A client that defers the interface language to the operating system's
per-app language setting (see `choose-interface-language`) may have this
control open that setting instead, and declares this scenario not applicable
with that explanation.

Such a client offers the control only when that setting can make the choice.
On iOS and iPadOS, Settings › Tale shows a Language row only when the device
has more than one preferred language. Even then, the row lists only the
device's preferred languages that Tale speaks. So the shelf offers to use Tale
in a language only when that language is among the device's preferred
languages. Otherwise the shelf offers no control: a control that opens a page
with nothing to choose sends the reader nowhere. The shelf of the language
Tale already speaks still shows it chosen.

## Setup

The fixture library of `read-in-your-language`, on a fresh device whose
preferred language is English.

## Steps

**1. Open the `Português` shelf.**

The controls are English, the shelf offers to use Tale in Português, and every
row is tagged `Português`.

**2. Use Tale in Português.**

The controls are Portuguese, at the shelf's Portuguese address. The control
shows it chosen, and no row is tagged.

**3. Return to the library.**

The home page opens with the `Português` shelf.

**4. End the session and open the library.**

The controls are still Portuguese, and the home page still opens with the
`Português` shelf.

## What this does not cover

- A shelf whose language Tale does not speak; its control is absent by the
  rule above, and the fixture has no such language.
