# LoanServ

A production-ready, SEO-first loan-service website for an Indian loan DSA (Direct Selling Agent). Built with Next.js (App Router) + TypeScript + Tailwind. The business earns from AdSense on organic SEO traffic plus loan leads captured through the apply form.

**LoanServ is a loan facilitator / DSA — not a lender.** Loan approval and terms are at the sole discretion of partner banks/NBFCs. All rates/fees shown are indicative.

---

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v3** design tokens (`tailwind.config.ts`) + CSS variables — the "Ledger" system
- **shadcn-style** UI primitives on **Radix** (dialog, accordion, slider, checkbox, label)
- **framer-motion** (subtle reveals), **recharts** (EMI pie + amortization), **lucide-react** icons
- **next/font** — Fraunces (display), Plus Jakarta Sans (body), IBM Plex Mono (tabular numerals)
- **Nodemailer** SMTP lead email in Route Handlers
- **MDX** content (blog, knowledge center, legal) via `next-mdx-remote/rsc` + `gray-matter`
- `app/sitemap.ts` + `app/robots.ts`, `next/og` OG image + favicons
- Deployable to **Vercel Hobby** (free). Node LTS.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything degrades gracefully
npm run dev                  # http://localhost:3000
npm run build                # production build (verifies types + prerenders all pages)
```

Nothing hard-crashes if an env var is missing — each integration falls back to the free path.

## Design system

The single source of truth is `tailwind.config.ts` (tokens) + `src/app/globals.css` (CSS variables). Palette "Ledger": `--ink #0C231E`, `--evergreen #0E5A4A`, `--mint #22C58B`, `--saffron #F6A623`, `--paper #F7F6F1`, `--sand #E7E3D8`, `--slate #2A3A35`. Every financial number uses the `.num` class (IBM Plex Mono, tabular figures, Indian ₹ grouping). See the live **`/style-guide`** route.

## Project structure

```
content/                     MDX: blog/, knowledge-center/{product-info,tutorials}/, legal/
data/offers/*.json           Monthly offer data (one file per lender) + _meta.json
scripts/offers/              Seed generator, monthly refresh, adapter interface + 2 examples
.github/workflows/           monthly-offers.yml (cron on the 1st)
src/
  app/                       Routes (see below) + sitemap/robots/opengraph-image/icon/not-found
  components/                brand, layout, ui, apply, calculators, sections, offers, cibil, seo, ads, motion
  templates/                 Loan | Calculator | Location | BlogPost | Legal | BalanceTransfer | KnowledgeArticle
  data/                      loans, calculators, cities, lenders, balance-transfer, glossary, nav, types
  lib/                       emi, finance, format, email, credit-score, content, offers, news, seo, site
```

### Routes
Home · `/loans` + `/loans/[slug]` · `/balance-transfer` (+`[slug]`) · `/calculators` (+`[slug]`) · `/locations` (+`[city]`) · programmatic `/[loanType]/[city]` · `/offers` (+`[lender]` +`[lender]/[product]`) · `/blog` (+`[slug]`) · `/news` · `/knowledge-center/**` · `/free-cibil-score` · `/about` `/contact` `/partners` `/faq` `/apply` · `/legal/[slug]` · `/style-guide`.

## How to extend

**Add a loan page** → append a `LoanContent` object to `src/data/loans.ts` (unique slug). Add it to `src/data/nav.ts` if it should appear in the mega-menu. The page, sitemap entry and city combos generate automatically.

**Add a calculator** → append a `CalculatorMeta` to `src/data/calculators.ts`. If it needs a new UI, add a component and a `case` in `src/templates/CalculatorPageTemplate.tsx`'s dispatcher.

**Add a city** → append a `CityContent` to `src/data/cities.ts`. To include it in the programmatic loan×city pages, ensure `type: "city"`.

**Add a blog post** → drop an `.mdx` file in `content/blog/` with frontmatter (`title, description, category, date, author, tags`). It appears in the listing, related posts and sitemap automatically.

**Add a legal / knowledge article** → add an `.mdx` file under `content/legal/` or `content/knowledge-center/{product-info,tutorials}/`.

## Leads & email

`POST /api/apply` and `POST /api/cibil-lead` validate with Zod (client + server), apply a honeypot + basic rate-limit, then email the lead via Nodemailer to `LEAD_TO_EMAIL`. No Aadhaar/PAN/bank numbers are collected in the apply form; the CIBIL form treats PAN/DOB as sensitive (HTTPS only, PAN masked in email, not persisted). If SMTP is unset, forms still succeed and log a non-PII warning.

## Ads (AdSense)

Monetisation runs purely on **AdSense Auto Ads** — there are no manual ad slots or placeholders in the layout. When `NEXT_PUBLIC_ADSENSE_CLIENT` is unset, no ad code loads at all. To enable ads: get AdSense approved, set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxx` (this loads the Auto Ads script site-wide via `AutoAds` in `layout.tsx`), turn Auto Ads on in the AdSense dashboard, and replace `public/ads.txt` with your real entry. Google handles ad placement automatically.

## Monthly offers engine

Offers live as structured JSON in `data/offers/`. `verified: false` records are drafts and are **not** presented as current. The GitHub Action (`.github/workflows/monthly-offers.yml`, cron on the 1st):
1. `update-offers.mjs` bumps the visible month label on **verified** records only.
2. Optionally runs best-effort adapters (`ENABLE_OFFER_SCRAPER=true`, off by default) → writes `verified:false` drafts to `_drafts.json`. Never auto-publishes.
3. Opens a review PR listing proposed changes.

Regenerate seed data: `node scripts/offers/generate-seed.mjs "August 2026"`. To publish a figure, confirm it against the lender's page, set `verified: true`, and redeploy.

## Free CIBIL / credit score

`/free-cibil-score` ships the free educational + lead-capture experience today. Real score retrieval requires a **paid, licensed bureau/partner agreement** (CIBIL/TransUnion, Experian, Equifax, CRIF) and compliance with India's Credit Information Companies Act — it cannot be self-hosted for free. Wire it by implementing `fetchCreditScore` in `src/lib/credit-score.ts` and setting `CREDIT_BUREAU_API_URL` / `CREDIT_BUREAU_API_KEY`. Until then the form captures a consented lead.

## Going live — checklist

- [ ] Point `NEXT_PUBLIC_SITE_URL` to the real domain; deploy to Vercel (auto SSL).
- [ ] Set SMTP creds (Gmail App Password / Brevo / Resend) and `LEAD_TO_EMAIL`; send a test lead.
- [ ] Set `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- [ ] Submit `sitemap.xml` in Google Search Console; add `NEXT_PUBLIC_GSC_VERIFICATION`.
- [ ] Add `NEXT_PUBLIC_GA_ID` for Google Analytics.
- [ ] Replace TODO placeholder partner logos with real assets (keep alt text).
- [ ] Verify/replace indicative rates in `src/data/*` and `data/offers/*` before promoting figures.
- [ ] Apply for AdSense; once approved set `NEXT_PUBLIC_ADSENSE_CLIENT`, update `ads.txt` and ad slot IDs.
- [ ] (Optional) Configure a bureau API for live CIBIL scores.

## TODO markers

Search the repo for `TODO:` — partner logos, WhatsApp number, SMTP creds, real interest rates, AdSense ID, bureau API.
