#!/usr/bin/env python3
"""
Five candidate desktop menu triggers, live and interactive.

Every one obeys the same four research constraints, so the choice is purely
aesthetic:

  * The three stacked lines survive in all five. NN/g's recognizability study
    found the shape is now deeply ingrained; abandoning it is the one change
    that reliably breaks comprehension.
  * All five carry a visible "Menu" label. Icon-only is unreadable to anyone
    who doesn't recognise the glyph instantly.
  * All five are scaled up for desktop. A phone-sized icon goes nearly
    invisible on a large screen - which is the actual fault with the current
    one, more than its styling.
  * All five look pressable. Extreme flat design measurably hurts
    discoverability.

Motion is transform/opacity only, so it runs on the compositor rather than
forcing layout on every frame, and all of it is disabled under
prefers-reduced-motion.
"""

import base64
from pathlib import Path

OUT = Path("out")
DEST = Path("/tmp/menu-triggers.html")
MEDIA = OUT / "_next" / "static" / "media"

DISPLAY = f"data:font/woff2;base64,{base64.b64encode(next(MEDIA.glob('rammetto*.woff2')).read_bytes()).decode()}"

CSS = f"""
@font-face {{ font-family: display; src: url({DISPLAY}) format("woff2"); font-display: swap; }}
:root {{
  --primary: oklch(0.76 0.09 220);
  --primary-fg: oklch(0.2 0.04 262);
  --accent: oklch(0.7 0.14 348);
  --bg: oklch(0.23 0.032 262);
  --fg: oklch(0.93 0.012 240);
  --muted: oklch(0.75 0.02 250);
}}
* {{ box-sizing: border-box; }}
body {{ margin: 0; padding: 40px 20px 90px; background: oklch(0.17 0.025 262); color: var(--fg);
        font: 400 16px/1.55 ui-sans-serif, system-ui, sans-serif; }}
h1 {{ max-width: 1100px; margin: 0 auto 6px; font-family: display; font-size: 1.6rem; }}
.sub {{ max-width: 1100px; margin: 0 auto 38px; color: var(--muted); font-size: .95rem; }}
.opt {{ max-width: 1100px; margin: 0 auto 34px; }}
.head {{ display: flex; align-items: baseline; gap: 12px; margin-bottom: 6px; }}
.badge {{ font-family: display; font-size: .72rem; letter-spacing: .08em;
          background: var(--primary); color: var(--primary-fg); padding: 5px 10px; }}
.nm {{ font-family: display; font-size: 1.1rem; }}
.why {{ margin: 0 0 12px; color: var(--muted); font-size: .92rem; max-width: 80ch; }}

.bar {{ display: flex; align-items: center; justify-content: space-between;
        padding: 0 34px; height: 92px;
        background: radial-gradient(120% 220% at 80% 0%, oklch(0.28 0.05 265), oklch(0.23 .032 262) 60%);
        border: 1px solid oklch(1 0 0 / 12%); }}
.wm {{ font-family: display; color: var(--primary); font-size: 1.05rem; }}
.right {{ display: flex; align-items: center; gap: 20px; }}
.cta {{ display: inline-flex; align-items: center; border: 3px solid var(--fg);
        box-shadow: 4px 4px 0 var(--fg); background: var(--primary); color: var(--primary-fg);
        font-family: display; font-size: .72rem; text-transform: uppercase; padding: 9px 16px; }}

/* ---------- shared trigger base ---------- */
.trg {{ display: inline-flex; align-items: center; gap: .7rem; cursor: pointer;
        background: none; border: 0; color: var(--fg); font: inherit; padding: 10px 6px; }}
.trg-label {{ font-size: 1rem; font-weight: 500; letter-spacing: .01em; }}
.lines {{ display: grid; gap: 5px; width: 30px; }}
.lines i {{ display: block; height: 3px; background: currentColor; border-radius: 1px;
            transform-origin: center; }}

/* ---------- 1 tracking ---------- */
/* Lines slip sideways like a tape losing tracking, then lock back. Staggered
   so it reads as interference rather than a slide. */
.t1 .lines i {{ transition: transform .26s cubic-bezier(.2,.9,.2,1); }}
.t1:hover .lines i:nth-child(1) {{ transform: translateX(-5px); }}
.t1:hover .lines i:nth-child(2) {{ transform: translateX(4px); }}
.t1:hover .lines i:nth-child(3) {{ transform: translateX(-2px); }}
.t1:hover .trg-label {{ color: var(--primary); }}
.t1 .trg-label {{ transition: color .2s; }}

/* ---------- 2 level meter ---------- */
/* Lines behave like a graphic EQ: scaled from the left, staggered delays. */
.t2 .lines i {{ transform: scaleX(1); transform-origin: left;
                transition: transform .3s cubic-bezier(.3,1.2,.4,1); }}
.t2:hover .lines i:nth-child(1) {{ transform: scaleX(.55); transition-delay: 0s; }}
.t2:hover .lines i:nth-child(2) {{ transform: scaleX(1); transition-delay: .05s; }}
.t2:hover .lines i:nth-child(3) {{ transform: scaleX(.75); transition-delay: .1s; }}
.t2 .lines {{ width: 34px; }}

/* ---------- 3 keycap ---------- */
/* A physical deck button: 3px edge, 5px offset shadow, presses into it. The
   most affordance of the five, and the same kit as every other button. */
.t3 {{ border: 3px solid var(--fg); box-shadow: 5px 5px 0 var(--fg);
       background: oklch(.2 .03 262); padding: 11px 18px;
       transition: transform .15s, box-shadow .15s; }}
.t3:hover {{ transform: translate(3px,3px); box-shadow: 2px 2px 0 var(--fg); }}
.t3:active {{ transform: translate(5px,5px); box-shadow: 0 0 0 var(--fg); }}
.t3 .trg-label {{ font-family: display; font-size: .82rem; text-transform: uppercase;
                  letter-spacing: .04em; }}
.t3 .lines {{ width: 24px; }}

/* ---------- 4 tape reels ---------- */
/* The middle line becomes tape strung between two spools; the spools turn on
   hover. Outer lines stay put so the three-line silhouette holds. */
.t4 .reels {{ position: relative; width: 40px; height: 26px; }}
.t4 .lines {{ position: absolute; inset: 0; width: 40px; align-content: center; gap: 7px; }}
.t4 .reel {{ position: absolute; top: 50%; width: 13px; height: 13px; margin-top: -6.5px;
             border: 2px solid var(--primary); border-radius: 50%; background: oklch(.2 .03 262);
             transition: transform .5s linear; }}
.t4 .reel::after {{ content: ""; position: absolute; inset: 4px; border-radius: 50%;
                    border-top: 2px solid var(--primary); }}
.t4 .reel-l {{ left: 0; }}
.t4 .reel-r {{ right: 0; }}
.t4:hover .reel {{ transform: rotate(180deg); }}
.t4 .lines i:nth-child(2) {{ background: var(--primary); }}

/* ---------- 5 scan sweep ---------- */
/* A bright bar passes down through the lines like a CRT refresh. Clipped to
   the icon so it reads as the screen redrawing, not a loading bar. */
.t5 .scanbox {{ position: relative; overflow: hidden; padding: 4px 0; }}
.t5 .sweep {{ position: absolute; left: -10%; right: -10%; height: 10px; top: -14px;
              background: linear-gradient(transparent, var(--primary), transparent);
              opacity: 0; }}
.t5:hover .sweep {{ animation: sweep 700ms ease-in-out; }}
@keyframes sweep {{
  0% {{ transform: translateY(0); opacity: 0; }}
  15% {{ opacity: .9; }}
  85% {{ opacity: .9; }}
  100% {{ transform: translateY(46px); opacity: 0; }}
}}
.t5 .lines i {{ transition: background-color .2s; }}
.t5:hover .lines i {{ background: var(--primary); }}

/* the one being replaced */
.old .lines {{ width: 22px; gap: 4px; }}
.old .lines i {{ height: 2px; }}
.old .trg-label {{ font-size: .95rem; }}

@media (prefers-reduced-motion: reduce) {{
  .trg, .trg *, .lines i, .reel {{ transition: none !important; animation: none !important; }}
  .t1:hover .lines i, .t2:hover .lines i, .t3:hover, .t4:hover .reel {{ transform: none; }}
}}
"""


