#!/usr/bin/env python3
"""
Four hero directions, rendered live with the site's real fonts, palette,
copy and photographs.

Every one applies the same three findings, so the choice stays aesthetic:

  * ONE dominant CTA. The current hero runs two equal-weight buy buttons
    plus a "keep scrolling" link plus the rating — four things competing for
    the same glance. Every option here promotes Amazon to the single button
    and demotes Barnes & Noble to a text link.
  * Social proof stays above the fold. Baymard puts the lift from visible
    trust signals at up to 35%, and 4.8 from real readers is the strongest
    thing this page owns.
  * Authentic imagery over decoration. The repo holds an actual 1986
    photograph of these kids, which no stock library can match — two of the
    four are built around it.
"""

import base64
from pathlib import Path

OUT = Path("out")
DEST = Path("/tmp/hero-options.html")
MEDIA = OUT / "_next" / "static" / "media"


def font(stem):
    return f"data:font/woff2;base64,{base64.b64encode(next(MEDIA.glob(stem)).read_bytes()).decode()}"


def img(name):
    return f"data:image/jpeg;base64,{base64.b64encode((OUT / 'images' / name).read_bytes()).decode()}"


DISPLAY = font("rammetto*.woff2")
COVER = img("86-kids-cover.jpg")
KIDS = img("matt-sem.jpg")

