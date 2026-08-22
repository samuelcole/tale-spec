# tale-spec agent guide

This repository defines the product behavior that every Tale client must ship.

## Conformance is a user-surface integration test

Reserve the word **conformance** for black-box tests against the real
user-facing product. A conforming runner:

- launches the actual web reader route or native app;
- acts only through user-facing inputs such as navigation, gestures, taps,
  typing, system lifecycle changes, and relaunches;
- observes rendered, accessible, navigational, media, and persisted behavior
  through that same surface; and
- exercises the production code path a user runs.

It must not qualify a client by importing a reducer, coordinator, library
function, or test-only adapter. Web unit tests, Swift package tests, and the
shared JSON semantic vectors are valuable implementation tests, but they are
not client conformance.

Deterministic fixture content, fonts, clocks, media, and network conditions are
allowed. They must enter through the launched product's test environment and
must not bypass the user-facing workflow being specified. Persistence is
observed by terminating and relaunching the product, not by asserting directly
on an internal store.

Every `spec/scenarios/<id>.md` has a matching executable
`scenarios/<id>.json`. Change the pair together and run `npm run check:pairs`.
The prose owns intent and portability boundaries; the executable plan owns the
ordered actions and expected observations. Client adapters translate actions
into native user input and report observations, but never restate, omit, or
weaken the plan's expectations.

## Red-green is the delivery process

For behavior the web reader already ships:

1. Characterize the current web behavior with a portable surface scenario.
2. Prove that scenario green against the actual rendered web reader.
3. Sync it to each unfinished client and preserve the expected red result.
4. Implement the client feature through its production user surface.
5. Make the same scenario green without weakening or skipping it.

For a new feature:

1. Write the portable surface scenario first. Every client is red.
2. Implement the feature in the reference web product until it is green.
3. Dispatch the remaining client implementations; each stays red until its
   user-facing feature is complete.

If a client is green while user-facing functionality remains to be built, the
conformance suite is incomplete. Add a web-green/client-red scenario before
continuing implementation. Unknown scenarios or actions fail closed. Missing,
skipped, disabled, expected-failure, and test-only implementations never count
as conformance.

A surface-scenario PR records its required starting state: web-green and
unfinished-client-red for existing behavior, or all-red for a new feature. An
implementation PR records its own exact pre-implementation failure and
post-implementation pass. Client-owned unit tests may explain or localize a
failure, but they do not replace that integration proof.

## Foundation work may precede the surface harness

Foundation work is work that adds no user-facing behavior: an app target, a
scheme, a CI job, a transport, a store. No surface scenario can describe it, so
requiring one would deadlock delivery.

For a foundation with no user-facing behavior, reproduce the missing contract
with the narrowest appropriate unit, integration, or operational test, and
record why its failure is expected. A build or launch check is the right proof
for a target, a scheme, or CI; a focused unit test is the right proof for a
transport or store invariant.

The lane is narrow. Foundation work receives no conformance credit, cannot make
a client green, and cannot support a conformance claim. A foundation PR states
its immediate consumer and does not contain a wired-up product feature. Do not
build generalized schedulers, transaction systems, cache layers, or proof
frameworks for hypothetical future use. Once behavior is reachable through the
product surface, the scenario-first lane applies again.

## Growth is a mandatory pause

Record the first-review base SHA and total changed lines (additions plus
deletions), then compare later diffstats against that same base. A diff that
grows past 1.5× its total changed lines at first review is a mandatory pause,
not an automatic deletion: re-check the original acceptance, classify the
branch's hunks as keep/defer/discard, and normally re-cut from the original
base with only approved `keep` hunks. Continuing the existing branch requires
the product owner's explicit decision and recorded rationale. Preserve the
abandoned branch for forensics; do not destructively reset it.

The rule binds this repository too. Building a framework to enforce a rule is
the growth this rule exists to catch.

## Current semantic vectors

The files under `vectors/` specify portable operations and edge cases for
implementation-owned unit tests. See [`spec/harness.md`](spec/harness.md). They
are shared semantic fixtures, not the black-box conformance suite described
above.

A missing, unknown, skipped, or unrunnable surface scenario fails closed. Do
not begin or continue user-facing product implementation for that behavior
until the surface harness exists and the required intentional-red scenario
runs. Foundation work is the only exception, and it carries no conformance
credit. Do not mark an implementation PR ready while its scenario is missing,
unrunnable, or red. Until a client passes through its real product UI, do not
describe it as conforming.
