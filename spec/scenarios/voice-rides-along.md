# Scenario: the voice rides along

**The claim.** Opening keeps the text; playing keeps the voice. A narrated
book that has genuinely begun speaking online can be ended, reopened with no
network, and heard again through the recording's own seams. There is no
download button and no second decision. A narrated book opened but never
played keeps its text only. Offline, when its voice is not on the device, it
is simply a readable book without a Play control.

This is the extension [`kept-on-open.md`](kept-on-open.md) and
[`play-and-pocket.md`](play-and-pocket.md) both reserve. It changes neither
trigger: opening remains enough to keep a book's small text payload, while the
first genuine playback is the reader's intent to keep the much larger
alignment and recording. The alignment still belongs to one exact
`contentVersion` ([`spec/payload.md`](../payload.md)), and offline playback
still uses the transport and timeline [`play-and-pocket.md`](play-and-pocket.md)
already fixes.

Read [`README.md`](README.md) first. An adapter observes this only by taking
the network away and using the launched product. Reading a store, substituting
bundled media after the offline relaunch, or setting an offline flag while
requests can still succeed would make the central claim unfalsifiable.

## Setup

- One device, signed out, with clean reading, text-keep, and narration-keep
  state for two narrated books.
- Both books have a stable public address, text long enough to read normally,
  and a recording in at least two short sections. Their payloads declare
  narration and their pinned alignments name the exact loaded body.
- The first book is played. The second is opened online but never played, so
  its text is kept while its voice is not.
- The content service is reachable when the scenario begins.
- Ordinary reading conditions: default type size, no plan marks open, and no
  passage fragment in either address.

## Genuine playback is the trigger

The first play press does not itself prove that anything was kept. Playback
must genuinely begin: the transport leaves preparation, shows playing, and
its public position advances. Only then may keeping the alignment and audio
begin. A reader who presses Play into a failed request has not played the
book, and a book merely opened in silence has not asked for hundreds of
megabytes of recording.

Keeping runs beside playback. Sound begins from the network without waiting
for the complete recording to land, and the transport remains usable while
the keep finishes. A completed keep is all-or-nothing at playback time:
partial or damaged alignment or audio cannot be presented later as an
offline voice.

## Taking the network away

The session boundary is the ordinary end defined by
[`open-and-read.md`](open-and-read.md). After it, every request the product
makes for book text, alignment, or audio fails as unreachable at or below the
platform transport. The same prohibited substitutes from
[`kept-on-open.md`](kept-on-open.md) apply here.

## Steps

**1. Open the first narrated book online.**

The book opens at its cover and offers its ordinary play control. No control
offers to download, save, or keep the voice separately.

**2. Press play and let the voice genuinely begin.**

The transport first prepares, then shows playing without a second press. Its
position advances from where reading stands. Playback begins promptly; it
does not wait for every audio section to be written before sound starts.

Stay in the ordinary session long enough for the fixture's keep to complete,
then pause. The adapter may wait on a visible keep treatment when the product
offers one, but this scenario does not require a progress control or words for
the background work.

**3. End the session and take the network away. Reopen the first book and
press play.**

- The kept text opens through the same offline fallback
  [`kept-on-open.md`](kept-on-open.md) fixes.
- The play control remains available. Pressing it starts the voice without a
  network and without an error or a second keep gesture.
- Stay through an audio-section boundary. The transport remains playing and
  its position advances beyond the seam; the offline voice is the recording,
  not one cached fragment.

**4. Restore the network, open the second narrated book, and never press
play. End the session and take the network away again.**

The second book's text has had the same ordinary chance to keep as the first.
Its narration has not: no play gesture occurred and no recording began.

**5. Reopen the second book offline.**

The kept text opens. Because this session reached it through the offline
fallback, the product checks whether the exact local voice is complete before
offering playback. It is not, so no Play control or narration explanation
appears. The book remains ordinarily readable, no sound starts, and no remote
URL is treated as a local recording.

**6. Restore the network.**

Without another press, the ordinary Play control fades in, idle. Sound does
not start by itself. Returning connectivity makes the action useful again; it
does not make the decision for the reader.

## What this does not cover

- **A library management surface.** Whether a shelf marks narrated books whose
  voices are present, exposes their size, or offers removal is a separate
  platform surface. This scenario needs no download button and deletes
  nothing.
- **Eviction and storage pressure policy.** A failed or interrupted keep must
  fail closed, but this scenario neither fills the device nor decides what may
  be evicted.
- **Freshness.** An online alignment remains network-first. Replacing a kept
  recording after the producer publishes a new content version belongs with
  kept-text freshness.
- **A separately persisted listening second.** The reading mark still decides
  where a new session begins. This scenario keeps media, not another position.
- **Background playback, highlights, follow-scroll, and reader override.**
  Earlier read-along scenarios own them unchanged.
- **The device matrix.** Declared per platform, not here.

## What the next scenario would extend

1. **Manage the voices on this device** — show which narrated books are kept,
   their weight, and one deliberate removal that leaves the text alone.
2. **Refresh a kept voice** — receive a new content version online without
   mixing its alignment, audio, text, or mark with the old one.
3. **Lose space honestly** — interrupt a keep or exhaust storage, then prove
   playback continues online while the incomplete voice never claims to be
   available offline.
