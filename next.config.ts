import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare serves this as static assets. Everything downstream of this
  // setting follows from it: no API routes, no Server Actions, no middleware.
  output: "export",

  // The default image loader needs a server. Without this the build fails.
  images: { unoptimized: true },

  // Must stay in sync with `html_handling` in wrangler.jsonc, or nested routes
  // bounce between trailing-slash variants and 404.
  trailingSlash: true,
};

export default nextConfig;
