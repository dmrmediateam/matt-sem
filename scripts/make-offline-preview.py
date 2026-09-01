#!/usr/bin/env python3
"""
Turn the Next static export in out/ into a preview that opens with a
double-click (file://), with no server.

Two things break under file:// and both are fixed here:

1. Absolute asset paths. The export links /_next/... and /images/..., which
   file:// resolves against the FILESYSTEM ROOT, not the folder. Every such
   reference is rewritten relative to the file that contains it, including
   url(...) inside the CSS (that's where the self-hosted fonts live).

2. Hydration. React does not reliably hydrate over file://, and .reveal
   starts at opacity:0 and is only switched on by the IntersectionObserver in
   <Reveal>. With no JS that means a page of invisible content. A small
   stylesheet is injected into every page to force the revealed state, so the
   preview shows the real layout whether or not JS runs.

The result is a visual preview, not a working app: the mobile menu and the
scroll-in animations are JS-driven and may not fire. Use `npm run dev` for
behaviour; use this for looking.
"""

import os
import re
import shutil
from pathlib import Path

SRC = Path("out")
DST = Path("/tmp/preview/matt-sem-preview")

# Page URL -> file on disk, used to turn internal links into local paths.
PAGE_MAP = {
    "/": "index.html",
    "/contact/": "contact/index.html",
    "/books/the-86-kids/": "books/the-86-kids/index.html",
}

# Forces the scroll-in state on, so nothing is invisible without JS.
PREVIEW_CSS = """
<style id="offline-preview-overrides">
  /* Injected for the offline preview only - not part of the site.
     <Reveal> normally adds .reveal-visible on scroll; without hydration
     that never happens and every section stays at opacity:0. */
  .reveal { opacity: 1 !important; transform: none !important; }
  .anim-rise { animation: none !important; opacity: 1 !important; }
</style>
"""


def rel_prefix(depth: int) -> str:
    return "./" if depth == 0 else "../" * depth


def rewrite_html(text: str, depth: int) -> str:
    prefix = rel_prefix(depth)

    # Internal page links first, longest path wins so /books/... is not
    # partially matched by /.
    for url in sorted(PAGE_MAP, key=len, reverse=True):
        target = prefix + PAGE_MAP[url]
        text = text.replace(f'href="{url}"', f'href="{target}"')
        text = text.replace(f'href="{url}#', f'href="{target}#')

    # Bare anchors on the home page: href="/#book" handled above; also catch
    # any remaining root-relative asset references.
    text = re.sub(r'(href|src)="/_next/', rf'\1="{prefix}_next/', text)
    text = re.sub(r'(href|src)="/images/', rf'\1="{prefix}images/', text)
    text = re.sub(r'(href|src)="/favicon', rf'\1="{prefix}favicon', text)

    # srcset entries are comma separated and not caught by the above.
    text = text.replace('srcSet="/_next/', f'srcSet="{prefix}_next/')
    text = text.replace('srcset="/_next/', f'srcset="{prefix}_next/')
    text = text.replace("/images/", f"{prefix}images/") if False else text

    # Inject the override stylesheet just before </head>.
    if "</head>" in text:
        text = text.replace("</head>", PREVIEW_CSS + "</head>", 1)
    return text


def rewrite_css(text: str, depth_from_next: int) -> str:
    """
    CSS lives at _next/static/chunks/*.css and references fonts at
    _next/static/media/*. Rewrite /_next/ to climb back out of chunks/.
    """
    prefix = "../" * depth_from_next
    text = text.replace("url(/_next/", f"url({prefix}")
    text = text.replace('url("/_next/', f'url("{prefix}')
    text = text.replace("url(/images/", f"url({prefix}../images/")
    return text


def main() -> None:
    if DST.exists():
        shutil.rmtree(DST)
    DST.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(SRC, DST)

    html_count = css_count = 0

    for path in DST.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(DST)

        if path.suffix == ".html":
            depth = len(rel.parts) - 1
            path.write_text(rewrite_html(path.read_text(encoding="utf-8"), depth), encoding="utf-8")
            html_count += 1

        elif path.suffix == ".css":
            # e.g. _next/static/chunks/foo.css -> 3 levels below _next's parent
            depth_from_next = len(rel.parts) - 1
            path.write_text(
                rewrite_css(path.read_text(encoding="utf-8"), depth_from_next),
                encoding="utf-8",
            )
            css_count += 1

    print(f"rewrote {html_count} html, {css_count} css -> {DST}")


if __name__ == "__main__":
    main()
