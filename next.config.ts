import type { NextConfig } from "next";

// Static export: the `out/` folder is deployed to Firebase Hosting and GitHub Pages.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
