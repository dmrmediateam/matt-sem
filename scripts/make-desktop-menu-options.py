#!/usr/bin/env python3
"""
Build a page of four WORKING desktop hidden-menu concepts.

Each demo is self-contained inside its own framed viewport, so all four can
sit on one page and be opened independently. Real fonts, real palette, real
images, inlined as data URIs.

Research note carried into every option: NN/g found hidden navigation costs
more on desktop than on mobile. The hedge used throughout is combo
navigation - the trigger is labelled "Menu" with the standard three-line
mark, and the single most important action (Buy the book) stays visible in
the bar even while the links are hidden.
"""

import base64
from pathlib import Path

OUT = Path("out")
DEST = Path("/tmp/desktop-menu-options.html")
MEDIA = OUT / "_next" / "static" / "media"


def font_uri(stem: str) -> str:
    p = next(MEDIA.glob(f"{stem}*.woff2"))
    return f"data:font/woff2;base64,{base64.b64encode(p.read_bytes()).decode()}"


def img_uri(name: str) -> str:
    p = OUT / "images" / name
    return f"data:image/jpeg;base64,{base64.b64encode(p.read_bytes()).decode()}"


DISPLAY = font_uri("rammetto")
COVER = img_uri("86-kids-cover.jpg")
AUTHOR = img_uri("matt-sem-author.jpg")
KIDS = img_uri("matt-sem.jpg")

ITEMS = [
    ("The book", "467 pages of 1985-86", KIDS),
    ("About", "Who Matt is, and why he wrote it", AUTHOR),
    ("What's next", "Three more books in the works", COVER),
    ("Contact", "Say hello, or order a signed copy", KIDS),
]

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
body {{
  margin: 0; padding: 40px 20px 80px;
  background: oklch(0.17 0.025 262); color: var(--fg);
  font: 400 16px/1.55 ui-sans-serif, system-ui, sans-serif;
}}
h1 {{ max-width: 1180px; margin: 0 auto 6px; font-family: display; font-size: 1.6rem; }}
.sub {{ max-width: 1180px; margin: 0 auto 40px; color: var(--muted); font-size: .95rem; }}
.opt {{ max-width: 1180px; margin: 0 auto 52px; }}
.head {{ display: flex; align-items: baseline; gap: 12px; margin-bottom: 6px; }}
.badge {{ font-family: display; font-size: .72rem; letter-spacing: .08em;
          background: var(--primary); color: var(--primary-fg); padding: 5px 10px; }}
.name {{ font-family: display; font-size: 1.15rem; }}
.why {{ margin: 0 0 14px; color: var(--muted); font-size: .92rem; max-width: 78ch; }}

/* Each demo is its own little viewport. */
.stage {{
  position: relative; overflow: hidden; height: 430px;
  border: 1px solid oklch(1 0 0 / 12%);
  background: radial-gradient(120% 150% at 78% 0%, oklch(0.28 0.05 265), oklch(0.23 0.032 262) 55%), var(--bg);
}}
.bar {{ position: relative; z-index: 3; display: flex; align-items: center;
        justify-content: space-between; height: 64px; padding: 0 32px; }}
.wm {{ font-family: display; color: var(--primary); font-size: 1.05rem; }}
.bar-right {{ display: flex; align-items: center; gap: 22px; }}

.trigger {{ display: inline-flex; align-items: center; gap: .55rem; padding: 8px 4px;
            background: none; border: 0; color: var(--fg); cursor: pointer; font: inherit; }}
.bars {{ display: grid; gap: 4px; width: 22px; }}
.bars span {{ display: block; height: 2px; background: currentColor; border-radius: 1px; }}
.trigger-label {{ font-size: .95rem; font-weight: 500; }}

/* Combo-nav hedge: the money action never hides. */
.cta {{ display: inline-flex; align-items: center; border: 3px solid var(--fg); box-shadow: 4px 4px 0 var(--fg);
        background: var(--primary); color: var(--primary-fg); font-family: display; font-size: .72rem;
        text-transform: uppercase; padding: 9px 16px; text-decoration: none; }}

