/**
 * The Matt Sem wordmark.
 *
 * This is outlined vector, not text in a font. A logo can't wait on a
 * webfont to load, flash a fallback face, or render differently wherever the
 * font fails — so the letterforms are baked to paths. They're the same
 * Rammetto One outlines the headings use, with the kerning rebuilt by hand:
 * the A tucked under the T's arm and the word gap cut well below the font's
 * own, which was far too wide. Default spacing is most of what makes set
 * type read as typed rather than designed.
 *
 * viewBox is the mark's true bounding box, so it crops tight and can be
 * sized by height alone with no stray padding to compensate for.
 *
 * fill is currentColor: the mark takes the colour of whatever it sits in,
 * which is what lets one file serve the cyan header, the footer, and a flat
 * black-on-white version without edits.
 *
 * Regenerate with scripts/make-wordmark.py if the letterforms ever change.
 */
export function Wordmark({
  className,
  title = "Matt Sem",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 12561 1681"
      className={className}
      role="img"
      aria-label={title}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M123 1597H352L1124 872L1917 1597H2138V0H1481V518L1073 70L676 506V0H123Z" transform="translate(-123 1642) scale(1 -1)"/><path d="M33 0 827 1516Q856 1571 917.0 1601.5Q978 1632 1044 1632Q1103 1632 1159.5 1605.0Q1216 1578 1247 1522L2099 0H1288L1225 158H793L739 0ZM842 475H1165L1012 907Z" transform="translate(2078 1642) scale(1 -1)"/><path d="M57 1597H1569V1079H1124V0H502V1079H57Z" transform="translate(4056 1642) scale(1 -1)"/><path d="M57 1597H1569V1079H1124V0H502V1079H57Z" transform="translate(5640 1642) scale(1 -1)"/><path d="M100 530Q106 529 156.5 512.5Q207 496 279.0 475.5Q351 455 423.5 439.5Q496 424 547 424Q591 424 619.0 437.0Q647 450 647 485Q647 523 607.0 554.0Q567 585 504.5 618.0Q442 651 371.5 693.0Q301 735 238.5 794.0Q176 853 136.0 935.5Q96 1018 96 1133Q96 1274 155.0 1371.5Q214 1469 313.5 1528.5Q413 1588 537.5 1615.0Q662 1642 793 1642Q904 1642 1003.0 1630.0Q1102 1618 1170.5 1604.0Q1239 1590 1257 1585V1126Q1257 1126 1215.5 1135.0Q1174 1144 1111.5 1155.0Q1049 1166 982.5 1175.0Q916 1184 866 1184Q820 1184 797.0 1168.0Q774 1152 774 1130Q774 1112 794.0 1090.5Q814 1069 842 1057Q947 1011 1040.0 963.0Q1133 915 1204.0 852.0Q1275 789 1315.5 698.5Q1356 608 1356 477Q1356 321 1277.5 205.0Q1199 89 1051.5 25.0Q904 -39 696 -39Q517 -39 401.0 -22.0Q285 -5 219.0 16.5Q153 38 126.5 55.0Q100 72 100 72Z" transform="translate(7644 1642) scale(1 -1)"/><path d="M123 1597H1274V1137H745V1006H1272V614H745V463H1309V0H123Z" transform="translate(9035 1642) scale(1 -1)"/><path d="M123 1597H352L1124 872L1917 1597H2138V0H1481V518L1073 70L676 506V0H123Z" transform="translate(10423 1642) scale(1 -1)"/>
    </svg>
  );
}
