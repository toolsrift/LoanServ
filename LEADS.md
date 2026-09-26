# Getting leads — playbook

The site already captures leads in five ways:
- the Apply form
- the free CIBIL check
- apply buttons across loan, calculator, blog and city pages
- the AI chat's callback form
- the phone and WhatsApp buttons

This playbook covers bringing in visitors and knowing which channel each lead came from.

Work top to bottom. Don't spend on ads until step 1 is done, or you won't know
whether they work.

---

## 1. Go live and measure (week 1)

**Already built into the site:**

| What | Where | How you see it |
|---|---|---|
| **Lead source in every lead email.** Channel, campaign, partner code, referring site, landing page and form page. The subject line ends with the channel, e.g. `[Google Ads]`, `[Partner: sri-sai-builders]`, `[Organic search (google.com)]` | `lib/attribution.ts`, `lib/lead-source.ts` | Your inbox. No setup needed. |
| **`generate_lead` event** in Google Analytics on every form submit (`form_name`: apply / chat / cibil, plus `loan_category`) | `lib/track.ts` | GA4 → Reports → Engagement → Events |
| **`contact` event** on every phone or WhatsApp click (`method`: phone / whatsapp) | `components/seo/LeadTracking.tsx` | GA4 events |
| **`chat_open` event** when someone opens the AI chat | `FloatingButtons.tsx` | GA4 events |
| **Floating WhatsApp button** with a pre-filled "Hi LoanServ…" message | `FloatingButtons.tsx` | Uses `NEXT_PUBLIC_WHATSAPP_NUMBER` |

**Your to-dos:**
- [ ] Deploy, then submit `sitemap.xml` in Search Console (see [GO-LIVE.md](GO-LIVE.md)).
- [ ] Set `NEXT_PUBLIC_GA_ID`, redeploy, then in GA4 → Admin → Events, mark
      **`generate_lead`** and **`contact`** as *key events*. Events appear after the first real lead.
- [ ] Submit one test lead from `https://loanserv.in/?utm_source=test&utm_medium=test`
      and check the email shows `Channel: test / test`.

> Fixed along the way: the site's Content-Security-Policy only allowed
> `www.google-analytics.com`, but GA4 sends data to regional hosts
> (`region1.google-analytics.com`, …), so Analytics would have silently recorded
> nothing. It now allows `*.google-analytics.com` and `*.analytics.google.com`.

---

## 2. Free channels (start now, compound over months)