.hero {{ padding: 40px 32px; }}
.kicker {{ font-family: display; font-size: .66rem; letter-spacing: .28em; text-transform: uppercase;
           color: var(--accent); margin: 0 0 10px; }}
.hl {{ font-family: display; font-size: 2.4rem; margin: 0; text-shadow: 0 0 26px oklch(.76 .09 220 / 28%); }}

/* Panels share the same shell; each option restyles the inside. */
.panel {{ position: absolute; inset: 0; z-index: 5; opacity: 0; visibility: hidden;
          transition: opacity .3s ease, visibility .3s; }}
.stage.open .panel {{ opacity: 1; visibility: visible; }}
.close {{ position: absolute; top: 18px; right: 26px; z-index: 7; background: none; border: 0;
          color: var(--fg); font: inherit; cursor: pointer; display: flex; align-items: center; gap: .5rem; }}
.close-x {{ font-size: 1.2rem; line-height: 1; }}
.scan {{ position: absolute; inset: 0; pointer-events: none;
         background: repeating-linear-gradient(to bottom, oklch(1 0 0 / 5%) 0 1px, transparent 1px 3px);
         mix-blend-mode: overlay; }}

/* ---------- 1: marquee takeover ---------- */
.p1 {{ background: oklch(0.14 0.03 262); }}
/* Pushed off-centre and knocked well back: at full-bleed on a wide frame a
   square portrait crops to an enormous face directly behind the type. */
.p1 .art {{ position: absolute; inset: 0; background-size: cover; background-position: 72% 30%;
            opacity: 0; transition: opacity .45s ease; filter: saturate(.55) brightness(.3); }}
.p1 .art.on {{ opacity: 1; }}
.p1 .scrim {{ position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(90deg, oklch(.13 .028 262 / 96%) 0%, oklch(.13 .028 262 / 72%) 42%, transparent 78%); }}
.p1 .list {{ position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column;
             justify-content: center; gap: .1rem; padding: 0 56px; }}
.p1 .row {{ font-family: display; font-size: 2.5rem; color: oklch(1 0 0 / 42%); text-decoration: none;
            line-height: 1.12; transition: color .2s, transform .25s; width: max-content; }}
.p1 .row:hover {{ color: var(--fg); transform: translateX(14px); }}

/* ---------- 2: split deck ---------- */
.p2 {{ background: oklch(0.15 0.03 262); display: grid; grid-template-columns: 1fr 1fr; }}
.p2 .left {{ display: flex; flex-direction: column; justify-content: center; gap: .35rem; padding: 0 48px; }}
.p2 .row {{ font-family: display; font-size: 1.85rem; color: oklch(1 0 0 / 45%); text-decoration: none;
            transition: color .2s; }}
.p2 .row:hover {{ color: var(--fg); }}
.p2 .right {{ position: relative; overflow: hidden; border-left: 3px solid var(--fg); }}
.p2 .prev {{ position: absolute; inset: 0; opacity: 0; transition: opacity .35s ease; }}
.p2 .prev.on {{ opacity: 1; }}
.p2 .prev img {{ width: 100%; height: 100%; object-fit: cover; }}
.p2 .cap {{ position: absolute; left: 0; right: 0; bottom: 0; padding: 16px 20px;
            background: linear-gradient(transparent, oklch(.12 .02 265 / 92%));
            font-size: .86rem; color: var(--fg); }}

/* ---------- 3: channel wall ---------- */
.p3 {{ background: oklch(0.13 0.025 262); padding: 66px 40px 30px; }}
.p3 .grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; height: 100%; }}
.p3 .tile {{ position: relative; overflow: hidden; border: 3px solid var(--fg);
             text-decoration: none; display: flex; flex-direction: column; justify-content: flex-end;
             transition: transform .2s, box-shadow .2s; background: oklch(.2 .03 262); }}
.p3 .tile:hover {{ transform: translate(-3px,-3px); box-shadow: 6px 6px 0 var(--accent); }}
.p3 .tile img {{ position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
                 opacity: .38; filter: saturate(.6); }}
