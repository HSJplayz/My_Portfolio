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
  env: {
    NEXT_PUBLIC_BASE_PATH: isStatic ? "/My_Portfolio" : "",
  },
};

export default nextConfig;
