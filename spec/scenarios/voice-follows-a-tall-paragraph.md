# Scenario: the voice keeps its words on screen through a tall paragraph

**The claim.** A reader who is listening can always see the words being
spoken. When a paragraph is taller than the screen, the page follows the voice
*inside* the paragraph, so the narrator never reads past the bottom of what is
visible (Sam, 2026-10-24: on iOS, "if you are listening to a long paragraph
that extends past a screen, it can read past the words that are visible").

Read [`README.md`](README.md) first, then [`../reader.md`](../reader.md)
("`follow-scroll-top`"), whose rule this scenario proves through the running
client, and [`../follow-scroll.md`](../follow-scroll.md), which decides when
narration may move the page. The executable plan beside this prose owns the
ordered actions and observations. Adapters start and wait on the real
narration transport, and observe only the visible or accessible surface.

## The rule it proves

`reader.md` already says how to follow a tall paragraph.
- **A tall paragraph** is one taller than the reading viewport.
- **Its spoken position** is the point inside it at the narration's progress
  through it.
- **The page keeps that point** inside a band from 28% to 60% of the reading
  viewport's height, as long as follow-scroll is engaged.

This scenario makes the rule observable.
- **The spoken word is visible.** Whenever narration is in a tall paragraph
  and follow-scroll is engaged, the word being spoken, or the read-along
  phrase that holds it, lies wholly inside the reading viewport: below the
  reader's bar and above the bottom edge.
- **Progress comes from timing.** The spoken position comes from the
  read-along timing within the paragraph: the current phrase's place among the
  paragraph's phrases. It never comes from the paragraph's start time alone.
- **The reader keeps control.** A reader who scrolls away disengages
  follow-scroll, exactly as `follow-scroll.md` says; this scenario doesn't
  change that.

## Setup

- One signed-out device, preferred language English, the network reachable.
- A fixture book with a read-along. Paragraph **T** is at least three reading
  viewports tall on the test device, and its timing holds at least twelve
  phrases spread through it. The paragraph before **T** is short.
- The fixture's recording can be moved through quickly. The adapter may seek
  the transport to a media time; it never moves the page itself.

## Steps

**1. Open the book at T and start narration at T's beginning.**

Narration is playing in **T**. The spoken phrase is inside the reading
viewport.

**2. Seek the narration to the middle of T: halfway through its phrases.**

The page has followed. The spoken phrase is inside the reading viewport, and
the page's scroll position is different from step 1's.

**3. Seek the narration to T's last phrase.**

The spoken phrase is inside the reading viewport. At no point between steps 1
and 3 did the spoken phrase leave it.

**Sampling.** While narration plays, the adapter samples the phrase's position
every 250 ms or more often, and does nothing else between two samples. Some
harnesses can't always read the screen that fast (a single XCUITest frame
read can occasionally take longer). A gap longer than 250 ms caused by the
harness's own read is a measured limit of that harness, not a failure. The
adapter reports the gap distribution with its result: the number of samples,
the median, the 99th percentile, the longest gap and how many gaps exceeded
250 ms. Every sample it did take must find the phrase inside the reading
viewport (Sam, 2026-10-25).

**4. Scroll the page away by hand while narration continues.**

Follow-scroll disengages, as `follow-scroll.md` says. The page stays where the
reader put it, even though the spoken phrase is now off screen.

## What this does not cover

- How smoothly the page moves, which is the client's.
- Paragraphs with no read-along timing inside them. Those are followed by
  their own top edge, as `reader.md` already says for short paragraphs.
