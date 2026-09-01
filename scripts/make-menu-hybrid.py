#!/usr/bin/env python3
"""
Design 01 (marquee takeover) with the two borrowings from 03, shown in the
three states that matter:

  A  hybrid, with a photograph          - what it looks like once Matt sends media
  B  hybrid, no photograph              - what it looks like today, and if the
                                          photos turn out unusable
  C  the original 01, for comparison    - plain type list, no channel marks

Borrowed from 03:
  * CH 01-04 markers, keeping the tape-deck vocabulary and tying the desktop
    menu to the mobile VCR menu
  * the offset-shadow lift as the hover state, rendered as a hard pink
    text-shadow so the type itself carries the button system's 5px offset
    rather than a plain colour change
"""

import base64
from pathlib import Path

OUT = Path("out")
DEST = Path("/tmp/menu-hybrid.html")
MEDIA = OUT / "_next" / "static" / "media"

DISPLAY = f"data:font/woff2;base64,{base64.b64encode(next(MEDIA.glob('rammetto*.woff2')).read_bytes()).decode()}"
KIDS = f"data:image/jpeg;base64,{base64.b64encode((OUT / 'images' / 'matt-sem.jpg').read_bytes()).decode()}"

ITEMS = ["The book", "About", "What's next", "Contact"]

CSS = f"""
@font-face {{ font-family: display; src: url({DISPLAY}) format("woff2"); font-display: swap; }}
:root {{
  --primary: oklch(0.76 0.09 220);
  --primary-fg: oklch(0.2 0.04 262);
  --accent: oklch(0.7 0.14 348);
  --fg: oklch(0.93 0.012 240);
  --muted: oklch(0.75 0.02 250);
}}
* {{ box-sizing: border-box; }}
body {{ margin: 0; padding: 40px 20px 80px; background: oklch(0.17 0.025 262); color: var(--fg);
        font: 400 16px/1.55 ui-sans-serif, system-ui, sans-serif; }}
h1 {{ max-width: 1180px; margin: 0 auto 6px; font-family: display; font-size: 1.6rem; }}
.sub {{ max-width: 1180px; margin: 0 auto 40px; color: var(--muted); font-size: .95rem; }}
.opt {{ max-width: 1180px; margin: 0 auto 46px; }}
.head {{ display: flex; align-items: baseline; gap: 12px; margin-bottom: 6px; }}
.badge {{ font-family: display; font-size: .72rem; letter-spacing: .08em;
          background: var(--primary); color: var(--primary-fg); padding: 5px 10px; }}
.name {{ font-family: display; font-size: 1.1rem; }}
.why {{ margin: 0 0 14px; color: var(--muted); font-size: .92rem; max-width: 78ch; }}

.stage {{ position: relative; overflow: hidden; height: 420px;
          border: 1px solid oklch(1 0 0 / 12%); background: oklch(0.14 0.03 262); }}
.art {{ position: absolute; inset: 0; background-image: url({KIDS});
        background-size: cover; background-position: 72% 30%;
        filter: saturate(.55) brightness(.3); }}
.scrim {{ position: absolute; inset: 0;
  background: linear-gradient(90deg, oklch(.13 .028 262 / 96%) 0%, oklch(.13 .028 262 / 72%) 42%, transparent 78%); }}
.scan {{ position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(to bottom, oklch(1 0 0 / 5%) 0 1px, transparent 1px 3px);
  mix-blend-mode: overlay; }}

.close {{ position: absolute; top: 18px; right: 26px; z-index: 4; color: var(--muted);
          display: flex; align-items: center; gap: .5rem; font-size: .95rem; }}

.list {{ position: relative; z-index: 3; height: 100%; display: flex; flex-direction: column;
         justify-content: center; gap: .55rem; padding: 0 56px; }}

.row {{ display: flex; align-items: baseline; gap: 1.1rem; text-decoration: none;
        width: max-content; transition: transform .22s cubic-bezier(.22,1,.36,1); }}

/* Borrowed from 03: the channel marker. Small, cyan, never competing with
   the label — it is a tag, not a heading. */
/* Fixed width so the markers stack in a clean left column. Without it each
   row is max-content and the markers wander with the label length. */
.ch {{ flex: 0 0 3.4rem; font-family: display; font-size: .68rem; letter-spacing: .12em;
       color: var(--primary); opacity: .6; transition: opacity .2s; }}

.lbl {{ font-family: display; font-size: 2.5rem; line-height: 1.1; color: oklch(1 0 0 / 42%);
        transition: color .2s, text-shadow .22s; }}

/* Borrowed from 03: the offset-shadow lift. Rendered as a hard text-shadow so
   the type itself carries the 5px offset the buttons use, instead of a plain
   colour swap. Same gesture, no box required. */
.row:hover {{ transform: translateX(14px); }}
.row:hover .lbl {{ color: var(--fg); text-shadow: 5px 5px 0 var(--accent); }}
.row:hover .ch {{ opacity: 1; }}

/* State B: no photograph. Nothing to compensate for — the type does it all. */
.stage.nophoto .art, .stage.nophoto .scrim {{ display: none; }}
.stage.nophoto {{ background: radial-gradient(120% 120% at 20% 0%, oklch(.19 .035 265), oklch(.13 .025 262) 70%); }}

/* State C: the original, for comparison. */
.stage.plain .ch {{ display: none; }}
.stage.plain .row:hover .lbl {{ text-shadow: none; }}

@media (prefers-reduced-motion: reduce) {{
  .row, .lbl, .ch {{ transition: none; }}
  .row:hover {{ transform: none; }}
}}
"""


