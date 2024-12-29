import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    ppr: true,
    swcPlugins: [["@lingui/swc-plugin", {}]],
    turbo: {
      rules: {
        "*.po": {
          loaders: ["@lingui/loader"],
          as: "*.js",
        },
      },
    },
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.po$/,
      use: {
        loader: "@lingui/loader",
      },
    });

    return config;
  },
};

export default nextConfig;
