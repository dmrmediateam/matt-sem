#!/usr/bin/env python3
"""
Draw the "Matt Sem" wordmark as outlined SVG paths.

Why outlines rather than styled text, which is what the header does today:

  * A logo must not depend on a webfont loading. As live text the wordmark
    flashes in a fallback face first and renders differently anywhere the
    font fails. As paths it is identical everywhere, works as a favicon and
    in OG images, and needs no font file at all.
  * Set type is not a logotype. What separates the two is letterform work —
    kerning tuned pair by pair rather than left at the font's defaults, and
    usually one deliberate modification. That's only possible on outlines.
  * It has to survive in flat black and white, so nothing here relies on
    colour to hold together.

Every variant is built from the same Rammetto One outlines the site already
uses for headings, so the mark belongs to the page rather than arriving from
somewhere else.
"""

import glob
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

FONT = glob.glob("out/_next/static/media/rammetto*.woff2")[0]
UPEM = 2048

# Kerning tuned by eye, in font units, applied AFTER each pair. Rammetto's
# defaults leave the diagonal of the A open against the T, and the round S
# too far from the E. Negative values pull the pair together.
KERN = {
    "MA": -60,
    "AT": -150,   # the A's diagonal tucks under the T's arm
    "TT": -40,
    "SE": -55,
    "EM": -35,
}

WORD_SPACE = 380  # tighter than the font's own space, which is far too wide


def load():
    font = TTFont(FONT)
    return font, font.getBestCmap(), font.getGlyphSet(), font["hmtx"]


def letters(text: str, tracking: int = 0):
    """Yield (glyph_path, x_offset) laying out `text` with custom kerning."""
    font, cmap, gs, hmtx = load()
    x = 0
    out = []
    for i, ch in enumerate(text):
        if ch == " ":
            x += WORD_SPACE
            continue
        name = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[name].draw(pen)
        out.append((pen.getCommands(), x))
        x += hmtx[name][0] + tracking
        pair = text[i : i + 2]
        if pair in KERN:
            x += KERN[pair]
    return out, x


def svg_line(text: str, tracking: int = 0, transform_extra: str = "") -> tuple[str, int]:
    glyphs, width = letters(text, tracking)
    body = "".join(
        f'<path transform="translate({x} 0)" d="{d}"/>' for d, x in glyphs
    )
    return f"<g {transform_extra}>{body}</g>", width
