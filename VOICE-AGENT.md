# Voice agent (Dograh) — speed-to-lead callback

The site can call a lead back automatically, within seconds of submission (from
`/apply` or the chat assistant's callback form), using a
**[Dograh](https://github.com/dograh-hq/dograh)** voice agent: self-hosted (BSD-2,
no platform fee) or Dograh Cloud. The agent qualifies the lead in Hindi, English or
Telugu, and the outcome, extracted details and recording link come back to you by email.

**It is OFF by default.** With the env vars unset, `/apply` behaves exactly as it
did before — same email, same response, zero added latency path.

---

## What was added to this repo

| File | Role |
|---|---|
| [src/lib/voice-agent.ts](src/lib/voice-agent.ts) | The whole bridge: config gate, RBI calling-window guard, Dograh API Trigger call, webhook Bearer-token check |
| [src/app/api/voice-webhook/route.ts](src/app/api/voice-webhook/route.ts) | Receives the call result and emails it to `LEAD_TO_EMAIL` |
| [src/app/api/apply/route.ts](src/app/api/apply/route.ts) | Fires `requestCallback()` **after** the lead email; consent bumped to `2.0` |
| [src/app/api/chat-lead/route.ts](src/app/api/chat-lead/route.ts) | Same callback for leads from the chat assistant's callback form |
| [src/components/apply/ContactConsentText.tsx](src/components/apply/ContactConsentText.tsx) | Consent wording (both forms) names the automated voice channel explicitly |
| [voice/callback-agent.md](voice/callback-agent.md) | **The Dograh workflow to build:** prompts, extraction variables, outcomes, webhook payload |

Design rules held throughout: the voice call runs **last**, `requestCallback()`
**never throws**, and a voice failure can never lose or delay a lead.

---

## 1. Run Dograh

Pick one:

- **Dograh Cloud (`api.dograh.com`), quickest.** Sign up at app.dograh.com; there's no
  server to run. `DOGRAH_API_URL=https://api.dograh.com`. Before sending real leads,
  check where Dograh Cloud stores recordings and transcripts, and that its terms fit
  your privacy policy.
- **Self-hosted, data stays on your server.** A small VPS (2 vCPU / 4 GB is a
  reasonable start) with a domain and HTTPS, because the telephony provider must reach
  Dograh over public HTTPS and WSS. Follow Dograh's
  [Docker guide](https://github.com/dograh-hq/dograh/blob/main/docs/deployment/docker.mdx)
  ("Option 2: remote server"), then its custom-domain guide.
  `DOGRAH_API_URL=https://<your-dograh-domain>`.

Dograh's own local setup (`http://localhost:3010`) is fine for building and testing
the workflow in the browser, but it can't place real phone calls without a public URL.

## 2. Set up Dograh

1. **Telephony:** in Dograh → Telephony configurations, add your provider (Exotel,
   Plivo, Vobiz and Twilio are supported) and your DLT-registered caller ID. You
   can't do this until the compliance steps below are done.
2. **Models:** enter your Sarvam API key in Dograh's model settings (§3).
3. **Workflow:** build it exactly as specified in
   [voice/callback-agent.md](voice/callback-agent.md): the global persona and
   compliance rules, the greeting with the RBI identity disclosure, the qualifying
   questions, the extraction variables, the call outcomes and the webhook node.
4. **API key:** Settings → API keys → create one for `DOGRAH_API_KEY`.
5. **API Trigger:** add the node, copy its UUID into `DOGRAH_TRIGGER_UUID`, then
   **publish** the workflow. The production trigger only runs published versions.

## 3. Provider stack — Sarvam for all three AI layers

Callers are in Hyderabad / Vijayawada / Vizag / Bangalore / Chennai, so Indic
quality matters more than English polish. Dograh is built on
[Pipecat](https://github.com/pipecat-ai/pipecat), which ships first-class Sarvam
services — so one `SARVAM_API_KEY` covers STT, TTS **and** the LLM.

> **The voice agent's Sarvam key does NOT go in this repo's env.** Enter it in
> Dograh's model settings: for calls, this Next.js app only tells Dograh "call
> this lead" and receives the result. (The website chat
> assistant is different: it calls Sarvam directly with its own key in this app's
> env. Use a separate key for each, see [CHAT-AGENT.md](CHAT-AGENT.md).)

In Dograh, select **Sarvam** as the transcriber, the voice and the LLM. Telugu,
Tamil and Hindi are supported by both Sarvam speech-to-text and Bulbul voices.
Phone audio is 8 kHz, so test voices on a real call rather than in the browser.

| Layer | Pick | List price | ≈ Cost per 3-min call |
|---|---|---|---|
| STT | Sarvam Saaras | ₹30/hr | ₹1.5 |
| TTS | Sarvam Bulbul v3 | ₹30 / 10K chars | ₹4–5 |
| LLM | Sarvam 105B (conversations) | ₹29.28 in / ₹73.20 out per 1M tok | ₹1–2 |
| Telephony | Plivo / Exotel / Twilio India | ~₹0.6–1.5/min | ₹2–5 |
| Hosting | small VPS if self-hosting (Dograh Cloud pricing: see dograh.com) | — | ₹800–2,000/mo fixed |

≈ **₹3–5/min all-in → roughly ₹10–15 per 3-minute qualification call.**
Sarvam's ₹100 of free signup credits covers ~20 test calls' worth of AI usage
(telephony is billed separately by your telco).

Swapping any layer for a non-Indian provider (ElevenLabs TTS, Deepgram STT,
OpenAI/Anthropic LLM) roughly doubles this and generally reads worse in Telugu
and Hindi — keep Sarvam unless a specific voice forces the change.

## 4. Configure this app

Set these in Vercel (Production + Preview), then redeploy. `.env.example` is
gitignored, so this block is the canonical list:

```bash
# The flag + the three DOGRAH_* values must all be set, or the seam no-ops and
# leads behave exactly as before. Provider keys (Sarvam, Exotel/Plivo, ...) live
# in Dograh, not here.
VOICE_AGENT_ENABLED=false
DOGRAH_API_URL=https://api.dograh.com          # or https://<your-dograh-domain>
DOGRAH_API_KEY=                                # Dograh → Settings → API keys (sent as X-API-Key)
DOGRAH_TRIGGER_UUID=                           # the workflow's API Trigger node UUID
DOGRAH_TELEPHONY_CONFIG_ID=                    # optional: Dograh telephony configuration id
DOGRAH_FROM_PHONE_NUMBER_ID=                   # optional: id of your DLT-registered caller ID in Dograh
DOGRAH_WEBHOOK_SECRET=                         # shared with the Webhook node's Bearer credential
```

Generate the webhook secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Put the same value in Dograh as a **Bearer Token** credential on the Webhook node
([voice/callback-agent.md §6](voice/callback-agent.md#6-webhook-node-after-the-call)).
Dograh doesn't sign webhook bodies; the site accepts a result only when
`Authorization: Bearer <secret>` matches, and rejects everything when the secret is unset.

What the site sends (`POST {DOGRAH_API_URL}/api/v1/public/agent/{DOGRAH_TRIGGER_UUID}`):

```json
{
  "phone_number": "+919876543210",
  "initial_context": {
    "full_name": "Ravi Kumar", "first_name": "Ravi",
    "loan_category": "Personal", "loan_type": "Fresh",
    "amount": "500000", "amount_words": "5 lakh rupees",
    "city": "Hyderabad", "employment": "Salaried", "monthly_salary": "60000",
    "employer": "", "purpose": "", "consent_version": "2.0", "consent_timestamp": "2026-09-26T09:12:00.000Z"
  }
}
```

## 5. Test before going live

1. **Workflow alone:** in the Dograh editor, run a web test call. Then call the test
   trigger from a terminal, using your own number:
   ```bash
   curl -X POST "$DOGRAH_API_URL/api/v1/public/agent/test/$DOGRAH_TRIGGER_UUID" \
     -H "Content-Type: application/json" -H "X-API-Key: $DOGRAH_API_KEY" \
     -d '{"phone_number":"+91XXXXXXXXXX","initial_context":{"full_name":"Test User","first_name":"Test","loan_category":"Personal","amount":"500000","amount_words":"5 lakh rupees","city":"Hyderabad","employment":"Salaried"}}'
   ```
2. **Result email:** after that call, a "Voice callback (…)" email should arrive. If it
   doesn't, check the Webhook node's delivery log in Dograh: a `401` means the Bearer
   token doesn't match `DOGRAH_WEBHOOK_SECRET`.
3. **End to end:** set `VOICE_AGENT_ENABLED=true`, redeploy, submit `/apply` with **your
   own** mobile between 08:00 and 19:00 IST, and take the call. Try saying "don't call
   me again": the email should carry the red DO NOT CALL banner.
4. **Guards:** a submission after 19:00 IST logs `voice callback not queued: outside-calling-window`
   and places no call. Vercel logs show only reason strings (`http-401`, `timeout`, …),
   never lead details.

---

## ⚠️ Compliance checklist — do this before dialling anyone but yourself

LoanServ is a DSA in lending, so this is regulated on three axes.
**None of this is legal advice** — confirm the specifics with your telephony
provider's compliance team before spending money on registration.

### Why 140 and not 1600 (the common misconception)

"We only call people who applied, so this isn't telemarketing" is half right.
Consent defeats the **DND** problem. It does not change **who you are** or **what
the call is for**, and those are what pick the number series:

- **1600-series** is reserved for entities regulated by **RBI / SEBI / IRDAI /
  PFRDA** calling their **existing customers** (plus government-to-citizen).
  LoanServ fails both tests: a DSA is not an RBI-regulated entity, and a form
  submitter is a prospect, not a customer.
- **140-series** is for promotional calls **by entities of any sector**. The call's
  purpose is to facilitate a loan sale, so it is a commercial communication. A
  consented promotional call is still a promotional call.

### Why DLT registration is effectively mandatory

Two independent reasons, and the second is the one that actually stops you:

1. Principal Entity registration is required for commercial communication — this
   holds even for transactional messages to your own customers.
2. **Exotel and Plivo both require KYC + DLT registration before they will enable
   outbound voice with a registered caller ID.** You cannot switch this on without
   it, regardless of how you read the regulation.

The line worth understanding: a human dialling a lead back from an ordinary mobile
is not what this regime targets. A CPaaS number plus an automated dialer is.

### ⏱ Consent expires in ~7 days

Explicit consent for promotional calls is valid for roughly **7 days** from grant,
and you may not re-seek consent from someone who opted out within the last 90 days.
This is why the design calls **immediately** on submission and why re-working old
leads is not in scope (see below). TRAI also caps promotional calls at ~3/day and
~8/week per subscriber.

### A website checkbox is not DLT consent

The `consent_version 2.0` record this app stores is real evidence and is what DPDP
needs — but TRAI's Digital Consent Acquisition flow expects consent to be captured
via a **127-series** consent-seeking message and recorded on the DLT platform.
Plan for a 127-series confirmation step between form submit and first dial; ask
your provider what they currently enforce.

### Checklist

**TRAI / DLT**
- [ ] Register as a Principal Entity; register the header and the call-script template.
- [ ] Complete KYC with Exotel/Plivo and rent a **140-series** number.
- [ ] Scrub every number against NCPR/DND **at dial time**, not at import time.
- [ ] Wire DCA (127-series) consent capture; respect the ~7-day validity.

**RBI fair practice (lending)**
- [x] 08:00–19:00 IST only — enforced in code by `isWithinCallingWindow()`.
- [x] Identity + purpose disclosed within 30s — must be in the workflow's opening line.
- [x] State clearly that LoanServ is a DSA facilitator, not a lender.

**DPDP**
- [ ] Set a retention period for recordings/transcripts and actually delete them.
- [x] `/legal/privacy-policy` has an "Automated Voice Callback" section (recording, processors, opt-out).
- [ ] Replace the `CONSENT_RECORD` console log with a durable append-only store (already flagged as a TODO in the apply route).

**Safe lane:** calling a lead who *just* submitted the form, with consent recorded,
from a registered 140 number. **Unsafe lane:** dialling purchased or scraped lists —
reported penalties run to ₹5,000/call for DND breaches and ₹10,000/call for
unregistered-telemarketer status, capped at ₹1 crore/month.

---

## Not done yet (deliberate)

- `/free-cibil-score` leads are **not** wired — its consent text (`1.0`) covers a
  credit check, not a voice call. Wire it only after bumping that consent too.
- No on-site WebRTC "talk to us" widget — phone callback first, browser voice later.
- No retry/queue: one attempt per submission. A no-answer is visible in the result
  email; re-dial logic belongs in Dograh, not here.
- **No dead-lead re-activation.** Promotional consent lapses in ~7 days, so bulk
  re-dialling an old lead list is not a safe use of this agent.
