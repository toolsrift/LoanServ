# Voice agent (Dograh) — speed-to-lead callback

The site can call an `/apply` lead back automatically, within seconds of submission,
using a **self-hosted [Dograh](https://github.com/dograh-hq/dograh)** voice agent
(BSD-2, no platform fee). The agent qualifies the lead in Hindi/English and posts
the transcript + outcome back to the site.

**It is OFF by default.** With the env vars unset, `/apply` behaves exactly as it
did before — same email, same response, zero added latency path.

---

## What was added to this repo

| File | Role |
|---|---|
| [src/lib/voice-agent.ts](src/lib/voice-agent.ts) | The whole bridge: config gate, RBI calling-window guard, call request, webhook HMAC verification |
| [src/app/api/voice-webhook/route.ts](src/app/api/voice-webhook/route.ts) | Receives the call result and emails it to `LEAD_TO_EMAIL` |
| [src/app/api/apply/route.ts](src/app/api/apply/route.ts) | Fires `requestCallback()` **after** the lead email; consent bumped to `2.0` |
| [src/components/apply/ApplyForm.tsx](src/components/apply/ApplyForm.tsx) | Consent checkbox now names the automated voice channel explicitly |

Design rules held throughout: the voice call runs **last**, `requestCallback()`
**never throws**, and a voice failure can never lose or delay a lead.

---

## 1. Run Dograh locally

```bash
git clone https://github.com/dograh-hq/dograh.git && cd dograh && docker compose up
```

First boot pulls images (2–3 min). The workflow builder comes up on `http://localhost:3010`.
Confirm the API port your compose file exposes and use it for `DOGRAH_API_URL`.

## 2. Build the qualification workflow

One workflow, roughly this script. It must open with the RBI-required identity
disclosure inside the first 30 seconds:

> "Namaste, this is LoanServ's automated assistant calling about the {{loan_category}}
> loan enquiry you just submitted on loanserv.in. LoanServ is a DSA loan facilitator,
> not a lender. Is this a good time for two quick questions?"

Then confirm/collect: amount, employment, monthly income, existing EMIs, city,
preferred callback time → branch to `qualified: true/false` → offer human handoff.

The workflow reads these variables (names must match [src/lib/voice-agent.ts](src/lib/voice-agent.ts)):

`full_name` · `loan_category` · `loan_type` · `amount` · `city` · `employment` ·
`monthly_salary` · `employer` · `purpose` · `consent_version` · `consent_timestamp`

## 3. Provider stack — Sarvam for all three AI layers

Callers are in Hyderabad / Vijayawada / Vizag / Bangalore / Chennai, so Indic
quality matters more than English polish. Dograh is built on
[Pipecat](https://github.com/pipecat-ai/pipecat), which ships first-class Sarvam
services — so one `SARVAM_API_KEY` covers STT, TTS **and** the LLM.

> **The Sarvam key does NOT go in this repo's `.env.local`.** It belongs in the
> Dograh container's environment. This Next.js app never talks to Sarvam; it only
> tells Dograh "call this lead" and receives the result.

```bash
# in Dograh's .env / docker-compose environment, NOT LoanServ's
SARVAM_API_KEY=sk_...
```

```python
# Pipecat services Dograh wires up (pip install "pipecat-ai[sarvam]")
SarvamRealtimeSTTService(api_key=..., sample_rate=8000)   # saaras:v3-realtime
SarvamTTSService(api_key=..., model="bulbul:v3", voice="anushka", language="hi-IN")
SarvamLLMService(api_key=..., model="sarvam-105b-conversations")
```

Use **8 kHz** sample rate — telephony audio is 8 kHz, and resampling to 16 kHz
just burns latency. `SarvamRealtimeSTTService` does server-side endpointing, which
is what you want on a phone call; `SarvamSTTService` (VAD-segmented, `saaras:v4`)
is the alternative. Telugu and Tamil are supported by both STT and Bulbul TTS.

| Layer | Pick | List price | ≈ Cost per 3-min call |
|---|---|---|---|
| STT | Sarvam Saaras | ₹30/hr | ₹1.5 |
| TTS | Sarvam Bulbul v3 | ₹30 / 10K chars | ₹4–5 |
| LLM | Sarvam 105B (conversations) | ₹29.28 in / ₹73.20 out per 1M tok | ₹1–2 |
| Telephony | Plivo / Exotel / Twilio India | ~₹0.6–1.5/min | ₹2–5 |
| Hosting | small VPS | — | ₹800–2,000/mo fixed |

≈ **₹3–5/min all-in → roughly ₹10–15 per 3-minute qualification call.**
Sarvam's ₹100 of free signup credits covers ~20 test calls' worth of AI usage
(telephony is billed separately by your telco).

Swapping any layer for a non-Indian provider (ElevenLabs TTS, Deepgram STT,
OpenAI/Anthropic LLM) roughly doubles this and generally reads worse in Telugu
and Hindi — keep Sarvam unless a specific voice forces the change.

## 4. Configure this app

Add to `.env.local` (also mirrored in `.env.example`, which is gitignored in this
repo, so this block is the canonical copy):

```bash
# All four + the flag must be set, or the seam no-ops and /apply behaves
# exactly as it did before. Provider keys (SARVAM_API_KEY, Twilio/Plivo, ...)
# do NOT go here — they live in the Dograh container's env. See §3.
VOICE_AGENT_ENABLED=false
DOGRAH_API_URL=http://localhost:8000
DOGRAH_API_KEY=
DOGRAH_WORKFLOW_ID=
DOGRAH_FROM_NUMBER=          # optional: your DLT-registered 140 caller ID
DOGRAH_WEBHOOK_SECRET=
```

Generate the webhook secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use that value for `DOGRAH_WEBHOOK_SECRET` on **both** sides, and point Dograh's
result webhook at `https://loanserv.in/api/voice-webhook`. It must sign the raw
JSON body with HMAC-SHA256 and send it as `x-dograh-signature` (bare hex or
`sha256=<hex>`); if the header name differs in your Dograh version, change the
`WEBHOOK_SIGNATURE_HEADER` constant in `src/lib/voice-agent.ts`.

## 5. Test before going live

1. `VOICE_AGENT_ENABLED=false` → submit `/apply`, confirm the lead email is unchanged.
2. Flip to `true`, submit with **your own** mobile number, take the call.
3. Confirm the result email arrives. Check the server log shows only a reason
   string (`timeout`, `http-401`, …) and never lead PII.
4. Submit at 21:00 IST → the log should read `voice callback not queued: outside-calling-window`.

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
- [ ] Update `/legal/privacy-policy` to disclose call recording and automated processing.
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
