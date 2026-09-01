import { ImageResponse } from "next/og";

/**
 * The wordmark, inlined as a base64 data URI.
 *
 * The card is rendered by satori at build time, which has no access to the
 * app's components or to files on disk — so the mark travels with this file
 * rather than being imported. Regenerate alongside components/wordmark.tsx
 * if the letterforms ever change.
 */
const WORDMARK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjU2MSAxNjgxIiBmaWxsPSIjN2ZkNGZmIj48cGF0aCBkPSJNMTIzIDE1OTdIMzUyTDExMjQgODcyTDE5MTcgMTU5N0gyMTM4VjBIMTQ4MVY1MThMMTA3MyA3MEw2NzYgNTA2VjBIMTIzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyMyAxNjQyKSBzY2FsZSgxIC0xKSIvPjxwYXRoIGQ9Ik0zMyAwIDgyNyAxNTE2UTg1NiAxNTcxIDkxNy4wIDE2MDEuNVE5NzggMTYzMiAxMDQ0IDE2MzJRMTEwMyAxNjMyIDExNTkuNSAxNjA1LjBRMTIxNiAxNTc4IDEyNDcgMTUyMkwyMDk5IDBIMTI4OEwxMjI1IDE1OEg3OTNMNzM5IDBaTTg0MiA0NzVIMTE2NUwxMDEyIDkwN1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwNzggMTY0Mikgc2NhbGUoMSAtMSkiLz48cGF0aCBkPSJNNTcgMTU5N0gxNTY5VjEwNzlIMTEyNFYwSDUwMlYxMDc5SDU3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDA1NiAxNjQyKSBzY2FsZSgxIC0xKSIvPjxwYXRoIGQ9Ik01NyAxNTk3SDE1NjlWMTA3OUgxMTI0VjBINTAyVjEwNzlINTdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NjQwIDE2NDIpIHNjYWxlKDEgLTEpIi8+PHBhdGggZD0iTTEwMCA1MzBRMTA2IDUyOSAxNTYuNSA1MTIuNVEyMDcgNDk2IDI3OS4wIDQ3NS41UTM1MSA0NTUgNDIzLjUgNDM5LjVRNDk2IDQyNCA1NDcgNDI0UTU5MSA0MjQgNjE5LjAgNDM3LjBRNjQ3IDQ1MCA2NDcgNDg1UTY0NyA1MjMgNjA3LjAgNTU0LjBRNTY3IDU4NSA1MDQuNSA2MTguMFE0NDIgNjUxIDM3MS41IDY5My4wUTMwMSA3MzUgMjM4LjUgNzk0LjBRMTc2IDg1MyAxMzYuMCA5MzUuNVE5NiAxMDE4IDk2IDExMzNROTYgMTI3NCAxNTUuMCAxMzcxLjVRMjE0IDE0NjkgMzEzLjUgMTUyOC41UTQxMyAxNTg4IDUzNy41IDE2MTUuMFE2NjIgMTY0MiA3OTMgMTY0MlE5MDQgMTY0MiAxMDAzLjAgMTYzMC4wUTExMDIgMTYxOCAxMTcwLjUgMTYwNC4wUTEyMzkgMTU5MCAxMjU3IDE1ODVWMTEyNlExMjU3IDExMjYgMTIxNS41IDExMzUuMFExMTc0IDExNDQgMTExMS41IDExNTUuMFExMDQ5IDExNjYgOTgyLjUgMTE3NS4wUTkxNiAxMTg0IDg2NiAxMTg0UTgyMCAxMTg0IDc5Ny4wIDExNjguMFE3NzQgMTE1MiA3NzQgMTEzMFE3NzQgMTExMiA3OTQuMCAxMDkwLjVRODE0IDEwNjkgODQyIDEwNTdROTQ3IDEwMTEgMTA0MC4wIDk2My4wUTExMzMgOTE1IDEyMDQuMCA4NTIuMFExMjc1IDc4OSAxMzE1LjUgNjk4LjVRMTM1NiA2MDggMTM1NiA0NzdRMTM1NiAzMjEgMTI3Ny41IDIwNS4wUTExOTkgODkgMTA1MS41IDI1LjBROTA0IC0zOSA2OTYgLTM5UTUxNyAtMzkgNDAxLjAgLTIyLjBRMjg1IC01IDIxOS4wIDE2LjVRMTUzIDM4IDEyNi41IDU1LjBRMTAwIDcyIDEwMCA3MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc2NDQgMTY0Mikgc2NhbGUoMSAtMSkiLz48cGF0aCBkPSJNMTIzIDE1OTdIMTI3NFYxMTM3SDc0NVYxMDA2SDEyNzJWNjE0SDc0NVY0NjNIMTMwOVYwSDEyM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkwMzUgMTY0Mikgc2NhbGUoMSAtMSkiLz48cGF0aCBkPSJNMTIzIDE1OTdIMzUyTDExMjQgODcyTDE5MTcgMTU5N0gyMTM4VjBIMTQ4MVY1MThMMTA3MyA3MEw2NzYgNTA2VjBIMTIzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTA0MjMgMTY0Mikgc2NhbGUoMSAtMSkiLz48L3N2Zz4=";

export const dynamic = "force-static";
export const alt = "The '86 Kids: a memoir by Matt Sem";
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
        <img
          src={WORDMARK}
          alt=""
          width={254}
          height={34}
          style={{ marginTop: 56, opacity: 0.85 }}
        />
      </div>
    ),
    size
  );
}
