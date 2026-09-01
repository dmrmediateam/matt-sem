#!/usr/bin/env python3
"""
Build a standalone comparison page showing four desktop header designs.

Each option is rendered live at desktop width, using the site's real palette
tokens and self-hosted fonts (inlined as data URIs), sitting on a slice of
the actual hero background — so what's being judged is the real thing, not a
flat picture of it. Hover states work.
"""

import base64
from pathlib import Path

OUT = Path("out")
DEST = Path("/tmp/header-options.html")

MEDIA = OUT / "_next" / "static" / "media"


def font_uri(stem: str) -> str:
    path = next(MEDIA.glob(f"{stem}*.woff2"))
    return f"data:font/woff2;base64,{base64.b64encode(path.read_bytes()).decode()}"


DISPLAY = font_uri("rammetto")

HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Matt Sem — four desktop header options</title>
<style>
  @font-face {{
    font-family: display;
    src: url({DISPLAY}) format("woff2");
    font-weight: 400;
    font-display: swap;
  }}

  :root {{
    --primary: oklch(0.76 0.09 220);
    --primary-foreground: oklch(0.2 0.04 262);
    --accent: oklch(0.7 0.14 348);
    --background: oklch(0.23 0.032 262);
    --foreground: oklch(0.93 0.012 240);
    --muted-foreground: oklch(0.75 0.02 250);
    --border: oklch(1 0 0 / 12%);
  }}

  * {{ box-sizing: border-box; }}

  body {{
    margin: 0;
    background: oklch(0.17 0.025 262);
    color: var(--foreground);
    font: 400 16px/1.55 ui-sans-serif, system-ui, -apple-system, sans-serif;
    padding: 40px 20px 80px;
  }}

  .page-title {{
    max-width: 1180px;
    margin: 0 auto 8px;
    font-family: display;
    font-size: 1.6rem;
  }}
  .page-sub {{
    max-width: 1180px;
    margin: 0 auto 44px;
    color: var(--muted-foreground);
    font-size: 0.95rem;
  }}

  .option {{ max-width: 1180px; margin: 0 auto 52px; }}

  .option-head {{
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 6px;
  }}
  .badge {{
    font-family: display;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: var(--primary-foreground);
    background: var(--primary);
    padding: 5px 10px;
  }}
  .option-name {{ font-family: display; font-size: 1.15rem; }}
  .option-why {{
    margin: 0 0 14px;
    color: var(--muted-foreground);
    font-size: 0.92rem;
    max-width: 74ch;
  }}

  /* Frame: a slice of the real hero so each header is judged in context. */
  .frame {{
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border);
    background:
      radial-gradient(120% 150% at 78% 0%, oklch(0.28 0.05 265) 0%, oklch(0.23 0.032 262) 55%),
      var(--background);
    height: 260px;
  }}
  .frame-body {{
    padding: 46px 40px;
    max-width: 620px;
  }}
  .kicker {{
    font-family: display;
    font-size: 0.68rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 10px;
  }}
  .headline {{
    font-family: display;
    font-size: 2.5rem;
    margin: 0;
    text-shadow: 0 0 26px oklch(0.76 0.09 220 / 28%);
  }}

  /* ---------- shared header bits ---------- */
  .bar {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 64px;
  }}
  .wordmark {{
    font-family: display;
    color: var(--primary);
    font-size: 1.05rem;
    letter-spacing: 0.02em;
    text-decoration: none;
  }}
  .links {{ display: flex; align-items: center; gap: 30px; }}
  .lnk {{
    position: relative;
    color: var(--muted-foreground);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    padding: 6px 2px 10px;
    white-space: nowrap;
  }}
  .lnk:hover, .lnk.on {{ color: var(--foreground); }}
  .mark {{
    position: absolute; left: -4%; bottom: 0; width: 108%; height: 8px;
    overflow: visible; pointer-events: none; color: var(--accent);
  }}
  .mark path {{
    fill: none; stroke: currentColor; stroke-width: 5; stroke-linecap: round;
    stroke-dasharray: 240; stroke-dashoffset: 240;
    transition: stroke-dashoffset .4s cubic-bezier(.22,1,.36,1);
  }}
  .lnk:hover .mark path, .lnk.on .mark path {{ stroke-dashoffset: 0; }}

  .cta {{
    display: inline-flex; align-items: center; justify-content: center;
    border: 3px solid var(--foreground); border-radius: 0;
    box-shadow: 5px 5px 0 var(--foreground);
    background: var(--primary); color: var(--primary-foreground);
    font-family: display; font-weight: 400; text-transform: uppercase;
    letter-spacing: .02em; font-size: .78rem; padding: 11px 20px;
    text-decoration: none; white-space: nowrap;
    transition: transform .15s, box-shadow .15s;
  }}
  .cta:hover {{ transform: translate(3px,3px); box-shadow: 2px 2px 0 var(--foreground); }}

  /* ---------- A: title page ---------- */
  .a-bar {{ display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
            padding: 0 40px; height: 82px; }}
  .a-left {{ display: flex; gap: 28px; }}
  .a-center {{ text-align: center; }}
  .a-name {{ font-family: display; font-size: 1.45rem; color: var(--foreground); letter-spacing: .01em; }}
  .a-rule {{ height: 2px; background: var(--accent); width: 46px; margin: 7px auto 0; }}
  .a-right {{ display: flex; justify-content: flex-end; }}

  /* ---------- B: now showing ---------- */
  .b-crawl {{
    background: var(--accent); color: oklch(0.16 0.03 340);
    font-family: display; font-size: .68rem; letter-spacing: .1em;
    text-transform: uppercase; padding: 7px 0; overflow: hidden; white-space: nowrap;
  }}
  .b-track {{ display: inline-block; animation: crawl 22s linear infinite; }}
  .b-track span {{ padding: 0 26px; }}
  @keyframes crawl {{ from {{ transform: translateX(0); }} to {{ transform: translateX(-50%); }} }}

  /* ---------- C: tape deck islands ---------- */
  .c-wrap {{ display: flex; align-items: flex-start; justify-content: space-between;
             padding: 18px 28px; gap: 18px; }}
  .island {{
    background: oklch(0.2 0.03 262);
    border: 3px solid var(--foreground);
    box-shadow: 5px 5px 0 var(--foreground);
    padding: 12px 20px; display: flex; align-items: center; gap: 26px;
  }}
  .island .lnk {{ padding: 2px 2px 8px; }}

  /* ---------- D: masthead ---------- */
  .d-wrap {{ padding: 26px 40px 0; }}
  .d-top {{ display: flex; align-items: flex-end; justify-content: space-between; gap: 30px; }}
  .d-name {{ font-family: display; font-size: 2.15rem; line-height: .95; color: var(--foreground); }}
  .d-sub {{ color: var(--muted-foreground); font-size: .82rem; margin-top: 8px; }}
  .d-links {{ display: flex; gap: 26px; padding-bottom: 6px; }}
  .d-rule {{ height: 3px; background: var(--foreground); margin-top: 18px; }}

  .note {{ max-width: 1180px; margin: 0 auto; color: var(--muted-foreground); font-size: .88rem; }}
