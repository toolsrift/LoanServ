import type { NextConfig } from "next";

/**
 * Build a hardening set of security headers applied to every route.
 *
 * CSP is intentionally practical rather than maximal: Next.js relies on inline
 * bootstrap scripts/styles, so 'unsafe-inline' is allowed. GA and AdSense
 * domains are only added to the relevant directives when their env vars are
 * configured, so an un-monetised deploy keeps a tighter policy.
 */
function buildCsp(): string {
  const gaEnabled = !!process.env.NEXT_PUBLIC_GA_ID;
  const adsEnabled = !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  const scriptSrc = ["'self'", "'unsafe-inline'"];
  // React's dev build uses eval() for debugging features; production never does.
  // Allow it only in development so the strict production CSP stays eval-free.
  if (process.env.NODE_ENV !== "production") scriptSrc.push("'unsafe-eval'");
  const connectSrc = ["'self'"];
  const frameSrc = ["'self'"];
  const imgSrc = ["'self'", "data:", "https:"];

  if (gaEnabled) {
    scriptSrc.push("https://www.googletagmanager.com", "https://www.google-analytics.com");
    connectSrc.push("https://www.google-analytics.com", "https://www.googletagmanager.com");
  }
  if (adsEnabled) {
    scriptSrc.push("https://pagead2.googlesyndication.com", "https://*.googlesyndication.com");
    frameSrc.push("https://googleads.g.doubleclick.net", "https://*.googlesyndication.com");
    connectSrc.push("https://pagead2.googlesyndication.com");
  }

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc.join(" ")}`,
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(" ")}`,
    `frame-src ${frameSrc.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: buildCsp() },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
