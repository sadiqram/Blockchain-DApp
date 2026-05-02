import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logos-world.net",
      },
    ],
  },
};

export default nextConfig;
