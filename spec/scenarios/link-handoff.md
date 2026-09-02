# Scenario: link handoff

**The claim.** A Tale address remains the interface when a native app is
installed. Tapping a supported passage link opens the app on that exact
passage, whether the app is cold or warm; continuing the same browser activity
on another device does the same. A URL the app does not support remains in the
browser unchanged.

Read [`README.md`](README.md) first. This scenario is portable to a native
client whose platform supports verified web links and cross-device activity
continuation. The website is the producer of that platform association; its
real HTTPS response is tested at the HTTP boundary, not counted as a client
surface run.

## Setup

- The production app is installed through a distribution-signed build, with
  the public domain association active. A test-only URL scheme, launch
  argument, or direct call into a router is not a substitute.
- Safari begins on a different origin from `tale.fyi`; tapping a same-domain
  link can intentionally remain in Safari and would not exercise the system's
  verified-link decision.
- The fixture tale has a stable public URL and a passage far below its cover.
  Call that passage **P** and its fragment **A**.
- A second signed-in platform device can offer Safari's browsing activity to
  the test device for the handoff step.

## Steps

**1. With the app not running, tap the Tale passage link in Safari.**

The system opens the app. The fixture tale is visible, its cover is offscreen,
and **P** is at the reading line. The fragment has survived delivery.

**2. Return to Safari without terminating the app, then tap the same link.**

The already-running app comes forward on the same tale and **P** is again at
the reading line. Warm delivery does not keep the app's previous selection or
discard the fragment.

**3. Continue the same Safari page from the other device.**

The app opens on the same tale and **P** at the reading line. Activity
continuation and a link tap are two deliveries of one public address, not two
route contracts.

**4. Return to Safari and tap an unsupported Tale URL.**

Safari stays foreground at precisely the tapped URL, including its query and
fragment. The app neither invents a native screen nor rewrites the address.

## What this does not cover

- Installation, association refresh latency, or recovery from an Apple CDN
  outage. The platform matrix records the installed build and association
  evidence for each run.
- A same-domain tap while already browsing `tale.fyi`; Safari deliberately
  keeps that navigation in the browser.
- Custom URL schemes, notifications, search results, or third-party browsers.
- Reading progress changes after landing. Opening a fragment is programmatic
  movement and is covered by the reading intent contract.

## What the next scenario would extend

A later scenario can cover a plan-tip URL whose newest mark and explicit
fragment disagree, after the product contract chooses which instruction wins.

