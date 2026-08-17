# tale-spec

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
shared JSON operation vectors are valuable implementation tests, but they are
not client conformance.

Deterministic fixture content, fonts, clocks, media, and network conditions are
allowed. They must enter through the launched product's test environment and
must not bypass the user-facing workflow being specified. Persistence is
observed by terminating and relaunching the product, not by asserting directly
on an internal store.

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
implementation PR retains its own exact pre-implementation failure and
post-implementation pass, plus a mutation receipt showing that removing the
production behavior makes the scenario fail again. Client-owned unit tests may
explain or localize a failure, but they do not replace that integration proof.

## Current semantic vectors

The files under `vectors/` specify portable operations and edge cases for
implementation-owned unit tests. See `spec/harness.md`. They are shared
semantic fixtures, not the black-box conformance suite described above.

A missing, unknown, skipped, or unrunnable surface scenario fails closed. Do
not begin or continue product implementation for that behavior until the
surface harness exists and the required intentional-red scenario runs. Do not
mark an implementation PR ready while its scenario is missing, unrunnable, or
red. Until a client passes through its real product UI, do not describe it as
conforming.
