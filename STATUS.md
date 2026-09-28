# LoanServ status: what's live, what's pending

Last updated: **28 Sep 2026**. Tick items off here as you finish them.

---

## ✅ Live now

| Area | What's working |
|---|---|
| **Website** | loanserv.in is the main domain; `www` redirects to it. Latest code is deployed. |
| **AI chat** | Sarvam chat assistant answers from the site's content and collects callback leads. |
| **Lead pipeline** | Every lead is saved to Supabase (`loanserv`, Mumbai), sent as a Telegram alert (@loanserv_leads_bot), emailed to loanservofficial@gmail.com via Zoho, and recorded in GA4 as `generate_lead`. |
| **Rate limits** | Upstash site-wide limits and the daily chat cap (`CHAT_DAILY_LIMIT`). |
| **Email** | SPF, DKIM (`zmail`) and DMARC all pass. MX records point to Zoho, so mail to contact@loanserv.in arrives. |
| **Google Search Console** | Domain property verified (toolsrift@gmail.com). `https://loanserv.in/sitemap.xml` submitted, top 4 pages sent for indexing, linked to GA4. |
| **Google Analytics** | Property 556078194, 14-month retention, `generate_lead` marked as a key event. |
| **Partner tools** | `/partner-portal` (customer-confirmed referrals) and `/tools/partner-links` (tracked links + QR codes). |
| **Content** | 3 new SEO posts (balance transfer Hyderabad, LAP Vijayawada/Vizag, doctor loans). |
| **AdSense** | Account toolsrift@gmail.com, publisher `pub-4864313539537760`. Site verified and **review requested** (a few days, sometimes 2–4 weeks). `/ads.txt` and the verification tag are live. Auto Ads is on (in-page, anchor, side rail; vignette off). Ads load on every page except the lead forms, partner login, consent confirmations and internal tools, and show only after approval. |
| **WhatsApp assistant (code)** | Deployed. Meta app "LoanServ Assistant" created; token, app secret and verify token saved in Vercel. **Not answering yet**: the webhook still needs saving (below). |

---

## ⏳ Pending: next

### 1. WhatsApp assistant (about 10 minutes, [WHATSAPP-BOT.md](WHATSAPP-BOT.md))
- [ ] **Webhook:** Meta → LoanServ Assistant → WhatsApp → Configuration. Callback URL `https://loanserv.in/api/whatsapp`, type the verify token **yourself** (exactly as in Vercel) → **Verify and save**.
- [ ] Webhook fields → turn on **messages**.
- [ ] API Setup → "To" → add your own mobile as a test recipient (the test number only replies to listed numbers, max 5).
- [ ] App settings → Basic:
  - Privacy Policy URL `https://loanserv.in/legal/privacy-policy`
  - Terms URL `https://loanserv.in/legal/terms`
  - Data deletion URL `https://loanserv.in/legal/privacy-policy`
  - Category Business, and an icon if asked. Then switch **App Mode → Live**.
- [ ] **Test** from your phone: ask a question → reply **CALL** → tap **Yes, call me**. Check Supabase `leads` (form = whatsapp), Telegram and email. Then send **STOP**.
- [ ] In Vercel, confirm `NEXT_PUBLIC_PHONE_NUMBER=919000308525` is set (keeps the Call buttons on your number).

### 2. WhatsApp: when the new SIM arrives
- [ ] API Setup → add the new SIM number (**never 9000308525**, it stays on your WhatsApp Business app). Display name "LoanServ", category Finance.
- [ ] Vercel: set `WHATSAPP_PHONE_NUMBER_ID` to the new number's ID → Redeploy.
- [ ] Decide: should the website's WhatsApp button go to the bot (`NEXT_PUBLIC_WHATSAPP_NUMBER=91<new SIM>`) or stay on 9000308525 (leave it unchanged)?
- [ ] WhatsApp Manager → profile description: "AI assistant for LoanServ. LoanServ is a DSA / loan facilitator, not a lender or bank. … To talk to an advisor, call +91 9000308525."

### 3. Meta business verification
- [ ] Business portfolio "Loan Serv" (ID 1267978663068309): fill in the **legal business name**, address and phone exactly as on your GST/registration.
- [ ] Security Centre → **Business verification**: upload the documents yourself. Until verified, the bot can only reply to a small number of people a day.

### 4. AdSense: waiting for Google's review
- [ ] In a day or two: AdSense → Sites → the ads.txt status for loanserv.in should change from "Not found" to **Authorized** (the file is already live).
- [ ] When the site shows **Ready**: Brand safety → Blocking controls → block competing lenders/DSAs, so your pages don't advertise them.
- [ ] Then check on your phone: ads appear on a loan or blog page, and **not** on Apply or the Free CIBIL check.
- [ ] Optional: Privacy & messaging → European regulations message (Google's consent popup for EU/UK visitors). Without it, those few visitors see limited or no ads.

### 5. Quick checks
- [ ] GA4 → Admin → Events: star **`contact`** once it appears. First tap the WhatsApp button once on your phone.
- [ ] **Vercel deploy limit:** the free plan allows 100 deployments a day across all projects, and toolsrift preview builds used them up on 28 Sep. For **toolsrift** and **toolsrift-html**: Settings → Git → Ignored Build Step → **Only build production**. Also: change several Vercel settings first, then redeploy loan-serv once.
- [ ] Toolsrift previews that the Chrome agent cancelled rebuild on that PR's next push, or click **Redeploy** on them.

---

## 📋 Pending: later

| Item | Notes |
|---|---|
| **Google Business Profile** | Create it for the Nizampet office (LEADS.md §2). Then set `NEXT_PUBLIC_GOOGLE_BUSINESS_URL` and redeploy. |
| **Gmail filter + test data** | Filter lead emails so they're never marked spam; delete test rows in Supabase `leads`. |
| **Sarvam key** | ₹675 of Bulbul TTS usage wasn't from this site. Check the usage, and rotate the key if you don't recognise it. |
| **Voice callback agent** | Off. Needs: Dograh hosted, telephony provider, **DLT registration + 140-series number**, a decision on how long to keep recordings, and legal review ([VOICE-AGENT.md](VOICE-AGENT.md)). |
| **CIBIL form callback** | Decide whether CIBIL-check leads should also get the voice callback. |
| **Legal review** | Have a lawyer review the privacy policy and consent wording (v2.0) before ads and voice go live. |
| **Partner logins** | Send partner names; each gets a login from `scripts/create-partner.mjs` (OPERATIONS.md §5). |
| **Ads** | Google Ads: financial services verification first, then `NEXT_PUBLIC_GOOGLE_ADS_ID` + label. Meta: Pixel + click-to-WhatsApp ads under the **Credit** category (LEADS.md §3). |
| **Site details** | Replace the placeholder Twitter handle in `src/lib/site.ts`. |
