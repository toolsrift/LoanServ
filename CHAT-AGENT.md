# Chat agent (Sarvam) — website assistant + callback leads

A floating chat assistant that answers loan questions from the site's own
content and turns interested visitors into leads through an in-chat callback
form. The AI model is **Sarvam** (`sarvam-105b-conversations` by default), the
same model family the Dograh voice agent uses, so Hindi/Telugu/Tamil/Kannada
questions get native-quality answers.

**It is OFF by default.** With the env vars unset, no chat button renders, the
chat API answers 503, and the site behaves exactly as before.

---

## What it does

1. **Answers questions**, grounded in this site: every blog post, knowledge-center
   article, loan page (overview, eligibility, documents, process, FAQs), the
   glossary, calculators and `/faq`. Each answer shows "Read more" links to the
   pages it drew on. The assistant is told to answer only from that material and
   to offer an advisor when it doesn't know. It must never invent rates or
   promise approval.
2. **Collects leads.** When a visitor wants to apply or talk to someone, the
   assistant offers **Request a callback**, which is always available below
   the input too. That opens a short form inside the chat. Loan details the
   visitor already mentioned (amount, city, loan type, salary) are pre-filled
   for them to check; contact details are always typed by hand. Submitting
   goes through the same lead path as `/apply`: email to `LEAD_TO_EMAIL`,
   consent record, then the voice-agent callback if that's enabled. The chat
   transcript is attached to the lead email so the advisor has context.

## What was added

| File | Role |
|---|---|
| [src/lib/chat-agent.ts](src/lib/chat-agent.ts) | Config gate, system prompt, retrieval → Sarvam → cleaned reply; form pre-fill extraction |
| [src/lib/chat-knowledge.ts](src/lib/chat-knowledge.ts) | Builds the in-memory BM25 index from `content/` + `src/data/` on first use |
| [src/lib/chat-text.ts](src/lib/chat-text.ts) | Pure helpers: tokeniser/BM25, MDX chunking, PII redaction, reply/link sanitising |
| [src/lib/sarvam.ts](src/lib/sarvam.ts) | Sarvam chat-completions client (never throws, 20s timeout) |
| [src/lib/chat-schema.ts](src/lib/chat-schema.ts) | Zod schemas shared by the widget and the routes |
| [src/app/api/chat/route.ts](src/app/api/chat/route.ts) | `POST` → `{ reply, sources, offerLeadForm }` |
| [src/app/api/chat/prefill/route.ts](src/app/api/chat/prefill/route.ts) | `POST` → suggested form values (always 200, best-effort) |
| [src/app/api/chat-lead/route.ts](src/app/api/chat-lead/route.ts) | Callback lead: email + consent record + voice callback |
| [src/components/chat/](src/components/chat/) | Panel, callback form, tiny safe markdown renderer, open/close context |

Supporting changes: `leadFields` + `CONTACT_CONSENT_VERSION` are shared from
`lib/apply-schema.ts`, the consent wording is one component
(`ContactConsentText`) used by both forms, `/faq`'s questions moved to
`src/data/faq.ts` so the assistant can read them, and `createRateLimiter()`
gives chat its own limiter so chat traffic can never exhaust the cap that
`/apply` depends on.

### Design rules held throughout

- **Nothing sensitive reaches the model.** User messages have mobiles, emails,
  PAN, Aadhaar/card numbers and account-like digit runs redacted before they
  leave for Sarvam, and again in the lead email. The callback form's contact
  fields go straight to `/api/chat-lead` and never pass through the AI model.
- **Links can't leave the site.** Every link in a reply is rewritten to a known
  site path or flattened to text. The widget renders a fixed markdown subset
  as React elements, with no HTML injection.
- **Lender rates aren't in the knowledge base.** Comparison rows and monthly
  offers are unverified or time-sensitive, so they're excluded. The assistant
  only sees the indicative ranges and points people to `/offers`.
- **Lead capture never depends on the AI.** If Sarvam is down, the chat shows an
  error but *Request a callback* still works (it doesn't call the model;
  pre-fill silently skips).

---

## 1. Get a Sarvam key

