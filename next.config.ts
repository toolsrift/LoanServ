import type { NextConfig } from "next";

/**
 * Build a hardening set of security headers applied to every route.
 *
 * CSP is intentionally practical rather than maximal: Next.js relies on inline
 * bootstrap scripts/styles, so 'unsafe-inline' is allowed. GA, Google Ads, Meta and AdSense
 * domains are only added to the relevant directives when their env vars are
 * configured, so an un-monetised deploy keeps a tighter policy.
 */
function buildCsp(): string {
  const gaEnabled = !!process.env.NEXT_PUBLIC_GA_ID;
  // Same check as adsenseClient() in src/lib/adsense.ts: placeholders don't count.
  const adsEnabled = /^(?:ca-)?pub-\d{10,20}$/.test((process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "").trim());
  const googleAdsEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const metaPixelEnabled = !!process.env.NEXT_PUBLIC_META_PIXEL_ID;

  const scriptSrc = ["'self'", "'unsafe-inline'"];
  // React's dev build uses eval() for debugging features; production never does.
  // Allow it only in development so the strict production CSP stays eval-free.
  if (process.env.NODE_ENV !== "production") scriptSrc.push("'unsafe-eval'");
  const connectSrc = ["'self'"];
  const frameSrc = ["'self'"];
  const imgSrc = ["'self'", "data:", "https:"];

  if (gaEnabled || googleAdsEnabled) {
    scriptSrc.push("https://*.googletagmanager.com");
    connectSrc.push("https://*.googletagmanager.com");
  }
  if (gaEnabled) {
    // Google's documented GA4 host list. Hits go to regional hosts (e.g.
    // region1.google-analytics.com), not just www — without the wildcards every
    // event is silently blocked. The doubleclick/google hosts are used when
    // Google signals (demographics) is turned on in GA.
    scriptSrc.push("https://*.google-analytics.com");
    connectSrc.push(
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://*.g.doubleclick.net",
      "https://*.google.com",
      "https://*.google.co.in",
    );
  }
  if (googleAdsEnabled) {
    // Google Ads conversion tracking (Google's documented CSP host list).
    scriptSrc.push("https://www.googleadservices.com", "https://googleads.g.doubleclick.net", "https://www.google.com");
    connectSrc.push(
      "https://www.google.com",
      "https://www.googleadservices.com",
      "https://googleads.g.doubleclick.net",
      "https://pagead2.googlesyndication.com",
    );
    frameSrc.push("https://td.doubleclick.net", "https://www.googletagmanager.com");
  }
  if (metaPixelEnabled) {
    scriptSrc.push("https://connect.facebook.net");
    connectSrc.push("https://www.facebook.com", "https://connect.facebook.net");
  }
  if (adsEnabled) {
    // AdSense Auto Ads: the loader, ad frames, Google's ad-quality checks
    // (adtrafficquality.google) and the consent message for EEA visitors.
    scriptSrc.push(
      "https://pagead2.googlesyndication.com",
      "https://*.googlesyndication.com",
      "https://adservice.google.com",
      "https://www.google.com",
      "https://*.adtrafficquality.google",
      "https://fundingchoicesmessages.google.com",
    );
    frameSrc.push(
      "https://googleads.g.doubleclick.net",
      "https://*.googlesyndication.com",
      "https://www.google.com",
      "https://*.adtrafficquality.google",
    );
    connectSrc.push(
      "https://*.googlesyndication.com",
      "https://*.doubleclick.net",
      "https://adservice.google.com",
      "https://*.google.com",
      "https://*.adtrafficquality.google",
      "https://fundingchoicesmessages.google.com",
    );
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
  // The chat assistant indexes content/ at request time (lib/chat-knowledge),
  // so the MDX must ship inside that route's serverless function.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*"],
  },
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
