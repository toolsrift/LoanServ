import { adsTxt } from "@/lib/adsense";

/** Served at /ads.txt, generated from NEXT_PUBLIC_ADSENSE_CLIENT (see src/lib/adsense.ts). */
export function GET() {
  return new Response(adsTxt(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
