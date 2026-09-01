#!/usr/bin/env python3
"""
Render four wordmark directions as outlined SVG, plus the black-and-white and
small-size tests that decide whether any of them actually works.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from wordmark_core import UPEM, letters  # noqa: E402

DEST = Path("/tmp/wordmark-options.html")

# Cap height and descender room for Rammetto, measured rather than guessed.
CAP = 1462
PAD = 90


def paths(text: str, tracking: int = 0, dy: int = 0):
    glyphs, width = letters(text, tracking)
    body = "".join(
        f'<path transform="translate({x + 0} {dy})" d="{d}"/>' for d, x in glyphs
    )
    return body, width


def one_line(text: str, tracking: int = 0) -> str:
    """A: a single line, kerned by hand."""
    body, w = paths(text, tracking)
    return (
        f'<svg class="wm" viewBox="{-PAD} {-CAP - PAD} {w + PAD * 2} {CAP + PAD * 2}" '
        f'xmlns="http://www.w3.org/2000/svg"><g transform="scale(1 -1)">{body}</g></svg>'
    )


def stacked(a: str, bl: str, tracking: int = 0) -> str:
    """B: two lines, tight leading, optically flush left."""
    top, wt = paths(a, tracking)
    bot, wb = paths(bl, tracking)
    w = max(wt, wb)
    # Leading measured from baseline to baseline, so it must clear the cap
    # height plus a gap; 1.02 had the two lines touching.
    lead = int(CAP * 1.22)
    return (
        f'<svg class="wm" viewBox="{-PAD} {-CAP - PAD} {w + PAD * 2} {CAP + lead + PAD * 2}" '
        f'xmlns="http://www.w3.org/2000/svg">'
        f'<g transform="scale(1 -1)">{top}</g>'
        f'<g transform="translate(0 {lead}) scale(1 -1)">{bot}</g>'
        f"</svg>"
    )


def sliced(text: str, tracking: int = 0) -> str:
    """
    C: the tracking cut. The mark is drawn twice and each copy clipped to one
    half, with the lower half nudged sideways — a tape losing its lock for a
    frame. Pure letterform, no added object.
    """
    body, w = paths(text, tracking)
    cut = int(CAP * 0.46)
    shift = 105
    return f"""<svg class="wm" viewBox="{-PAD} {-CAP - PAD} {w + PAD * 2 + shift} {CAP + PAD * 2}"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="upper"><rect x="{-PAD}" y="{-CAP - PAD}" width="{w + PAD * 2 + shift}" height="{CAP - cut + PAD}"/></clipPath>
        <clipPath id="lower"><rect x="{-PAD}" y="{-cut}" width="{w + PAD * 2 + shift}" height="{cut + PAD}"/></clipPath>
      </defs>
      <g clip-path="url(#upper)"><g transform="scale(1 -1)">{body}</g></g>
      <g clip-path="url(#lower)"><g transform="translate({shift} 0) scale(1 -1)">{body}</g></g>
    </svg>"""


def ligature(text: str) -> str:
    """
    D: the twin T's in MATT share one crossbar. The second T is pulled left
    until the arms overlap into a single continuous stroke — the one custom
    letterform move in the set, and the kind of detail that makes a mark
    hard to copy by picking the same font.
    """
    from wordmark_core import KERN

    saved = KERN.get("TT")
    KERN["TT"] = -820  # overlap the arms rather than merely tighten them
    body, w = paths(text, 0)
    if saved is None:
        del KERN["TT"]
    else:
        KERN["TT"] = saved
    return (
        f'<svg class="wm" viewBox="{-PAD} {-CAP - PAD} {w + PAD * 2} {CAP + PAD * 2}" '
        f'xmlns="http://www.w3.org/2000/svg"><g transform="scale(1 -1)">{body}</g></svg>'
    )


OPTIONS = [
    (
        "A",
        "Kerned line",
        "The name on one line with the spacing rebuilt by hand — the A tucked under the T's arm, "
        "the word gap cut well below the font's own. Nothing added; it just stops looking like "
        "type someone typed.",
        one_line("MATT SEM"),
    ),
    (
        "B",
        "Stacked",
        "Two lines, tight leading, flush left. In a header corner this reads considerably larger "
        "than the single line at the same width, because the letters can grow into the height "
        "instead of running sideways.",
        stacked("MATT", "SEM"),
    ),
    (
        "C",
        "Tracking cut",
        "The mark is sliced horizontally and the lower half offset, like a tape losing its lock "
        "for one frame. Still pure letterform — nothing is added to the name — and it is the most "
        "specific to this book of the four.",
        sliced("MATT SEM"),
    ),
    (
        "D",
        "Shared crossbar",
        "The two T's in MATT are pulled together until their arms merge into one continuous "
        "stroke. This is the only variant with an actual custom letterform, which is what makes a "
        "mark hard to reproduce by guessing the font.",
        ligature("MATT SEM"),
    ),
]

CSS = """
:root { --primary: oklch(0.76 0.09 220); --bg: oklch(0.23 0.032 262);
        --fg: oklch(0.93 0.012 240); --muted: oklch(0.75 0.02 250); }