</style>
</head>
<body>

<h1 class="page-title">Four desktop headers</h1>
<p class="page-sub">Each one is live — hover the links and the buttons. Mobile is untouched;
the VCR menu still handles that.</p>

{{OPTIONS}}

<p class="note">Pick by number, or mix — e.g. the crawl from B on top of the masthead in D.</p>

<script>
  // Duplicate the crawl content so the marquee loops seamlessly at -50%.
  document.querySelectorAll('.b-track').forEach(function (t) {{
    t.innerHTML = t.innerHTML + t.innerHTML;
  }});
</script>
</body>
</html>
"""

MARK = '<svg class="mark" viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M3 8.5C34 4.2 71 3.1 104 4.4c30 1.2 58 3.6 93 1.1"/></svg>'


def link(label: str, on: bool = False) -> str:
    return f'<a class="lnk{" on" if on else ""}" href="#">{label}{MARK}</a>'


def frame(inner: str) -> str:
    return f"""<div class="frame">{inner}
      <div class="frame-body">
        <p class="kicker">Strap yourself in. It&rsquo;s 1986</p>
        <h2 class="headline">The &rsquo;86 Kids</h2>
      </div>
    </div>"""


def option(num: str, name: str, why: str, header_html: str) -> str:
    return f"""<section class="option">
      <div class="option-head"><span class="badge">{num}</span><span class="option-name">{name}</span></div>
      <p class="option-why">{why}</p>
      {frame(header_html)}
    </section>"""


A = option(
    "01",
    "Title page",
    "The author&rsquo;s name is the brand on a book site, so it sits centred like the title on a "
    "jacket, with the links split around it. Symmetry does the work — no CTA competing for the "
    "middle. Borrowed from Monte&rsquo;s three-part split (menu / centred wordmark / booking).",
    f"""<div class="a-bar">
      <div class="a-left">{link("The book", True)}{link("About")}{link("What&rsquo;s next")}</div>
      <div class="a-center"><div class="a-name">Matt Sem</div><div class="a-rule"></div></div>
      <div class="a-right"><a class="cta" href="#">Buy the book</a></div>
    </div>""",
)

B = option(
    "02",
    "Now showing",
    "A cable-TV news crawl runs above a quiet bar, selling the book while it sits there — reviews, "
    "price, where to get it. Era-correct, and it makes the header work rather than just sit. "
    "Structurally it&rsquo;s Zellerfeld&rsquo;s announcement strip above the nav.",
    f"""<div class="b-crawl"><span class="b-track"><span>The &rsquo;86 Kids &mdash; out now</span><span>4.8 out of 5 from Amazon readers</span><span>467 pages of 1985&ndash;86</span><span>Signed copies straight from Wausau</span></span></div>
    <div class="bar">
      <a class="wordmark" href="#">Matt Sem</a>
      <div class="links">{link("The book", True)}{link("About")}{link("What&rsquo;s next")}{link("Contact")}</div>
    </div>""",
)

C = option(
    "03",
    "Tape deck",
    "Two hard-edged islands float over the hero instead of a full-width bar, so the neon opening "
    "isn&rsquo;t capped by a rectangle. The 3px edge and offset shadow are the button system, which "
    "makes the header visibly part of the same kit. Pattern is Garden&rsquo;s split islands.",
    f"""<div class="c-wrap">
      <div class="island"><a class="wordmark" href="#">Matt Sem</a></div>
      <div class="island">{link("The book", True)}{link("About")}{link("What&rsquo;s next")}{link("Contact")}</div>
    </div>""",
)

D = option(
    "04",
    "Masthead",
    "The name set large as a masthead with the book and the town underneath, links kept small and "
    "secondary, and a thick rule closing it off. It reads as a printed cover rather than an app "
    "chrome bar. Closest reference is Runway&rsquo;s Telescope masthead.",
    f"""<div class="d-wrap">
      <div class="d-top">
        <div>
          <div class="d-name">Matt Sem</div>
          <div class="d-sub">The &rsquo;86 Kids &nbsp;&mdash;&nbsp; Wausau, Wisconsin</div>
        </div>
        <div class="d-links">{link("The book", True)}{link("About")}{link("What&rsquo;s next")}{link("Contact")}</div>
      </div>
      <div class="d-rule"></div>
    </div>""",
)


def main() -> None:
    DEST.write_text(HTML.replace("{OPTIONS}", A + B + C + D), encoding="utf-8")
    print(f"wrote {DEST} ({DEST.stat().st_size/1024:.0f} KB)")


if __name__ == "__main__":
    main()
