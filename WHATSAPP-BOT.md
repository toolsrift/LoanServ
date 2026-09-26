# WhatsApp assistant

People who message LoanServ's WhatsApp number get the same AI assistant as the
website chat: answers from your own content, in English, Hindi or Telugu. The
assistant turns interested people into leads only after they tap **Yes, call
me** on a consent message. Leads then go through the normal pipeline:
database, email, Telegram alert, and voice callback (when enabled).

It works hand in hand with **click-to-WhatsApp ads** on Facebook and Instagram.
Leads from those ads are tagged `[Meta Ads]` automatically, with the ad
headline recorded as the campaign.

**Off by default.** It needs `WHATSAPP_BOT_ENABLED=true`, the Meta credentials
below, `SARVAM_API_KEY`, and the lead database (Supabase, see OPERATIONS.md).

---

## How it behaves

- **Replies only, never starts conversations.** It answers messages people
  send, inside WhatsApp's 24-hour customer-service window, so it needs no
  message templates or marketing opt-ins.
- **AI disclosure first.** Every new conversation opens with: AI assistant,
  DSA not a lender, rates indicative, don't share Aadhaar/PAN, reply STOP.
- **Consent before any lead.** The consent message uses the same wording as
  the website forms (v2.0, including the voice callback), with **Yes, call
  me** / **Not now** buttons. One lead per person per 24 hours.
- **Loan details are read from the chat.** Amount, city, employment and loan
  type are extracted by AI and marked as such in the email; the advisor
  confirms them on the call. If the basics are missing, no voice call is
  placed and a human advisor calls instead.
- **STOP** (or "unsubscribe", "don't call me") marks the person as opted out
  and adds them to the do-not-call list.
- **Only Indian mobiles** become leads; anyone else can still chat.
- **Shares the chat limits:** 20 messages/minute per person, and the same
  daily AI budget as the website chat (`CHAT_DAILY_LIMIT`).

Code: [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts) (Meta API),
[`src/lib/whatsapp-bot.ts`](src/lib/whatsapp-bot.ts) (conversation),
[`src/app/api/whatsapp/route.ts`](src/app/api/whatsapp/route.ts) (webhook).

## Setup

You need a phone number that is **not** already on the WhatsApp app. Use a new
SIM, or migrate the number after backing up its chats.

1. **Meta Business Manager:** verify your business (business.facebook.com →
   Settings → Business info). Unverified businesses are limited to a small
   number of conversations.
2. **Create an app** at developers.facebook.com → Create app → type **Business**
   → add the **WhatsApp** product.
3. **Add your number:** WhatsApp → API Setup → add phone number, verify by
   SMS or call, and set the display name to "LoanServ" (Meta reviews it).
   Copy the **Phone number ID**.
4. **Permanent access token:** Business settings → System users → add an admin
   system user → assign the app with *full control* → Generate token with
   `whatsapp_business_messaging` and `whatsapp_business_management`. The token
   on the API Setup page expires in 24 hours, so don't use that one.
5. **App secret:** App settings → Basic → App secret.
6. **Set these in Vercel**, then redeploy:

```bash
WHATSAPP_BOT_ENABLED=true
WHATSAPP_ACCESS_TOKEN=EAAG...          # system-user token (Sensitive)
WHATSAPP_PHONE_NUMBER_ID=1234567890
WHATSAPP_APP_SECRET=abc123...          # Sensitive; verifies webhook signatures
WHATSAPP_VERIFY_TOKEN=<any long random string you choose>
# WHATSAPP_GRAPH_VERSION=v23.0         # optional; use the version Meta shows in API Setup
```

7. **Webhook:** App → WhatsApp → Configuration → Edit webhook:
   - Callback URL: `https://loanserv.in/api/whatsapp`
   - Verify token: the same `WHATSAPP_VERIFY_TOKEN`
   - Click **Verify and save**, then **subscribe to the `messages` field**.
8. **Point the site's WhatsApp button at the bot:** set
   `NEXT_PUBLIC_WHATSAPP_NUMBER` to the new number (digits only, with 91) and
   redeploy. The phone links on the site use this number too. If calls should
   still reach your old number, tell me and I'll split the two.

## Test

1. Message the number from your own phone: "What documents do I need for a home loan?"
   You should get the AI disclosure, then an answer with a loanserv.in link.
2. Say "please call me back". The consent message with buttons should appear.
   Tap **Yes, call me**, and a lead email, Telegram alert and database row arrive,
   tagged `[whatsapp / chat]`.
3. Send **STOP**. You should get a confirmation, and your number appears in `do_not_call`.

If nothing arrives, check the Vercel logs for `/api/whatsapp`:
- A `401` means the app secret is wrong.
- `[whatsapp] send failed: http-401` means the access token is wrong or expired.

## Click-to-WhatsApp ads

In Meta Ads Manager, choose **Engagement → Messaging apps → WhatsApp**,
under the **Credit** special ad category. When someone taps the ad and
messages you, the assistant replies instantly. If they become a lead, the
email shows `Channel: Meta Ads` and the ad headline as the campaign.

## Cost

- **WhatsApp:** replies within the 24-hour window that the customer opened are
  free service conversations under Meta's current pricing. Check Meta's pricing
  page for India, as it changes.
- **Sarvam:** each answer costs about the same as a website chat message
  (≈ ₹0.10).

## Compliance

- Check Meta's **WhatsApp Business Messaging Policy** and **Commerce Policy** for
  lending and financial services before launch, and keep the DSA disclosure in
  the business profile description.
- Conversations are stored in `whatsapp_sessions` (last 20 messages). They are
  covered by the privacy policy's "WhatsApp Assistant" section, and your
  retention period applies to them.
