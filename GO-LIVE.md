# Go-Live & Google Search Console checklist

Plain-English steps to take LoanServ from code to "indexed by Google."
Do them **in order** — each builds on the previous one.

Live domain: **https://loanserv.in**

---

## 1. Deploy the site (must be live on HTTPS first)

Google cannot verify or crawl `localhost` — the site has to be on the real domain.

1. Push the code to your Git host (GitHub/GitLab).
2. Import the repo on **Vercel** or **Netlify** (both free for this site).
3. Point the domain **loanserv.in** at the host (add it in the host's Domains
   settings; they give you DNS records to add at your domain registrar).
4. Set the environment variables below in the host's dashboard, then deploy.

### Environment variables to set (copy from `.env.example`)

| Variable | What to put | Needed for |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://loanserv.in` | Canonicals, sitemap, OG — **required** |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Your email (e.g. Gmail App Password / Brevo) | Receiving apply & CIBIL leads by email |
| `LEAD_TO_EMAIL` | Where leads should arrive | Lead delivery |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your number, digits only, e.g. `9198XXXXXXXX` | Floating WhatsApp button |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Token from Search Console (Step 2) | GSC verification |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXX` (optional) | Google Analytics |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-XXXX` (only after AdSense approval) | Auto Ads |

> The site runs fine with the optional ones blank — forms still work (leads get
> logged), no ads load, no analytics. Fill them in when ready.

---

## 2. Verify the site in Google Search Console

1. Go to **https://search.google.com/search-console** → *Add property*.
2. Choose **Domain** property, enter `loanserv.in`.
3. Google gives you a **TXT record** — add it at your domain registrar's DNS.
   (Domain property is best: it covers www + non-www + http + https in one.)
4. Click **Verify**.

*(Alternative if DNS is hard: choose "URL prefix", pick the HTML-tag method,
copy the token into `NEXT_PUBLIC_GSC_VERIFICATION`, redeploy, then Verify. The
code already renders the meta tag when that variable is set.)*

---

## 3. Submit the sitemap

1. In Search Console → **Sitemaps** (left menu).
2. Enter `sitemap.xml` and **Submit**.
3. It should read **Success** with ~214 URLs discovered.

Your sitemap is auto-generated and always current — no manual updates needed
when you add content.

---

## 4. Kick-start indexing (don't just wait)

1. Search Console → **URL Inspection** (top search bar).
2. Paste your most important URLs one at a time and click **Request indexing**:
   - `https://loanserv.in/`
   - `https://loanserv.in/loans/personal-loan`
   - `https://loanserv.in/loans/business-loan`
   - `https://loanserv.in/loans/home-loan`
   - `https://loanserv.in/free-cibil-score`
   - a couple of your best blog posts

---

## 5. Check structured data (rich results)

The site already emits Organization, Breadcrumb, FAQ, and Article data.
Confirm it's valid:

1. Open **https://search.google.com/test/rich-results**.
2. Test `https://loanserv.in/` and one loan page + one blog post.
3. Expect FAQ / Breadcrumb / Article to show as **valid**.

---

## 6. What to watch over the next 1–4 weeks

- **Pages report** (Search Console): pages move from *Discovered* → *Indexed*.
  Some of the 40 city pages and 57 offer pages may sit in
  *"Crawled – currently not indexed"* — that's normal for similar/templated
  pages, not an error.
- **Core Web Vitals** and **Mobile Usability**: check once traffic arrives.
- **Performance report**: see which queries bring visitors.

---

## Also do (not Search Console, but part of launch)

- [ ] Replace the placeholder Twitter handle in `src/lib/site.ts` (`@loanserv`).
- [ ] Confirm the business address/phone in `src/lib/site.ts` is correct.
- [ ] Replace `public/ads.txt` with your real line **after** AdSense approval.
- [ ] (Optional) Create a **Google Business Profile** for local visibility in
      Hyderabad / your service cities.

---

### One-line summary
**Deploy to loanserv.in → verify in Search Console → submit `sitemap.xml` →
request indexing for your top pages.** Submitting the sitemap alone is not
enough; verification + the domain being correct are what make it count.
