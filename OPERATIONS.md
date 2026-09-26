# Operations: lead database, alerts, rate limiting, CI

Each integration here is **off until its env vars are set**, and none of them
can lose a lead: every lead is still emailed even if the database, Telegram or
Upstash is down. Set the variables in Vercel (`loan-serv` → Settings →
Environment Variables, Production + Preview), then redeploy.

Every lead form (apply, chat callback, CIBIL) ends in one place,
[`src/lib/lead-delivery.ts`](src/lib/lead-delivery.ts): store → email → alert
→ voice callback.

---

## 1. Lead database (Supabase): leads, consent records, do-not-call list

**Why:** leads and consent records are otherwise only in email (or, if email
fails, the server log). The database gives you:
- a searchable lead list you can export
- a durable consent record for DPDP
- the **do-not-call list** the voice agent checks before every call

**The voice agent will not place any call without it.**

1. Create a project at [supabase.com](https://supabase.com). Choose region **Mumbai (ap-south-1)** so data stays in India.
2. SQL Editor → paste [`supabase/schema.sql`](supabase/schema.sql) → Run. This creates:
   - `leads`: every submission, with channel, attribution and consent. Never full PAN/DOB.
   - `do_not_call`: numbers never to call. The voice agent adds opt-outs and wrong numbers automatically.
   - `voice_calls`: voice-agent results.

   Row Level Security is on with no policies, so the public key can't touch these tables.
3. Settings → API: copy the **Project URL** and the **service_role** key.

```bash
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # mark Sensitive in Vercel; server-side only
```

**Daily use:** open Table Editor → `leads` to see and export leads. The `status`
column is yours for follow-up tracking (`new`, `called`, `sanctioned`, …).

**Adding a number to do-not-call by hand** (for example, someone asks by email):
```sql
insert into public.do_not_call (mobile, reason, source)
values ('9876543210', 'asked by email', 'manual') on conflict do nothing;
```

## 2. Instant lead alerts (Telegram)

**Why:** email is easy to miss. A phone alert makes the 5–10 minute callback target realistic.

1. In Telegram, message **@BotFather** → `/newbot` → pick a name → copy the **bot token**.
2. Create a group for the advisors, add the bot to it, and send any message in the group.
3. Open `https://api.telegram.org/bot<token>/getUpdates` in a browser and copy `"chat":{"id": ...}`. Group IDs start with `-`.

```bash
TELEGRAM_BOT_TOKEN=123456:ABC...        # Sensitive
TELEGRAM_CHAT_ID=-1001234567890
```

**What gets an alert:**
- every new lead: name, mobile, loan, source, and a "call back within 10 minutes" reminder
- voice-agent results that are `qualified`, `callback_requested` or `do_not_call`

## 3. Shared rate limiting (Upstash Redis)

**Why:** the built-in limits are per server instance, so they're easy to get
around by spreading requests. Upstash makes the limits hold site-wide:
- 5 lead submissions per minute per IP
- 20 chat messages per minute per IP
- a **daily cap on AI chat replies**, which is your ceiling on Sarvam spend

1. Create a Redis database at [upstash.com](https://upstash.com) (region Mumbai).
2. Copy the **REST URL** and **REST token** from the database page.

```bash
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...          # Sensitive
CHAT_DAILY_LIMIT=3000                   # optional; default 3000 replies/day (≈ ₹300/day at list prices)
```

Without Upstash, the same limits apply per server instance (including the
daily cap), which is weaker but still something.

## 4. CI (GitHub Actions)

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push:
**lint → unit tests → production build**. The checks appear on pull requests,
so don't merge a PR while they're red.

Run the tests yourself with:

```bash
npm test
```

The tests in [`tests/`](tests/) use Node's built-in test runner, so there are no
extra packages. They cover:
- chat search, redaction and reply cleanup
- lead-source attribution
- the Supabase, Telegram, Upstash, Sarvam and Dograh clients, using a fake
  `fetch` (no real accounts or network)

## 5. Partner portal (connectors submit leads)

`/partner-portal` (hidden from search) lets referral partners submit customers
who need a loan. This is how large DSAs scale through connectors, but with the
customer's consent built in:

1. **You issue a login:** run `node scripts/create-partner.mjs "Sri Sai Builders"`,
   paste the printed SQL into Supabase → SQL Editor, and give the partner the
   code + access key it prints. The key is shown once; only its hash is stored.
2. **The partner signs in** and enters the customer's name, mobile and loan
   need, and confirms the customer asked them to share it.
3. **LoanServ contacts no one yet.** The partner gets a pre-written WhatsApp
   message with a confirmation link and sends it from **their own phone**.
4. **The customer opens the link**, sees their details (mobile masked), and
   either ticks the same consent box as `/apply` (the referral becomes a lead
   through the normal pipeline, tagged `[Partner: code]`) or chooses "don't
   contact me" (their number goes on the do-not-call list).
5. Links expire after 7 days. The partner sees each referral's status
   (pending, confirmed, declined, expired) but never the full mobile number.

To revoke a partner: `update public.partners set active = false where code = 'sri-sai-builders';`

Needs only the lead database (Supabase); no other settings.

## 6. Partner referral links

`/tools/partner-links` is an internal page, hidden from search engines, that
builds a tracked `?ref=` link and a printable QR code for a partner or a
customer referral. See [LEADS.md](LEADS.md) for how partner credit works.
