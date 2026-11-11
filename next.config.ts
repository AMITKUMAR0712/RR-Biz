import type { NextConfig } from "next";

const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  ...(process.env.NODE_ENV === "development" ? ["'unsafe-eval'"] : []),
  "https://www.googletagmanager.com",
].join(" ");

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? (process.env.NODE_ENV === "development" ? ".next-dev" : ".next"),
  images: { qualities: [70, 75] },
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: `default-src 'self'; script-src ${scriptSources}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'` },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ],
    }];
  },
};

export default nextConfig;