### Google Business Profile — usually the fastest free source for a local DSA
- [ ] Create or claim the profile at [business.google.com](https://business.google.com)
      for the Nizampet office. Category: *Loan agency* (or *Financial consultant*).
- [ ] Use **exactly** the name, address and phone the site shows (`src/lib/site.ts`).
      Google cross-checks them against the site's structured data, which now includes the phone.
- [ ] Hours Mon–Sat 10:00–19:00, service areas Hyderabad, Vijayawada, Visakhapatnam,
      Bangalore, Chennai, and the website link `https://loanserv.in/?utm_source=google&utm_medium=gbp`
      (so these leads show as `google / gbp` instead of "Direct").
- [ ] Once live, set `NEXT_PUBLIC_GOOGLE_BUSINESS_URL` to the profile URL and redeploy.
- [ ] **Reviews:** after every disbursal, WhatsApp the customer your profile's
      "Ask for reviews" link. Reply to every review. Never offer anything in exchange
      for a review; Google removes those.
- [ ] Post an update weekly (a blog post, a rate-change explainer).

### Referral partners — steady volume
Give every partner their own link. Any lead that arrives through it within 30
days is credited to them in the email subject (`[Partner: <code>]`):

```
https://loanserv.in/?ref=<partner-code>&utm_source=partner&utm_medium=referral
```

Use short lowercase codes with hyphens. Deep links work too, e.g.
`https://loanserv.in/loans/home-loan?ref=sri-sai-builders`.

| Partner type | Loans they send | Link to use |
|---|---|---|
| Builders, property agents | Home loan, LAP, balance transfer | `/loans/home-loan?ref=…` |
| Car dealers | Car, used-car loans | `/loans/car-loan?ref=…` |
| CA / tax firms | Business, self-employed, CA loans | `/loans/business-loan?ref=…` |
| Hospitals, doctor associations | Doctor loans | `/loans/doctor-loan?ref=…` |

Turn each link into a QR code for the partner's counter. Keep a simple sheet of
partner code → name → payout terms, and tally leads monthly from the subject tags.

### Customer referrals
After disbursal, send the customer a link like
`https://loanserv.in/?ref=cust-<firstname>-<mmyy>`, e.g. `cust-ravi-0926`, to share
with friends. Those leads come in tagged `[Partner: cust-ravi-0926]`.

### SEO
About 214 pages are already built, including loan × city pages. Expect roughly
2–6 months to rank. Keep adding city- and question-specific posts; the AI chat
answers from the same content, so every post also improves the assistant.

---

## 3. Paid ads (only after step 1 works)

### Google Search Ads
- [ ] Complete **Google's financial services advertiser verification for India**
      and confirm a DSA qualifies before building campaigns.
- [ ] In Google Ads: Goals → Conversions → New → Website → set it up manually with
      the Google tag. Copy the **conversion ID** (`AW-…`) and **label**.
- [ ] Set `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-…` and `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=…`,
      then redeploy. Every form submit now reports a conversion.
- [ ] Turn on auto-tagging (gclid). Leads from ads then show `[Google Ads]` with no extra setup.
- [ ] Start with high-intent searches in your cities: *home loan balance transfer
      hyderabad*, *loan against property vijayawada*, *business loan for doctors*.
      Point each ad at the matching loan or city page, not the homepage.

### Meta (Facebook / Instagram)
- [ ] Create a Pixel in Events Manager. Set `NEXT_PUBLIC_META_PIXEL_ID`, then redeploy.
      The Pixel **loads only for visitors who click "Accept"** on the cookie banner.
- [ ] Run campaigns under the **Credit** special ad category (required for loans).
      Add `utm_source=facebook&utm_medium=paid&utm_campaign=<name>` to ad URLs.

### Budget
Start at roughly ₹500–1,000 per day per platform. After two weeks, compare
**cost per lead** and **leads that disbursed** by channel (from the email tags).
Cut losers and move budget to winners.

Ad rules: always state "LoanServ is a DSA, not a lender". Never promise approval,
a specific rate or "instant loan". Show rates as indicative ranges only.

---

## 4. Convert what comes in

Whether a lead becomes a loan depends mostly on response time.
- The AI chat answers instantly, and the voice agent (if enabled, see
  [VOICE-AGENT.md](VOICE-AGENT.md)) calls within seconds.
- A person should still call every lead within **5–10 minutes** during office hours.
- Reply to WhatsApp messages within the hour.

## Weekly review (15 minutes)
1. Count last week's lead emails by subject tag (channel).
2. GA4: `generate_lead` by landing page. Which pages convert? Write more like them.
3. Note which leads disbursed. Channel × disbursal is the number that matters.

## Cookie consent

- **"Decline"** on the cookie banner now takes effect: Google tags switch to denied
  and the Meta Pixel never loads.
- **Visitors who haven't chosen** keep the previous behaviour (Analytics on), so
  AdSense and Analytics aren't affected.
- **Lead-source tracking** (step 1) is first-party and stores no ad-click IDs.
  It needs no cookies, so the lead emails show the channel whatever the visitor chose.

## Never
- Buy or scrape phone lists, or cold-dial people who didn't ask. See the DND and
  telemarketer penalties in [VOICE-AGENT.md](VOICE-AGENT.md#-compliance-checklist--do-this-before-dialling-anyone-but-yourself).
- Re-contact old leads in bulk. Promotional-call consent lapses in about 7 days.
