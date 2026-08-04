import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { loans } from "@/data/loans";
import { calculators } from "@/data/calculators";
import { cities } from "@/data/cities";
import { balanceTransfers } from "@/data/balance-transfer";
import { listDocs } from "@/lib/content";
import { getAllOffers, offerLenderSlugs } from "@/lib/offers";
import { loanCityParams } from "@/lib/loan-city";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();
  const url = (
    path: string,
    priority = 0.7,
    lastModified: Date = now,
  ): MetadataRoute.Sitemap[number] => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  });

  // Real per-page freshness signal: use each doc's `updated`/`date` frontmatter
  // when present, falling back to build time for undated pages.
  const docDate = (d: { frontmatter: { updated?: string; date?: string } }): Date => {
    const raw = d.frontmatter.updated || d.frontmatter.date;
    const parsed = raw ? new Date(raw) : now;
    return Number.isNaN(parsed.getTime()) ? now : parsed;
  };

  const staticPages = [
    "/",
    "/loans",
    "/calculators",
    "/balance-transfer",
    "/locations",
    "/offers",
    "/blog",
    "/news",
    "/about",
    "/contact",
    "/partners",
    "/faq",
    "/apply",
    "/free-cibil-score",
    "/knowledge-center",
    "/knowledge-center/product-info",
    "/knowledge-center/tutorials",
    "/knowledge-center/glossary",
    "/knowledge-center/videos",
  ];

  const legalDocs = listDocs("legal");
  const productInfo = listDocs("knowledge-center/product-info");
  const tutorials = listDocs("knowledge-center/tutorials");
  const blog = listDocs("blog");

  const entries: MetadataRoute.Sitemap = [
    url("/", 1),
    ...staticPages.slice(1).map((p) => url(p, 0.8)),
    ...loans.map((l) => url(`/loans/${l.slug}`, 0.8)),
    ...calculators.map((c) => url(`/calculators/${c.slug}`, 0.7)),
    ...balanceTransfers.map((b) => url(`/balance-transfer/${b.slug}`, 0.7)),
    ...cities.map((c) => url(`/locations/${c.slug}`, 0.7)),
    ...loanCityParams().map((p) => url(`/${p.loanType}/${p.city}`, 0.6)),
    ...offerLenderSlugs().map((s) => url(`/offers/${s}`, 0.6)),
    ...getAllOffers().map((o) => url(`/offers/${o.lenderSlug}/${o.productSlug}`, 0.5)),
    ...blog.map((d) => url(`/blog/${d.slug}`, 0.6, docDate(d))),
    ...productInfo.map((d) => url(`/knowledge-center/product-info/${d.slug}`, 0.6, docDate(d))),
    ...tutorials.map((d) => url(`/knowledge-center/tutorials/${d.slug}`, 0.6, docDate(d))),
    ...legalDocs.map((d) => url(`/legal/${d.slug}`, 0.3, docDate(d))),
  ];

  return entries;
}