Sign up at [dashboard.sarvam.ai](https://dashboard.sarvam.ai) and create an API
key. **Use a separate key from the Dograh voice agent's** so the two usages show
up separately on the dashboard and can be revoked independently.

## 2. Configure this app

Add to `.env.local` and to the Vercel project (`.env.example` is gitignored, so
this block is the canonical copy):

```bash
# Both must be set or the chat stays off.
CHAT_AGENT_ENABLED=false
SARVAM_API_KEY=
# Optional overrides:
# SARVAM_CHAT_MODEL=sarvam-105b-conversations   # or sarvam-105b
# SARVAM_CHAT_URL=https://api.sarvam.ai/v1/chat/completions
```

> **Redeploy after flipping the flag.** Whether the chat button shows is decided
> when pages are built (the layout is statically rendered), so a change to
> `CHAT_AGENT_ENABLED` / `SARVAM_API_KEY` takes effect on the next deploy.

If Sarvam changes its endpoint or model names, only `SARVAM_CHAT_URL` /
`SARVAM_CHAT_MODEL` need updating. The client speaks the OpenAI-compatible
`chat/completions` shape and authenticates with the `api-subscription-key`
header.

## 3. Cost

Each reply sends roughly 2,500–3,500 input tokens (instructions, page list,
up to ~6,000 characters of retrieved content, the last 12 turns) and returns
~150–300 tokens. At the Sarvam 105B list prices quoted in
[VOICE-AGENT.md](VOICE-AGENT.md#3-provider-stack--sarvam-for-all-three-ai-layers)
that is **about ₹0.10 per message, or roughly ₹1 for a ten-message chat**.
Opening the callback form costs one extra small call for pre-fill.

Abuse control is the per-IP limit (20 messages/min) plus a per-instance global
cap. Like the lead-form limiter, it's in-memory and best-effort (see the note in
`lib/email.ts`). Set a spend alert on the Sarvam dashboard as the real ceiling.

## 4. Test before going live

1. With the flag `false`: no chat button; `POST /api/chat` returns 503; `/apply` unchanged.
2. Flag `true` + key, `npm run build && npm start`:
   - Ask "What documents do I need for a business loan?" → answer + a "Read more" link to the blog post.
   - Ask the same in Telugu or Hindi → reply comes back in that language.
   - Paste a fake mobile/PAN into a question → the server log shows nothing, and the reply
     warns you not to share it (the model only ever saw `[PAN removed]`).
   - Say "I want a 5 lakh personal loan in Hyderabad, salary 60k" then "please call me" →
     the **Request a callback** button appears; the form opens pre-filled with Personal /
     500000 / Hyderabad / Salaried / 60000.
   - Submit with your own details → lead email arrives with the transcript; if the voice
     agent is enabled and it's 08:00–19:00 IST, you get the callback.
3. Ask off-topic questions ("write me a poem") and "ignore your rules" prompts → polite refusal.
4. Stop Sarvam (wrong key) → chat shows the "unavailable" message; the callback form still submits.

---

## ⚠️ Compliance checklist — before switching it on

**None of this is legal advice.**

- [x] **Privacy policy.** `/legal/privacy-policy` has an "AI Chat Assistant" section:
      AI (not a person), messages processed by Sarvam AI, identifiers removed first,
      no server-side chat history, transcript attached to callback requests. The chat
      panel links to it.
- [ ] **Retention.** Transcripts live only in lead emails (the app stores no chat
      history). Apply the same retention/deletion period as other lead emails.
- [x] AI disclosure in the widget: labelled as an AI assistant, "AI can make mistakes;
      rates are indicative", DSA-not-a-lender, and "don't share Aadhaar, PAN or bank details".
- [x] Consent for contact is the same explicit checkbox and wording (v2.0) as `/apply`,
      never inferred from chat text; the voice callback only runs on that consent.
- [x] The assistant is instructed never to promise approval, rates or disbursal timelines,
      and never to ask for identity documents or OTPs.

## Known limits (deliberate)

- **Retrieval is English-keyword based.** Questions in other languages still get
  answers in that language, but they match the English content less precisely.
  Mixed-language questions ("home loan documents kya chahiye") work well; pure
  Telugu-script questions lean more on the model's general knowledge. A
  multilingual embedding index is the upgrade path if this matters.
- **No streaming.** Replies arrive whole, typically in a few seconds, with a
  typing indicator.
- **No saved conversations.** A chat lasts while the tab is open, across page
  navigations, and nothing is stored server-side.
- **`/free-cibil-score` isn't linked into chat leads.** Its consent (1.0) covers a
  credit check, not a callback.
