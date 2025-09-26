import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL('https://mgrvjblhrrdqenzoigif.supabase.co/storage/**')],
    },
};

export default nextConfig;
