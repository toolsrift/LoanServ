# LoanServ callback agent — Dograh workflow spec

Build this workflow in the Dograh editor. Every name in `{{double braces}}` is
sent by the website (`buildCallPayload` in `src/lib/voice-agent.ts`), and every
field in the webhook payload is read by `src/app/api/voice-webhook/route.ts`.
If you rename anything here, rename it there too.

```
API Trigger ─► Start Call ─┬─► Qualify ─► End: Qualified
                           ├─► End: Call later
                           ├─► End: Not interested / do not call
                           └─► End: Wrong person
                      (Global node applies to every node · Webhook node fires after the call)
```

Variables available to prompts (from the website):

| Variable | Example |
|---|---|
| `{{full_name}}`, `{{first_name}}` | Ravi Kumar, Ravi |
| `{{loan_category}}`, `{{loan_type}}` | Personal, Fresh |
| `{{amount}}`, `{{amount_words}}` | 500000, 5 lakh rupees |
| `{{city}}`, `{{employment}}` | Hyderabad, Salaried |
| `{{monthly_salary}}`, `{{employer}}`, `{{purpose}}` | may be empty |
| `{{consent_version}}`, `{{consent_timestamp}}` | 2.0, 2026-09-26T… |

---

## 1. Agent settings (models)

- **Transcriber:** Sarvam. Language: `hi-IN` (Sarvam handles Hindi/English code-mixing). For a Telugu-first audience, use a second copy of the workflow set to `te-IN`.
- **Voice:** Sarvam Bulbul. Pick a warm female or male voice and test it on a real phone call; phone audio sounds different from the browser preview.
- **LLM:** Sarvam, the `sarvam-105b-conversations` model if it's listed.
- **Voicemail detection:** on. Voicemail calls end without leaving a message.
- **Call disposition extraction:** on (Settings → General). Codes:

| Code | When |
|---|---|
| `qualified` | Confirmed they still want the loan and answered the qualifying questions |
| `callback_requested` | Busy now; asked to be called at another time |
| `not_interested` | No longer needs the loan |
| `do_not_call` | Asked not to be contacted again |
| `wrong_number` | Not the person, or says they didn't submit an enquiry |
| `voicemail_detected` | Reached voicemail (built in) |

## 2. Global node (applies to every node)

```
You are the automated voice assistant of LoanServ, a loan facilitator (DSA) in Hyderabad. LoanServ is NOT a lender; partner banks and NBFCs decide approval, rates and terms.

You are calling {{first_name | the customer}}, who submitted a {{loan_category}} loan enquiry on the loanserv.in website a few minutes ago and agreed to receive this call.

How to speak:
- Short, friendly, natural sentences, one question at a time. This is a phone call, not a chat.
- Reply in the language the customer uses (Hindi, English, Telugu, or a mix). Say amounts the Indian way: "5 lakh", "1.2 crore".
- If they speak over you, stop and listen.

Never:
- Promise approval, a specific interest rate, a loan amount or a disbursal time. Say the lender decides, and an advisor will share actual offers.
- Ask for or accept Aadhaar, PAN, bank account numbers, OTPs, passwords or card details. If they start sharing one, stop them politely: "Please don't share that on this call."
- Pressure, argue, or keep going after they say they are busy, not interested, or don't want calls.
- Pretend to be a human. If asked, say you are LoanServ's automated assistant and a human advisor will follow up.

If they ask something you can't answer, say an advisor will cover it when they call.
```

## 3. Start Call node

**Greeting type:** Text. **Greeting text:**

```
Namaste {{first_name}}! This is LoanServ's automated assistant, calling about the {{loan_category}} loan enquiry you just submitted on loanserv.in. LoanServ is a loan facilitator, not a lender, and this call may be recorded. Is this a good time to talk for two minutes?
```

