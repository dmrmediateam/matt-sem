import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "The '86 Kids — a memoir by Matt Sem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0b1030 0%, #131a45 60%, #3b1a5e 100%)",
          color: "#e8ecfa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#ff5fb0",
          }}
        >
          A memoir by Matt Sem
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: 6,
            color: "#7fd4ff",
          }}
        >
          THE &rsquo;86 KIDS
        </div>
        <div style={{ marginTop: 24, fontSize: 32, color: "#aab4d8" }}>
          An awesome and sometimes humorous childhood in the &rsquo;80s
        </div>
      </div>
    ),
    size
  );
}