.p3 .tile-body {{ position: relative; padding: 12px; }}
.p3 .ch {{ font-family: display; font-size: .6rem; letter-spacing: .12em; color: var(--primary); }}
.p3 .t {{ font-family: display; font-size: 1.05rem; margin-top: 4px; color: var(--fg); }}

/* ---------- 4: tape drawer ---------- */
.p4 {{ inset: 64px 0 auto 0; height: auto; background: oklch(0.16 0.03 262);
       border-bottom: 3px solid var(--fg); transform: translateY(-12px);
       transition: opacity .28s ease, transform .28s cubic-bezier(.22,1,.36,1), visibility .28s; }}
.stage.open .p4 {{ transform: translateY(0); }}
.p4 .cols {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px; padding: 28px 32px 32px; }}
.p4 .row {{ text-decoration: none; display: block; }}
.p4 .t {{ font-family: display; font-size: 1.15rem; color: var(--fg); }}
.p4 .d {{ font-size: .82rem; color: var(--muted); margin-top: 6px; }}
.p4 .row:hover .t {{ color: var(--accent); }}

@media (prefers-reduced-motion: reduce) {{
  .panel, .p1 .art, .p2 .prev, .p1 .row, .p3 .tile {{ transition: none; }}
}}
"""


def trigger(stage_id: str) -> str:
    return f"""<div class="bar">
      <span class="wm">Matt Sem</span>
      <div class="bar-right">
        <a class="cta" href="#">Buy the book</a>
        <button class="trigger" data-open="{stage_id}" aria-haspopup="dialog" aria-expanded="false">
          <span class="bars" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="trigger-label">Menu</span>
        </button>
      </div>
    </div>
    <div class="hero"><p class="kicker">Strap yourself in. It&rsquo;s 1986</p><h2 class="hl">The &rsquo;86 Kids</h2></div>"""


def closer(stage_id: str) -> str:
    return f'<button class="close" data-close="{stage_id}"><span class="close-x">&times;</span>Close</button>'


def opt(num, name, why, stage_id, panel):
    return f"""<section class="opt">
      <div class="head"><span class="badge">{num}</span><span class="name">{name}</span></div>
      <p class="why">{why}</p>
      <div class="stage" id="{stage_id}">{trigger(stage_id)}{panel}</div>
    </section>"""


rows1 = "".join(
    f'<a class="row" href="#" data-art="{i}">{label}</a>' for i, (label, _h, _im) in enumerate(ITEMS)
)
# The swap is wired per item, but the repo currently holds exactly one
# landscape photo. The square portrait and the cover both crop to an
# unusable close-up at full bleed on a wide frame, so the demo shows the
# one usable image behind every row. Each section gets its own still once
# Matt sends photographs.
arts1 = "".join(
    f'<div class="art{" on" if i == 0 else ""}" data-art="{i}" style="background-image:url({KIDS})"></div>'
    for i, (_l, _h, _im) in enumerate(ITEMS)
)
P1 = f'<div class="panel p1">{arts1}<div class="scrim"></div><div class="scan"></div><div class="list">{rows1}</div>{closer("s1")}</div>'

rows2 = "".join(
    f'<a class="row" href="#" data-prev="{i}">{label}</a>' for i, (label, _h, _im) in enumerate(ITEMS)
)
prevs2 = "".join(
    f'<div class="prev{" on" if i == 0 else ""}" data-prev="{i}"><img src="{im}" alt=""><div class="cap">{hint}</div></div>'
    for i, (_l, hint, im) in enumerate(ITEMS)
)
P2 = f'<div class="panel p2"><div class="left">{rows2}</div><div class="right">{prevs2}<div class="scan"></div></div>{closer("s2")}</div>'

tiles3 = "".join(
    f'<a class="tile" href="#"><img src="{im}" alt=""><div class="tile-body"><div class="ch">CH 0{i+1}</div><div class="t">{label}</div></div></a>'
    for i, (label, _h, im) in enumerate(ITEMS)
)
P3 = f'<div class="panel p3"><div class="scan"></div><div class="grid">{tiles3}</div>{closer("s3")}</div>'

cols4 = "".join(
    f'<a class="row" href="#"><div class="t">{label}</div><div class="d">{hint}</div></a>'
    for label, hint, _im in ITEMS
)
P4 = f'<div class="panel p4"><div class="cols">{cols4}</div></div>'

HTML = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Matt Sem — four desktop menu designs</title>
<style>{CSS}</style></head>
<body>
<h1>Four desktop menus</h1>
<p class="sub">All four work — click <strong>Menu</strong> in any frame to open it, hover the items,
press Escape or Close to dismiss. In every one, <strong>Buy the book</strong> stays visible in the
bar: hidden nav measurably costs discoverability on desktop, so the single most important action
never goes behind the click.</p>

{opt("01", "Marquee takeover", "The whole frame goes dark and the sections become a big type list; hovering one fades a full-bleed photo in behind it. Cinematic and unhurried, and it turns navigation into a look at the book rather than a list of words. Closest reference is A24, which does exactly this with film stills. Each row gets its own photo once Matt sends them &mdash; the repo has one usable landscape shot today, so it sits behind all four here.", "s1", P1)}

{opt("02", "Split deck", "Links on the left, a live preview panel on the right that swaps as you hover. This is the one that genuinely uses desktop space instead of enlarging a phone menu — you see where you&rsquo;re going before you click. Split follows SOTF&rsquo;s panel-plus-imagery layout.", "s2", P2)}

{opt("03", "Channel wall", "Four CRT tiles like flipping through channels, each lifting into a pink offset shadow on hover. The most on-theme of the four and the fastest to scan, since every destination is visible at once rather than stacked in a column.", "s3", P3)}

{opt("04", "Tape drawer", "A shallow drawer slides down from the header, the way a deck door opens, and the page stays visible underneath. The least disruptive option: it doesn&rsquo;t hide the hero, it fits four items with descriptions, and it&rsquo;s the closest in spirit to how the desktop nav behaves now.", "s4", P4)}

<script>
(function () {{
  function setOpen(stage, on) {{
    stage.classList.toggle('open', on);
    var t = stage.querySelector('.trigger');
    if (t) t.setAttribute('aria-expanded', String(on));
  }}

  // Every trigger is a toggle. An earlier version added a second, separate
  // handler for the drawer, so its two listeners opened and then immediately
  // re-closed it on the same click.
  document.querySelectorAll('[data-open]').forEach(function (btn) {{
    btn.addEventListener('click', function () {{
      var stage = document.getElementById(btn.dataset.open);
      setOpen(stage, !stage.classList.contains('open'));
    }});
  }});

  document.querySelectorAll('[data-close]').forEach(function (btn) {{
    btn.addEventListener('click', function () {{
      setOpen(document.getElementById(btn.dataset.close), false);
    }});
  }});

  document.addEventListener('keydown', function (e) {{
    if (e.key === 'Escape') {{
      document.querySelectorAll('.stage.open').forEach(function (s) {{ setOpen(s, false); }});
    }}
  }});

  // Hover-driven artwork in options 1 and 2.
  function wireSwap(scope, attr) {{
    scope.querySelectorAll('[data-' + attr + ']').forEach(function (el) {{
      if (el.tagName !== 'A') return;
      el.addEventListener('mouseenter', function () {{
        var i = el.dataset[attr];
        scope.querySelectorAll('div[data-' + attr + ']').forEach(function (art) {{
          art.classList.toggle('on', art.dataset[attr] === i);
        }});
      }});
    }});
  }}
  wireSwap(document.querySelector('.p1'), 'art');
  wireSwap(document.querySelector('.p2'), 'prev');
}})();
</script>
</body></html>
"""


def main() -> None:
    DEST.write_text(HTML, encoding="utf-8")
    print(f"wrote {DEST} ({DEST.stat().st_size/1024:.0f} KB)")


if __name__ == "__main__":
    main()