def rows(with_ch: bool = True) -> str:
    out = []
    for i, label in enumerate(ITEMS):
        ch = f'<span class="ch">CH 0{i+1}</span>' if with_ch else ""
        out.append(f'<a class="row" href="#">{ch}<span class="lbl">{label}</span></a>')
    return "".join(out)


def stage(cls: str) -> str:
    return f"""<div class="stage {cls}">
      <div class="art"></div><div class="scrim"></div><div class="scan"></div>
      <div class="close">&times; Close</div>
      <div class="list">{rows(with_ch="plain" not in cls)}</div>
    </div>"""


def opt(num, name, why, cls):
    return f"""<section class="opt">
      <div class="head"><span class="badge">{num}</span><span class="name">{name}</span></div>
      <p class="why">{why}</p>
      {stage(cls)}
    </section>"""


HTML = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Matt Sem — 01 with the 03 borrowings</title>
<style>{CSS}</style></head><body>

<h1>Design 01, with the two things worth taking from 03</h1>
<p class="sub">Hover the rows. The channel markers and the pink offset lift are the borrowings;
everything else is 01. The middle frame is the same design with no photograph, which is what
ships until Matt&rsquo;s media lands.</p>

{opt("A", "Hybrid — with a photograph", "The channel markers sit small and cyan beside each row, and hovering pushes the type right while a hard pink shadow drops behind it at the same 5px offset the buttons use. It reads as the same kit as the rest of the site rather than a generic full-screen menu.", "")}

{opt("B", "Hybrid — no photograph (ships today)", "Same design with the image removed. This is the state that matters most right now: nothing looks broken or empty, because the type was carrying it all along. If Matt&rsquo;s photos turn out to be dark vertical phone snaps, this stays the honest choice.", "nophoto")}

{opt("C", "Original 01, for comparison", "No channel markers, plain colour change on hover. Perfectly decent — but it is also the full-screen big-type menu on every agency site, with nothing tying it to this one.", "plain")}

</body></html>
"""

DEST.write_text(HTML, encoding="utf-8")
print(f"wrote {DEST} ({DEST.stat().st_size/1024:.0f} KB)")