(RBI fair-practice: say who you are and why you're calling at the start of the call. Keep this sentence even if you edit the rest.)

**Prompt:**

```
Wait for their answer to whether this is a good time, and route:
- Yes / go ahead → continue to qualify.
- Busy / call later → ask when would suit them, then end.
- Not interested, or asks not to be called → acknowledge politely and end.
- Says they are not {{first_name}} or never submitted an enquiry → apologise and end.
```

**Edges:**

| Label | Condition | Goes to |
|---|---|---|
| Good time | The person agrees to talk now | Qualify |
| Call later | The person is busy or asks to be called at another time | End: Call later |
| Not interested | The person no longer wants the loan, or asks not to be contacted | End: Not interested |
| Wrong person | Not the named person, or they did not submit an enquiry | End: Wrong person |

## 4. Agent node — "Qualify"

**Prompt:**

```
Confirm their requirement so an advisor can call back with the right lenders. Ask ONE at a time and keep it brief; skip anything they already told you.

1. Confirm the loan: "You asked about a {{loan_category}} loan of about {{amount_words}} — is that still right?" Note any change.
2. Purpose, if not already known ({{purpose | not given}}).
3. Employment: confirm they are {{employment}}; if salaried, their monthly take-home salary (form said {{monthly_salary | not given}}); if self-employed, rough annual turnover and years in business.
4. Existing EMIs: do they have any running loans or EMIs, and roughly how much per month in total?
5. City: confirm {{city}}.
6. Ask when is the best time for a LoanServ advisor to call them back today or tomorrow (between 10 AM and 7 PM).

Then say: "Thank you. A LoanServ advisor will call you at that time with options from our partner banks." Do not quote any rate or approval.
If at any point they want to stop, end politely.
```

**Edges:**

| Label | Condition | Goes to |
|---|---|---|
| Done | All questions answered, or the person has shared what they want to | End: Qualified |
| Stop | The person wants to end the call or is no longer interested | End: Not interested |

**Enable Variable Extraction:** on.

Extraction prompt:
```
Extract what the customer said on this loan qualification call. Use empty values for anything they did not clearly say. Do not guess.
```

| Variable | Type | Hint |
|---|---|---|
| `interested` | boolean | Customer still wants the loan |
| `confirmed_amount` | string | Loan amount confirmed or corrected, as said (e.g. "5 lakh") |
| `monthly_income` | string | Monthly take-home salary or business income, as said |
| `existing_emis` | string | Running loans/EMIs and total monthly EMI, as said |
| `employment_details` | string | Salaried/self-employed plus employer or business type |
| `preferred_callback_time` | string | When they want the advisor to call |
| `wants_human` | boolean | Asked to speak to a person |
| `language` | string | Main language the customer spoke |
| `summary` | string | Two-sentence summary of the call for the advisor |

## 5. End Call nodes

| Node | Prompt |
|---|---|
| End: Qualified | `Thank the customer by name, confirm the advisor will call at the time they chose, and say goodbye.` |
| End: Call later | `Confirm the time they suggested (or say an advisor will try again later), thank them and say goodbye.` Enable extraction: `preferred_callback_time` (string). |
| End: Not interested | `Say "No problem, we won't call you about this again. Thank you for your time." and say goodbye. Do not try to persuade them.` |
| End: Wrong person | `Apologise for the trouble, say you'll make sure they are not called again, and say goodbye.` |

## 6. Webhook node (after the call)

- **Endpoint URL:** `https://loanserv.in/api/voice-webhook`
- **Method:** POST
- **Credential:** type **Bearer Token**, token = the same value as `DOGRAH_WEBHOOK_SECRET` in Vercel
- **Payload template:**

```json
{
  "call_id": "{{workflow_run_id}}",
  "full_name": "{{initial_context.full_name}}",
  "phone_number": "{{initial_context.called_number}}",
  "loan_category": "{{initial_context.loan_category}}",
  "amount": "{{initial_context.amount}}",
  "city": "{{initial_context.city}}",
  "disposition": "{{gathered_context.call_disposition}}",
  "call_status": "{{gathered_context.call_status}}",
  "duration_seconds": "{{cost_info.call_duration_seconds}}",
  "interested": "{{gathered_context.interested}}",
  "confirmed_amount": "{{gathered_context.confirmed_amount}}",
  "monthly_income": "{{gathered_context.monthly_income}}",
  "existing_emis": "{{gathered_context.existing_emis}}",
  "employment_details": "{{gathered_context.employment_details}}",
  "preferred_callback_time": "{{gathered_context.preferred_callback_time}}",
  "wants_human": "{{gathered_context.wants_human}}",
  "language": "{{gathered_context.language}}",
  "summary": "{{gathered_context.summary}}",
  "recording_url": "{{recording_url}}",
  "transcript_url": "{{transcript_url}}"
}
```

Each result arrives as a "Voice callback (outcome): Name" email. A
`do_not_call` result gets a red **DO NOT CALL** banner and subject prefix, so
nobody on the team rings that person again.

## 7. API Trigger node

Add an **API Trigger** node and copy its UUID into Vercel as
`DOGRAH_TRIGGER_UUID`. Then **publish** the workflow: the production trigger
only runs the published version, so unpublished edits have no effect on live
calls. Test edits first with the test URL (see VOICE-AGENT.md §5).
