#!/usr/bin/env python3
"""
Build ONE self-contained .html preview of the site.

Everything is embedded: stylesheet, the two self-hosted woff2 fonts, and
every image, all as data URIs. The output has zero external references, so it
works on double-click, over email, off a USB stick, with no network.

Why inline rather than a folder of files: over file:// the browser blocks
module scripts and cross-origin font/asset fetches, which is what broke the
multi-file version. An inline <style> and an inline <script> have no such
restriction, so the page renders fully AND the page switcher actually works.

The three pages are stacked in one document and toggled by a small script.
That also means the nav is live: clicking Contact swaps pages instead of
hitting a missing file.
"""

import base64
import re
from pathlib import Path

OUT = Path("out")
DEST = Path("/tmp/matt-sem-preview.html")

# Contact is no longer a route - it's the closing section of the home page.
PAGES = [
    ("home", "index.html", "Home"),
    ("book", "books/the-86-kids/index.html", "The book"),
]

MIME = {".woff2": "font/woff2", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".png": "image/png", ".ico": "image/x-icon", ".svg": "image/svg+xml"}


def data_uri(path: Path) -> str:
    mime = MIME.get(path.suffix.lower(), "application/octet-stream")
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def body_of(html: str) -> str:
    m = re.search(r"<body[^>]*>(.*)</body>", html, re.S)
    body = m.group(1) if m else html
    # Drop Next's runtime: it cannot load over file:// and we don't need it.
    body = re.sub(r"<script.*?</script>", "", body, flags=re.S)
    body = re.sub(r"<template.*?</template>", "", body, flags=re.S)
    return body


def inline_css() -> str:
    """Concatenate the built CSS and swap font url()s for data URIs."""
    css_files = sorted((OUT / "_next" / "static").rglob("*.css"))
    css = "\n".join(read(f) for f in css_files)

    for font in (OUT / "_next" / "static" / "media").glob("*.woff2"):
        # Built CSS references these as /_next/static/media/<name> or ../media/<name>
        for pattern in (f"/_next/static/media/{font.name}", f"../media/{font.name}"):
            css = css.replace(pattern, data_uri(font))
    return css


def inline_images(html: str) -> str:
    for img in (OUT / "images").glob("*"):
        if img.is_file():
            html = html.replace(f"/images/{img.name}", data_uri(img))
    return html


def source_shell() -> tuple[str, str]:
    """
    Pull the class attributes off <html> and <body> in the real export.

    This matters more than it looks: next/font generates hashed classes like
    `displayfont_...__variable` on <html>, and THOSE are what define
    --font-display. Hand-writing a plain <html> tag silently drops the
    variable and the whole site falls back to Arial while still looking
    "styled" enough to miss at a glance.
    """
    home = read(OUT / "index.html")
    html_cls = re.search(r"<html[^>]*class=\"([^\"]*)\"", home)
    body_cls = re.search(r"<body[^>]*class=\"([^\"]*)\"", home)
    return (html_cls.group(1) if html_cls else "",
            body_cls.group(1) if body_cls else "")


def main() -> None:
    css = inline_css()
    html_cls, body_cls = source_shell()

    sections = []
    for key, rel, _label in PAGES:
        body = inline_images(body_of(read(OUT / rel)))
        hidden = "" if key == "home" else ' hidden=""'
        sections.append(f'<div class="pv-page" data-page="{key}"{hidden}>{body}</div>')

    switcher_items = "".join(
        f'<button type="button" data-goto="{k}"{" class=\"on\"" if k == "home" else ""}>{lbl}</button>'
        for k, _r, lbl in PAGES
    )

    html = f"""<!DOCTYPE html>
<html lang="en" class="{html_cls}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Matt Sem - preview</title>
<style>
{css}
</style>
<style>
  /* ---- preview chrome only, not part of the real site ---- */

  /* <Reveal> normally flips .reveal to .reveal-visible on scroll. That is
     React, and React is not running here, so force the finished state or the
     page is a column of invisible sections. */
  .reveal {{ opacity: 1 !important; transform: none !important; }}
  .anim-rise {{ animation: none !important; opacity: 1 !important; }}

  .pv-bar {{
    position: fixed; z-index: 9999; left: 50%; bottom: 18px;
    transform: translateX(-50%);
    display: flex; gap: 6px; padding: 6px;
    background: #0f0f1a; border: 2px solid rgba(255,255,255,.28);
    box-shadow: 0 8px 30px rgba(0,0,0,.5);
    font: 500 11px/1 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: .12em; text-transform: uppercase;
  }}
  .pv-bar button {{
    padding: 9px 14px; cursor: pointer; color: #b9b9cc;
    background: transparent; border: 0; letter-spacing: inherit;
    text-transform: inherit; font: inherit;
  }}
  .pv-bar button:hover {{ color: #fff; }}
  .pv-bar button.on {{ background: #6ec7dd; color: #0f0f1a; }}
  .pv-note {{
    position: fixed; z-index: 9999; right: 14px; bottom: 18px;
    max-width: 260px; padding: 10px 12px;
    background: #0f0f1a; border: 2px solid rgba(255,255,255,.18);
    color: #8f8fa6; font: 400 11px/1.5 ui-sans-serif, system-ui, sans-serif;
  }}
  @media (max-width: 720px) {{ .pv-note {{ display: none; }} }}
</style>
</head>
<body class="{body_cls}">
{"".join(sections)}

<nav class="pv-bar" aria-label="Preview pages">{switcher_items}</nav>
<p class="pv-note">Preview file. Scroll animations and the mobile menu are
disabled here; everything else is the real build.</p>

<script>
(function () {{
  var pages = document.querySelectorAll('.pv-page');
  var buttons = document.querySelectorAll('.pv-bar button');

  function show(key) {{
    pages.forEach(function (p) {{ p.hidden = p.dataset.page !== key; }});
    buttons.forEach(function (b) {{ b.classList.toggle('on', b.dataset.goto === key); }});
    window.scrollTo(0, 0);
  }}

  buttons.forEach(function (b) {{
    b.addEventListener('click', function () {{ show(b.dataset.goto); }});
  }});

  // Make the site's own nav work: map its hrefs onto the page switcher, and
  // let in-page anchors scroll normally.
  document.addEventListener('click', function (e) {{
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';

    if (href.indexOf('/books/') === 0) {{ e.preventDefault(); show('book'); return; }}
    if (href === '/') {{ e.preventDefault(); show('home'); return; }}

    var hash = href.indexOf('/#') === 0 ? href.slice(1) : (href.charAt(0) === '#' ? href : null);
    if (hash) {{
      e.preventDefault();
      show('home');
      var target = document.querySelector('.pv-page[data-page="home"] ' + hash);
      if (target) target.scrollIntoView({{ behavior: 'smooth' }});
    }}
  }});
}})();
</script>
</body>
</html>
"""
    DEST.write_text(html, encoding="utf-8")
    kb = DEST.stat().st_size / 1024
    print(f"wrote {DEST} ({kb:.0f} KB)")


if __name__ == "__main__":
    main()
