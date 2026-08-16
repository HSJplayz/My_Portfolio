import type { NextConfig } from "next";

const isStatic = process.env.BUILD_STATIC === "true";

const nextConfig: NextConfig = {
  ...(isStatic
    ? {
        output: "export" as const,
        basePath: "/My_Portfolio",
        trailingSlash: true,
      }
    : {}),
  images: { unoptimized: true },
};

export default nextConfig;
