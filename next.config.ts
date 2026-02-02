import { defaultPerusahaanImage } from "@/lib/globalFiles";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns: [
      new URL(defaultPerusahaanImage)
    ]
  }
};

export default nextConfig;
