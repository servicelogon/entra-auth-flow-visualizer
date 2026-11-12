import type { NextConfig } from "next";
import { siteBasePath } from "./lib/site-path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  ...(siteBasePath
    ? {
        // https://nextjs.org/docs/app/guides/static-exports
        // https://github.com/vercel/next.js/blob/canary/examples/github-pages/next.config.js
        output: "export",
        basePath: siteBasePath,
        // Emit /glossary/index.html so GitHub Pages can serve the route.
        // https://nextjs.org/docs/app/guides/static-exports
        trailingSlash: true,
        // next/image has no optimization server in a static export.
        // https://nextjs.org/docs/messages/export-image-api
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