CSS = f"""
@font-face {{ font-family: display; src: url({DISPLAY}) format("woff2"); font-display: swap; }}
:root {{
  --primary: oklch(0.76 0.09 220); --primary-fg: oklch(0.2 0.04 262);
  --accent: oklch(0.7 0.14 348); --bg: oklch(0.23 0.032 262);
  --fg: oklch(0.93 0.012 240); --muted: oklch(0.75 0.02 250);
}}
* {{ box-sizing: border-box; }}
body {{ margin: 0; padding: 40px 20px 90px; background: oklch(0.15 0.022 262); color: var(--fg);
        font: 400 16px/1.55 ui-sans-serif, system-ui, sans-serif; }}
h1 {{ max-width: 1180px; margin: 0 auto 6px; font-family: display; font-size: 1.55rem; }}
.sub {{ max-width: 1180px; margin: 0 auto 38px; color: var(--muted); font-size: .95rem; }}
.opt {{ max-width: 1180px; margin: 0 auto 46px; }}
.head {{ display: flex; align-items: baseline; gap: 12px; margin-bottom: 6px; }}
.badge {{ font-family: display; font-size: .72rem; letter-spacing: .08em;
          background: var(--primary); color: var(--primary-fg); padding: 5px 10px; }}
.nm {{ font-family: display; font-size: 1.1rem; }}
.why {{ margin: 0 0 14px; color: var(--muted); font-size: .92rem; max-width: 82ch; }}
.stage {{ position: relative; overflow: hidden; height: 520px;
          border: 1px solid oklch(1 0 0 / 12%); background: var(--bg); }}

/* shared bits */
.kicker {{ font-family: display; font-size: .66rem; letter-spacing: .28em; text-transform: uppercase;
           color: var(--accent); margin: 0 0 14px; }}
.cta {{ display: inline-flex; align-items: center; border: 3px solid var(--fg);
        box-shadow: 5px 5px 0 var(--fg); background: var(--primary); color: var(--primary-fg);
        font-family: display; font-size: .84rem; text-transform: uppercase; letter-spacing: .02em;
        padding: 15px 26px; text-decoration: none; transition: transform .15s, box-shadow .15s; }}
.cta:hover {{ transform: translate(3px,3px); box-shadow: 2px 2px 0 var(--fg); }}
.alt {{ color: var(--muted); font-size: .9rem; text-decoration: underline;
        text-underline-offset: 4px; margin-left: 20px; }}
.alt:hover {{ color: var(--primary); }}
.proof {{ display: flex; align-items: center; gap: .55rem; margin-top: 22px;
          font-size: .88rem; color: var(--muted); }}
.stars {{ color: var(--primary); letter-spacing: 2px; }}
.lede {{ color: var(--muted); line-height: 1.6; }}

/* ---------- 1 overlap ---------- */
/* The title and the cover share one fixed-height band. Everything else -
   kicker above, actions below - lives outside that band, so the cover can
   never sit on top of a control. An earlier version had them all in one
   stack and the book covered the button. */
.h1s {{ display: flex; flex-direction: column; align-items: center; justify-content: center;
        height: 100%; text-align: center; }}
.h1-band {{ position: relative; width: 100%; max-width: 940px; height: 300px;
            display: grid; place-items: center; }}
.h1-title {{ font-family: display; font-size: clamp(2.6rem, 7.4vw, 5.4rem); line-height: .95;
             margin: 0; text-shadow: 0 0 40px oklch(.76 .09 220 / 22%); }}
.h1-cover {{ position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
             height: 290px; z-index: 2; box-shadow: 0 26px 60px oklch(.08 .02 262 / 75%); }}
/* A second copy of the title, clipped to its lower half and stacked above the
   cover: the type passes behind the book at the top and in front at the
   bottom, which is what sells the overlap. */
.h1-front {{ position: absolute; inset: 0; z-index: 3; display: grid; place-items: center;
             pointer-events: none; clip-path: inset(58% 0 0 0); }}

/* ---------- 2 full-bleed 1986 ---------- */
.h2s {{ position: relative; }}
.h2-art {{ position: absolute; inset: 0; background: url({KIDS}) center/cover;
           filter: saturate(.75) brightness(.42); }}
.h2-scrim {{ position: absolute; inset: 0;
  background: linear-gradient(90deg, oklch(.13 .028 262 / 94%) 0%, oklch(.13 .028 262 / 60%) 55%, transparent 90%); }}
.h2-body {{ position: relative; height: 100%; display: flex; flex-direction: column;
            justify-content: center; padding: 0 56px; max-width: 720px; }}
.h2-title {{ font-family: display; font-size: clamp(2.6rem, 6vw, 4.4rem); line-height: .98; margin: 0 0 18px; }}

/* ---------- 3 split poster ---------- */
.h3s {{ display: grid; grid-template-columns: 1.05fr .95fr; height: 100%; }}
.h3-left {{ display: flex; flex-direction: column; justify-content: center; padding: 0 48px; }}
.h3-title {{ font-family: display; font-size: clamp(2.4rem, 4.4vw, 3.6rem); line-height: 1; margin: 0 0 18px; }}
.h3-right {{ position: relative; border-left: 3px solid var(--fg); overflow: hidden;
             background: linear-gradient(160deg, oklch(.3 .06 265), oklch(.2 .03 262)); }}
.h3-right img {{ position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
                 height: 118%; box-shadow: 0 24px 60px oklch(.08 .02 262 / 65%); }}

/* ---------- 4 type first ---------- */
.h4s {{ display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 0 56px;
        position: relative; }}
.h4-title {{ font-family: display; font-size: clamp(2.8rem, 6.4vw, 5rem); line-height: .95; margin: 0; max-width: 15ch; }}
.h4-quote {{ margin: 26px 0 0; padding-left: 20px; border-left: 3px solid var(--accent);
             font-size: 1.05rem; line-height: 1.6; color: var(--fg); max-width: 46ch; }}
.h4-quote span {{ display: block; margin-top: 8px; font-size: .8rem; color: var(--muted);
                  letter-spacing: .1em; text-transform: uppercase; }}
.h4-edge {{ position: absolute; right: -70px; bottom: -60px; height: 420px; opacity: .5;
            transform: rotate(-8deg); }}
"""

STARS = '<span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>'
PROOF = f'<div class="proof">{STARS}<span>4.8 out of 5 from Amazon readers</span></div>'
ACTIONS = (
    '<div><a class="cta" href="#">Buy on Amazon</a>'
    '<a class="alt" href="#">or Barnes &amp; Noble</a></div>'
)