* { box-sizing: border-box; }
body { margin: 0; padding: 40px 20px 80px; background: oklch(0.17 0.025 262);
       color: var(--fg); font: 400 16px/1.55 ui-sans-serif, system-ui, sans-serif; }
h1 { max-width: 1100px; margin: 0 auto 6px; font-size: 1.5rem; }
.sub { max-width: 1100px; margin: 0 auto 38px; color: var(--muted); font-size: .95rem; }
.opt { max-width: 1100px; margin: 0 auto 40px; border: 1px solid oklch(1 0 0 / 12%); }
.head { display: flex; align-items: baseline; gap: 12px; padding: 14px 20px 0; }
.badge { background: var(--primary); color: oklch(0.2 0.04 262); padding: 4px 9px;
         font-weight: 700; font-size: .72rem; letter-spacing: .08em; }
.nm { font-size: 1.05rem; font-weight: 600; }
.why { margin: 8px 20px 16px; color: var(--muted); font-size: .92rem; max-width: 80ch; }

/* Three tests every candidate has to pass, shown side by side. */
.tests { display: grid; grid-template-columns: 1.5fr 1fr 1fr; border-top: 1px solid oklch(1 0 0 / 12%); }
.test { padding: 26px 20px; border-right: 1px solid oklch(1 0 0 / 12%); }
.test:last-child { border-right: 0; }
.test-label { font-size: .68rem; letter-spacing: .12em; text-transform: uppercase;
              color: var(--muted); margin-bottom: 16px; }
.wm { display: block; }
.brand .wm { height: 46px; fill: var(--primary); }
.brand { background: var(--bg); }
.mono { background: #fff; }
.mono .wm { height: 40px; fill: #000; }
.tiny .wm { height: 17px; fill: var(--fg); }
.tiny { background: var(--bg); }
"""

BODY = "".join(
    f"""<section class="opt">
      <div class="head"><span class="badge">{k}</span><span class="nm">{name}</span></div>
      <p class="why">{why}</p>
      <div class="tests">
        <div class="test brand"><div class="test-label">In brand colour, header size</div>{svg}</div>
        <div class="test mono"><div class="test-label">Flat black on white</div>{svg}</div>
        <div class="test tiny"><div class="test-label">17px — favicon / mobile</div>{svg}</div>
      </div>
    </section>"""
    for k, name, why, svg in OPTIONS
)

HTML = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Matt Sem — wordmark options</title>
<style>{CSS}</style></head><body>
<h1>Four wordmarks</h1>
<p class="sub">All drawn as outlined vector rather than styled text, so they never wait on a font to
load and render identically everywhere. Each is shown three ways, because a mark that only works in
one of them isn't finished: brand colour at header size, flat black on white, and at 17px where a
favicon lives.</p>
{BODY}
</body></html>
"""

DEST.write_text(HTML, encoding="utf-8")
print(f"wrote {DEST} ({DEST.stat().st_size/1024:.0f} KB)")
