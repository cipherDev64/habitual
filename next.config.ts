import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @ts-ignore - Turbopack type definition might not be in older types, but valid in Next 16
  turbopack: {},
};

export default withPWA(nextConfig);