H1 = f"""<div class="h1s">
  <p class="kicker">Strap yourself in. It&rsquo;s 1986</p>
  <div class="h1-band">
    <h2 class="h1-title">The &rsquo;86 Kids</h2>
    <img class="h1-cover" src="{COVER}" alt="">
    <div class="h1-front"><h2 class="h1-title">The &rsquo;86 Kids</h2></div>
  </div>
  <div style="margin-top:30px">{ACTIONS}</div>
  {PROOF}
</div>"""

H2 = f"""<div class="h2s" style="height:100%">
  <div class="h2-art"></div><div class="h2-scrim"></div>
  <div class="h2-body">
    <p class="kicker">Wausau, Wisconsin &mdash; 1986</p>
    <h2 class="h2-title">They were the &rsquo;86 kids.</h2>
    <p class="lede">Bikes, basketball, nicknames, first crushes, and the last summer
      before middle school. A funny, big-hearted memoir of the year everything
      was still ahead of them.</p>
    <div style="margin-top:26px">{ACTIONS}</div>
    {PROOF}
  </div>
</div>"""

H3 = f"""<div class="h3s">
  <div class="h3-left">
    <p class="kicker">A memoir</p>
    <h2 class="h3-title">The &rsquo;86 Kids</h2>
    <p class="lede">Growing up in Wausau, Wisconsin in the mid-1980s. Think
      <em>The Wonder Years</em> meets <em>Seinfeld</em>.</p>
    <div style="margin-top:26px">{ACTIONS}</div>
    {PROOF}
  </div>
  <div class="h3-right"><img src="{COVER}" alt=""></div>
</div>"""

H4 = f"""<div class="h4s">
  <img class="h4-edge" src="{COVER}" alt="">
  <p class="kicker">Strap yourself in. It&rsquo;s 1986</p>
  <h2 class="h4-title">The last summer before everything changed.</h2>
  <blockquote class="h4-quote">Think <em>The Wonder Years</em> meets <em>Seinfeld</em> &mdash;
    467 pages of bikes, basketball and first crushes.
    <span>The &rsquo;86 Kids &middot; Matt Sem</span></blockquote>
  <div style="margin-top:28px">{ACTIONS}</div>
  {PROOF}
</div>"""

OPTIONS = [
    ("01", "Cover overlap",
     "The title is set enormous and the cover sits in front of it, so the type runs behind the book "
     "and back out the other side. The cover becomes the hero object rather than a thumbnail parked "
     "to one side. Borrowed from Superpower, which overlaps its display type with the product shot.",
     H1),
    ("02", "1986, full bleed",
     "The real photograph of these kids fills the frame. This is the one asset no competitor can "
     "copy and no stock library sells, and it does in one glance what the paragraph is currently "
     "trying to do in three lines. Closest references are Eat Hungry Tiger and Faculty Department.",
     H2),
    ("03", "Split poster",
     "Copy on the left, the cover at full height on the right behind a hard edge. The most "
     "straightforward of the four and the easiest to read at a glance; it also survives having no "
     "photography at all. Follows Dropbox's split and Square's restraint.",
     H3),
    ("04", "Type first",
     "No image competing for the opening. An oversized promise, one line about the book, and the "
     "cover slipped off the bottom corner as a tease rather than a display. The most literary of "
     "the four and the fastest to load.",
     H4),
]

BODY = "".join(
    f"""<section class="opt">
      <div class="head"><span class="badge">{k}</span><span class="nm">{n}</span></div>
      <p class="why">{w}</p>
      <div class="stage">{h}</div>
    </section>"""
    for k, n, w, h in OPTIONS
)

HTML = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Matt Sem — four hero designs</title>
<style>{CSS}</style></head><body>
<h1>Four heroes</h1>
<p class="sub">All four cut to a single buy button with Barnes &amp; Noble demoted to a text link,
and all four keep the 4.8 rating above the fold. Those two changes are research, not taste &mdash;
competing CTAs cost conversions, and visible trust signals earn them.</p>
{BODY}
</body></html>
"""

DEST.write_text(HTML, encoding="utf-8")
print(f"wrote {DEST} ({DEST.stat().st_size/1024:.0f} KB)")