def bar(cls: str, inner: str) -> str:
    return f"""<div class="bar">
      <span class="wm">Matt Sem</span>
      <div class="right">
        <span class="cta">Buy the book</span>
        {inner}
      </div>
    </div>"""


LINES = '<span class="lines" aria-hidden="true"><i></i><i></i><i></i></span>'


def simple(cls: str) -> str:
    return f'<button class="trg {cls}">{LINES}<span class="trg-label">Menu</span></button>'


REELS = f"""<button class="trg t4">
  <span class="reels" aria-hidden="true">
    {LINES}
    <span class="reel reel-l"></span><span class="reel reel-r"></span>
  </span>
  <span class="trg-label">Menu</span>
</button>"""

SWEEP = f"""<button class="trg t5">
  <span class="scanbox" aria-hidden="true"><span class="sweep"></span>{LINES}</span>
  <span class="trg-label">Menu</span>
</button>"""


def opt(num, name, why, inner):
    return f"""<section class="opt">
      <div class="head"><span class="badge">{num}</span><span class="nm">{name}</span></div>
      <p class="why">{why}</p>
      {bar("", inner)}
    </section>"""


HTML = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Matt Sem — five menu triggers</title>
<style>{CSS}</style></head><body>

<h1>Five menu triggers</h1>
<p class="sub">Hover each one — the difference is mostly in the motion. All five keep the three-line
shape and the word &ldquo;Menu&rdquo;, and all five are scaled up for desktop, which is the real
fault with the current one. The last strip shows what&rsquo;s there now, for comparison.</p>

{opt("01", "Tracking", "The lines slip sideways and lock back, like a tape losing tracking for a second. Staggered so it reads as interference rather than a slide. The most era-specific of the five and the quietest at rest.", simple("t1"))}

{opt("02", "Level meter", "The lines behave like a graphic EQ on a stereo — scaling from the left with staggered delays, so they land like three channels catching a beat. Playful, and it never stops reading as a menu.", simple("t2"))}

{opt("03", "Keycap", "A physical deck button: 3px edge, 5px offset shadow, and it presses into its own shadow when you click. Far and away the most obviously clickable, and it&rsquo;s the same kit as every other button on the site.", simple("t3"))}

{opt("04", "Tape reels", "The middle line becomes tape strung between two spools that turn on hover. The outer lines stay put so the three-line silhouette holds. The most distinctive, and the one that most rewards a second look.", REELS)}

{opt("05", "Scan sweep", "A bright cyan bar passes down through the lines like a CRT redrawing. Clipped to the icon so it reads as a screen refreshing rather than a progress bar. Subtle at a glance, obvious once you catch it.", SWEEP)}

{opt("&mdash;", "What&rsquo;s there now", "22px, 2px lines, flat, no affordance. The problem isn&rsquo;t only that it&rsquo;s plain: at this size on a desktop screen it barely registers as a control at all.", simple("old"))}

</body></html>
"""

DEST.write_text(HTML, encoding="utf-8")
print(f"wrote {DEST} ({DEST.stat().st_size/1024:.0f} KB)")
