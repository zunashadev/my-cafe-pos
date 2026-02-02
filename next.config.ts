import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // request server action sampai 10 MB
    },
  },
  images: {
    // domains: ["https://wshxtjlwrbetlbhllgna.supabase.co"], // ini buat jaga-jaga aja, saat sudah deploy bisa cek apakah jika dihapus aman atau tidak
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wshxtjlwrbetlbhllgna.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
